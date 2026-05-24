export interface YearMakeModel {
  year: number;
  make: string;
  model: string;
}

export interface DecodedVinSummary {
  vin: string;
  make?: string;
  model?: string;
  modelYear?: string;
  manufacturer?: string;
  vehicleType?: string;
  bodyClass?: string;
  fuelType?: string;
  driveType?: string;
  engineCylinders?: string;
  displacementL?: string;
  transmissionStyle?: string;
  plantCountry?: string;
  trim?: string;
  series?: string;
  errorCode?: string;
  errorText?: string;
  /** Original key/value pairs for full detail view */
  raw: Record<string, string>;
}

export interface Recall {
  NHTSACampaignNumber: string;
  Manufacturer: string;
  ReportReceivedDate?: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  Notes?: string;
  ModelYear?: string;
  Make?: string;
  Model?: string;
}

export interface Complaint {
  odiNumber: string;
  manufacturer: string;
  crash: boolean;
  fire: boolean;
  numberOfInjuries: number;
  numberOfDeaths: number;
  dateOfIncident?: string;
  dateComplaintFiled?: string;
  vin?: string;
  components: string;
  summary: string;
  products?: Array<{ year: string; make: string; model: string }>;
}

export interface Investigation {
  nhtsaActionNumber: string;
  make?: string;
  model?: string;
  yearStart?: string;
  yearEnd?: string;
  component?: string;
  summary?: string;
  openDate?: string;
  closeDate?: string;
  subject?: string;
}

export interface RatingsSummary {
  VehicleId: number;
  VehicleDescription: string;
  ModelYear: number;
  Make: string;
  Model: string;
  VehiclePicture?: string;
  OverallRating?: string;
  OverallFrontCrashRating?: string;
  OverallSideCrashRating?: string;
  RolloverRating?: string;
  /** Allow extra fields */
  [key: string]: unknown;
}

export interface CarSeatStation {
  id: string;
  name: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  cpsCertified?: boolean;
}
