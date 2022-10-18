import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { VariantsService } from '../variants.service';

@Component({
  selector: 'app-variants-species',
  templateUrl: './variants-species.component.html',
  styleUrls: ['./variants-species.component.scss']
})
export class VariantsSpeciesComponent implements OnInit, OnChanges {
  @Input() selectedSpecie = "Sheep";
  tabs: string[] = [];

  constructor(
    private variantsService: VariantsService,
  ) { }

  ngOnInit(): void {
    this.getVariants();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // triggered when selectedSpecie changes
    this.getVariants();
  }

  getVariants(): void {
    this.tabs = this.variantsService.supportedAssemblies[this.selectedSpecie];
  }
}
