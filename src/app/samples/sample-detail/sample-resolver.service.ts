
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { Sample } from "../samples.model";
import { SamplesService } from './../samples.service';


@Injectable({
  providedIn: 'root'
})
export class SampleResolver implements Resolve<Sample> {
  constructor(private samplesService: SamplesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sample> | Promise<Sample> | Sample {
    const _id = String(route.paramMap.get('_id'));
    const species = String(route.paramMap.get('species'));
    return this.samplesService.getSample(_id, species);
  }
}
