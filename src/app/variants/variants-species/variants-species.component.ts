import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { VariantsService } from '../variants.service';

@Component({
  selector: 'app-variants-species',
  templateUrl: './variants-species.component.html',
  styleUrls: ['./variants-species.component.scss']
})
export class VariantsSpeciesComponent implements OnInit, OnChanges {
  @Input() selectedSpecie = "Sheep";
  selectedIndex = 0;
  selectedAssembly = '';
  tabs: string[] = [];

  constructor(
    private variantsService: VariantsService,
  ) { }

  ngOnInit(): void {
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // triggered when selectedSpecie changes
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
    this.getVariants();
  }

  indexChanged(index: number): void {
    this.selectedIndex = index;
    this.getVariants();
  }

  getVariants(): void {
    this.selectedAssembly = this.tabs[this.selectedIndex];
    this.variantsService.getVariants(this.selectedSpecie, this.selectedAssembly).subscribe(results => {
      console.log(results);
    });
  }
}
