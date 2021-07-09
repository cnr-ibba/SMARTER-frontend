
export interface ObjectID {
  "$oid": string;
}

export interface Dataset {
  _id: ObjectID;
  species: string;
  breed: string;
  country: string;
  file: string;
  type: string[];
}

export interface DatasetsAPI {
  items: Dataset[];
  next?: string;
  page: number;
  pages: number;
  prev?: string;
  size: number;
  total: number;
}
