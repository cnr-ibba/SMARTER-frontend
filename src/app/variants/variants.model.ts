
import { JSONObject, ObjectID } from "../shared/shared.model";

export interface Location {
  ss_id: string;
  version: string;
  chrom: string;
  position: number;
  alleles: string;
  illumina: string;
  illumina_forward: string;
  illumina_strand: string;
  affymetrix_ab: string;
  strand: string;
  imported_from: string;
}

export interface Variant {
  _id: ObjectID;
  rs_id: string[];
  chip_name: string[];
  name: string;
  sequence: JSONObject;
  illumina_top: string;
  locations: Location[];
  sender: string;
  probesets: JSONObject[];
  affy_snp_id: string;
  cust_id: string;
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
