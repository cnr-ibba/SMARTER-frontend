export interface ObjectID {
  $oid: string;
}

export interface Multipoint {
  coordinates: number[][];
  type: string;
}

type JSONValue =
    | string
    | number
    | boolean

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface Sample {
  _id: ObjectID;
  alias: string;
  breed: string;
  breed_code: string;
  chip_name: string;
  country: string;
  dataset_id: ObjectID;
  father_id: ObjectID;
  locations: Multipoint;
  metadata: JSONObject;
  mother_id: ObjectID;
  original_id: string;
  phenotype: JSONObject;
  smarter_id: string;
  species: string;
  sex: string;
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
  breed?: string;
  country?: string;
  breed_code?: string;
}
