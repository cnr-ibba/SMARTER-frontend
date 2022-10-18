import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  supportedAssemblies: {[species: string]: string[]} = {
    "Sheep": ["OAR3", "OAR4"],
    "Goat": ["ARS1", "CHI1"]
  }

  constructor() { }
}
