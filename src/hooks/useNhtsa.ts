import { useQuery } from '@tanstack/react-query';
import { decodeVin, getAllMakes, getModelsForMakeYear } from '@/lib/api/vpic';
import { getRecalls, getRecallMakes, getRecallModels, getRecallModelYears } from '@/lib/api/recalls';
import { getComplaints } from '@/lib/api/complaints';
import { getInvestigations } from '@/lib/api/investigations';
import {
  getRatingsMakes,
  getRatingsModels,
  getRatingsYears,
  getRatingVariants,
  getRatingDetail,
} from '@/lib/api/ratings';
import { searchStationsByZip } from '@/lib/api/carSeat';
import { getVehicleImage } from '@/lib/api/vehicleImage';

const LONG = 1000 * 60 * 30; // 30m
const MED = 1000 * 60 * 5; // 5m

export function useDecodeVin(vin: string | undefined) {
  return useQuery({
    queryKey: ['vin', vin],
    queryFn: () => decodeVin(vin!),
    enabled: !!vin && vin.length >= 11,
    staleTime: LONG,
  });
}

export function useAllMakes() {
  return useQuery({ queryKey: ['vpic', 'makes'], queryFn: getAllMakes, staleTime: LONG });
}

export function useModelsForMakeYear(make: string | undefined, year: number | undefined) {
  return useQuery({
    queryKey: ['vpic', 'models', make, year],
    queryFn: () => getModelsForMakeYear(make!, year!),
    enabled: !!make && !!year,
    staleTime: LONG,
  });
}

export function useRecalls(year?: number, make?: string, model?: string) {
  return useQuery({
    queryKey: ['recalls', year, make, model],
    queryFn: () => getRecalls(year!, make!, model!),
    enabled: !!year && !!make && !!model,
    staleTime: MED,
  });
}

export function useRecallYears() {
  return useQuery({ queryKey: ['recalls', 'years'], queryFn: getRecallModelYears, staleTime: LONG });
}
export function useRecallMakes(year?: number) {
  return useQuery({
    queryKey: ['recalls', 'makes', year],
    queryFn: () => getRecallMakes(year!),
    enabled: !!year,
    staleTime: LONG,
  });
}
export function useRecallModels(year?: number, make?: string) {
  return useQuery({
    queryKey: ['recalls', 'models', year, make],
    queryFn: () => getRecallModels(year!, make!),
    enabled: !!year && !!make,
    staleTime: LONG,
  });
}

export function useComplaints(year?: number, make?: string, model?: string) {
  return useQuery({
    queryKey: ['complaints', year, make, model],
    queryFn: () => getComplaints(year!, make!, model!),
    enabled: !!year && !!make && !!model,
    staleTime: MED,
  });
}

export function useInvestigations(year?: number, make?: string, model?: string) {
  return useQuery({
    queryKey: ['investigations', year, make, model],
    queryFn: () => getInvestigations(year!, make!, model!),
    enabled: !!year && !!make && !!model,
    staleTime: MED,
    retry: 1,
  });
}

export function useRatingsYears() {
  return useQuery({ queryKey: ['ratings', 'years'], queryFn: getRatingsYears, staleTime: LONG });
}
export function useRatingsMakes(year?: number) {
  return useQuery({
    queryKey: ['ratings', 'makes', year],
    queryFn: () => getRatingsMakes(year!),
    enabled: !!year,
    staleTime: LONG,
  });
}
export function useRatingsModels(year?: number, make?: string) {
  return useQuery({
    queryKey: ['ratings', 'models', year, make],
    queryFn: () => getRatingsModels(year!, make!),
    enabled: !!year && !!make,
    staleTime: LONG,
  });
}
export function useRatingVariants(year?: number, make?: string, model?: string) {
  return useQuery({
    queryKey: ['ratings', 'variants', year, make, model],
    queryFn: () => getRatingVariants(year!, make!, model!),
    enabled: !!year && !!make && !!model,
    staleTime: MED,
  });
}
export function useRatingDetail(vehicleId?: number) {
  return useQuery({
    queryKey: ['ratings', 'detail', vehicleId],
    queryFn: () => getRatingDetail(vehicleId!),
    enabled: !!vehicleId,
    staleTime: LONG,
  });
}

export function useCarSeatStations(zip: string | undefined, miles = 25) {
  return useQuery({
    queryKey: ['carseat', zip, miles],
    queryFn: () => searchStationsByZip(zip!, miles),
    enabled: !!zip && /^\d{5}$/.test(zip),
    staleTime: MED,
  });
}

export function useVehicleImage(make?: string, model?: string) {
  return useQuery({
    queryKey: ['vehicleImage', make, model],
    queryFn: () => getVehicleImage(make!, model!),
    enabled: !!make && !!model,
    staleTime: LONG,
    retry: 0, // Wikipedia 404s are expected — don't retry
  });
}
