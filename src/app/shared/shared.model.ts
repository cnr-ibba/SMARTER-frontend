import { SortDirection } from "@angular/material/sort";
import { Params } from "@angular/router";

export interface ObjectID {
  $oid: string;
}

export class ObjectDate {
  $date: Date | string;

  constructor(value: string | Date) {
    if (value instanceof Date) {
      this.$date = value;
    } else {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        this.$date = value; // Store the original string
      } else {
        this.$date = date;
      }
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
