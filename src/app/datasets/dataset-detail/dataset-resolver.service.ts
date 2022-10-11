import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { Dataset } from "../datasets.model";
import { DatasetsService } from "../datasets.service";

@Injectable({
  providedIn: 'root'
})
export class DatasetResolver implements Resolve<Dataset> {
  constructor(private datasetsService: DatasetsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Dataset> | Promise<Dataset> | Dataset {
    const _id = String(route.paramMap.get('_id'));
    return this.datasetsService.getDataset(_id);
  }
}
