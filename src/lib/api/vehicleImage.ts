const WP_API = 'https://en.wikipedia.org/w/api.php';

/** Resolve the direct image URL (800 px wide) from a Wikipedia File: page title. */
async function getThumbUrl(fileTitle: string): Promise<string | null> {
  const url =
    `${WP_API}?action=query&titles=${encodeURIComponent(fileTitle)}` +
    `&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages ?? {}) as Array<{
      imageinfo?: Array<{ url?: string; thumburl?: string }>;
    }>;
    const info = pages[0]?.imageinfo?.[0];
    return info?.thumburl ?? info?.url ?? null;
  } catch {
    return null;
  }
}

/**
 * Scans every image used in a Wikipedia article and returns the URL of the one
 * whose filename most closely matches the vehicle. Requires the model name in
 * the filename (score >= 2) to avoid manufacturer logos, building photos, etc.
 */
async function bestImageFromArticle(
  articleTitle: string,
  make: string,
  model: string,
): Promise<string | null> {
  const url =
    `${WP_API}?action=query&titles=${encodeURIComponent(articleTitle)}` +
    `&prop=images&imlimit=30&format=json&origin=*`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages ?? {}) as Array<{
      missing?: string;
      images?: Array<{ title: string }>;
    }>;
    const page = pages[0];
    if (!page || 'missing' in page) return null;

    const makeLow = make.toLowerCase();
    const modelLow = model.toLowerCase();

    // +2 if filename contains model name, +1 if it also contains make name.
    // Require score >= 2 so we never pick a building/logo whose name only has the brand.
    const candidates = (page.images ?? [])
      .filter((img) => /\.(jpe?g|png|webp)$/i.test(img.title))
      .map((img) => {
        const n = img.title.toLowerCase();
        const score = (n.includes(modelLow) ? 2 : 0) + (n.includes(makeLow) ? 1 : 0);
        return { title: img.title, score };
      })
      .filter((img) => img.score >= 2)
      .sort((a, b) => b.score - a.score);

    for (const candidate of candidates.slice(0, 3)) {
      const imgUrl = await getThumbUrl(candidate.title);
      if (imgUrl) return imgUrl;
    }
    return null;
  } catch {
    return null;
  }
}

/** Convert ALL-CAPS NHTSA strings to Title Case for Wikipedia lookups. */
function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns a photo URL for the given vehicle make/model, sourced from Wikipedia
 * article images filtered by filename relevance. Returns null if not found.
 */
export async function getVehicleImage(make: string, model: string): Promise<string | null> {
  const m = toTitleCase(make);
  const mod = toTitleCase(model);

  const titles = [
    `${m} ${mod}`,
    `${m} ${mod} (automobile)`,
    `${m} ${mod} (car)`,
  ];

  for (const title of titles) {
    const result = await bestImageFromArticle(title, m, mod);
    if (result) return result;
  }
  return null;
}
