
import { JSONObject, ObjectID } from "../shared/shared.model";

export interface Location {
  ss_id?: string;
  version: string;
  chrom: string;
  position: number;
  alleles?: string;
  illumina?: string;
  illumina_top: string;
  illumina_forward?: string;
  illumina_strand?: string;
  affymetrix_ab?: string;
  strand?: string;
  imported_from: string;
  date?: JSONObject;
}

export interface Probeset {
  chip_name: string;
  probeset_id: string[];
}

export interface Variant {
  _id: ObjectID;
  rs_id: string[];
  chip_name: string[];
  name: string;
  sequence: JSONObject;
  locations: Location[];
  sender?: string;
  probesets?: Probeset[];
  affy_snp_id?: string;
  cust_id?: string;
  illumina_top?: string;
}

export interface VariantsAPI {
  items: Variant[];
  next?: string;
  page: number;
  pages: number;
  prev?: string;
  size: number;
  total: number;
}

export interface VariantsSearch {
  name?: string;
  region?: string;
  chip_name?: string;
  rs_id?: string;
  probeset_id?: string;
}

export interface SupportedChip {
  _id: ObjectID;
  manufacturer?: string;
  n_of_snps?: number;
  name: string;
  species: string;
}

export interface SupportedChipsAPI {
  items: SupportedChip[];
  next?: string;
  page: number;
  pages: number;
  prev?: string;
  size: number;
  total: number;
}
