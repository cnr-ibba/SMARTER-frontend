export interface ObjectID {
  $oid: string;
}

export interface Sample {
  _id: ObjectID;
  original_id: string;
  smarter_id: string;
  country: string;
  species: string;
  breed: string;
  breed_code: string;
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
