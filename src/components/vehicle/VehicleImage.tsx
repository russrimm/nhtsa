import { Car } from 'lucide-react';
import { useVehicleImage } from '@/hooks/useNhtsa';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface VehicleImageProps {
  make: string;
  model: string;
  year?: number | string;
  className?: string;
}

export function VehicleImage({ make, model, year, className }: VehicleImageProps) {
  const { data: src, isLoading } = useVehicleImage(make, model);

  if (isLoading) {
    return <Skeleton className={cn('rounded-xl', className)} />;
  }

  if (!src) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground',
          className,
        )}
      >
        <Car className="h-12 w-12 opacity-30" />
        <span className="text-xs">No image available</span>
      </div>
    );
  }

  return (
    <figure className={cn('overflow-hidden rounded-xl bg-muted', className)}>
      <img
        src={src}
        alt={`${year ? year + ' ' : ''}${make} ${model}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <figcaption className="sr-only">
        {year ? `${year} ` : ''}{make} {model} — image via Wikipedia
      </figcaption>
    </figure>
  );
}
