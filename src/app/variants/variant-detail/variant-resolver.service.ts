
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { Variant } from "../variants.model";
import { VariantsService } from '../variants.service';


@Injectable({
  providedIn: 'root'
})
export class VariantResolver implements Resolve<Variant> {
  constructor(private variantsService: VariantsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Variant> | Promise<Variant> | Variant {
    const _id = String(route.paramMap.get('_id'));
    const species = String(route.paramMap.get('species'));

    return this.variantsService.getVariant(_id, species);
  }
}
