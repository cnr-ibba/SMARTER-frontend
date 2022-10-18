
export interface ObjectID {
  "$oid": string;
}

export interface Dataset {
  _id: ObjectID;
  file: string;
  uploader: string;
  size: string;
  partner: string;
  country: string;
  species: string;
  breed: string;
  n_of_individuals: number;
  n_of_records?: number;
  trait?: string;
  gene_array: string;
  type: string[];
  contents: string[];
  chip_name: string;
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
