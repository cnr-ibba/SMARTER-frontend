import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VariantDetailComponent } from './variant-detail.component';
import { Variant } from '../variants.model';
import { TextToColumnPipe } from 'src/app/shared/text-to-column.pipe';

const variant: Variant = {
  "_id": {
    "$oid": "60ca279a8025a403796f644a"
  },
  "chip_name": [
    "IlluminaOvineSNP50"
  ],
  "locations": [
    {
      "chrom": "15",
      "date": {
        "$date": "2009-01-07T00:00:00Z"
      },
      "illumina": "A/G",
      "illumina_strand": "TOP",
      "illumina_top": "A/G",
      "imported_from": "manifest",
      "position": 5870057,
      "strand": "BOT",
      "version": "Oar_v3.1"
    },
    {
      "alleles": "C/T",
      "chrom": "15",
      "illumina": "T/C",
      "illumina_forward": "T/C",
      "illumina_strand": "bottom",
      "illumina_top": "A/G",
      "imported_from": "SNPchiMp v.3",
      "position": 5870057,
      "ss_id": "ss836318713",
      "strand": "forward",
      "version": "Oar_v3.1"
    },
    {
      "chrom": "15",
      "date": {
        "$date": "2017-03-13T00:00:00Z"
      },
      "illumina": "A/G",
      "illumina_strand": "TOP",
      "illumina_top": "A/G",
      "imported_from": "manifest",
      "position": 5859890,
      "strand": "BOT",
      "version": "Oar_v4.0"
    },
    {
      "alleles": "C/T",
      "chrom": "15",
      "illumina": "T/C",
      "illumina_forward": "T/C",
      "illumina_strand": "bottom",
      "illumina_top": "A/G",
      "imported_from": "SNPchiMp v.3",
      "position": 5859890,
      "ss_id": "ss836318713",
      "strand": "forward",
      "version": "Oar_v4.0"
    }
  ],
  "name": "250506CS3900065000002_1238.1",
  "rs_id": [
    "rs55630613"
  ],
  "sender": "AGR_BS",
  "sequence" : {
    "IlluminaOvineSNP50" : "NNNNNNNNNNNNNNNNCTGCTTCCGTATTTGGGTCTTCTCTCAACTTCTCTTCTTCTCCC[T/C]TGCTGAGGAGGAGGCACTTTCAGATGTATTATGTTAATGGAGAGAAAAAGCATAATATTG"
  }
};

const route = { data: of({ variant: variant }) };


describe('VariantDetailComponent', () => {
  let component: VariantDetailComponent;
  let fixture: ComponentFixture<VariantDetailComponent>;
  let location: SpyLocation;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        VariantDetailComponent,
        TextToColumnPipe,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      // https://stackoverflow.com/questions/60222623/angular-test-how-to-mock-activatedroute-data
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: Location, useClass: SpyLocation }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantDetailComponent);
    component = fixture.componentInstance;
    location = <SpyLocation>TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get variant data', () => {
      component.ngOnInit();
      expect(component.variant).toEqual(variant);
    });
  });

  // https://codeutility.org/unit-testing-angular-6-location-go-back-stack-overflow/
  it('should go back to previous page on back button click', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
