import { JSONObject, ObjectID } from "../shared/shared.model";

export interface Multipoint {
  coordinates: number[][];
  type: string;
}
export interface Sample {
  _id: ObjectID;
  alias: string;
  breed: string;
  breed_code: string;
  chip_name?: string;
  country: string;
  dataset_id: ObjectID;
  father_id?: ObjectID;
  locations?: Multipoint;
  metadata: JSONObject;
  mother_id?: ObjectID;
  original_id: string;
  phenotype: JSONObject;
  smarter_id: string;
  species: string;
  sex?: string;
  type: string;
}

export interface SamplesAPI {
  items: Sample[];
  next?: string;
  page: number;
  pages: number;
  prev?: string;
  size: number;
  total: number;
}

export interface SamplesSearch {
  smarter_id?: string;
  original_id?: string;
  dataset?: string;
  breed?: string;
  breed_code?: string;
  country?: string;
}

export interface Country {
  _id: ObjectID;
  alpha_2: string;
  alpha_3: string;
  name: string;
  numeric?: number;
  official_name?: string;
  species: string[];
}

export interface CountriesAPI {
  items: Country[];
  next?: string | null;
  page: number;
  pages: number;
  prev?: string | null;
  size: number;
  total: number;
}
