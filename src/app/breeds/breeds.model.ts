import { ObjectID } from "../shared/shared.model";

export interface Breed {
  _id: ObjectID;
  species: string;
  name: string;
  code: string;
  n_individuals: number;
}

export interface BreedsAPI {
  items: Breed[];
  next?: string;
  page: number;
  pages: number;
  prev?: string;
  size: number;
  total: number;
}
