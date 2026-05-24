import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadCompare, saveCompare, MAX_COMPARE } from '@/lib/store/compare';
import type { CompareVehicle } from '@/lib/store/compare';

interface CompareCtx {
  list: CompareVehicle[];
  add: (v: CompareVehicle) => void;
  remove: (v: CompareVehicle) => void;
  clear: () => void;
  isInCompare: (v: CompareVehicle) => boolean;
  isFull: boolean;
}

const Ctx = createContext<CompareCtx | null>(null);

function same(a: CompareVehicle, b: CompareVehicle) {
  return a.year === b.year && a.make === b.make && a.model === b.model;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<CompareVehicle[]>(loadCompare);

  const add = useCallback((v: CompareVehicle) => {
    setList((cur) => {
      if (cur.length >= MAX_COMPARE || cur.some((x) => same(x, v))) return cur;
      const next = [...cur, v];
      saveCompare(next);
      return next;
    });
  }, []);

  const remove = useCallback((v: CompareVehicle) => {
    setList((cur) => {
      const next = cur.filter((x) => !same(x, v));
      saveCompare(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    saveCompare([]);
    setList([]);
  }, []);

  const isInCompare = useCallback(
    (v: CompareVehicle) => list.some((x) => same(x, v)),
    [list],
  );

  return (
    <Ctx.Provider value={{ list, add, remove, clear, isInCompare, isFull: list.length >= MAX_COMPARE }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
}
