import { SortDirection } from "@angular/material/sort";
import { Params } from "@angular/router";

export interface ObjectID {
  $oid: string;
}

export class ObjectDate {
  $date: Date;

  constructor(value: string | Date) {
    if (value instanceof Date) {
      this.$date = value;
    } else {
      this.$date = new Date(value);
    }
  }
}

// https://dev.to/ankittanna/how-to-create-a-type-for-complex-json-object-in-typescript-d81
export type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> { }

export interface PaginationParams extends Params {
  page?: number;
  size?: number;
  sort?: string;
  order?: SortDirection;
}
