import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { OverlayService } from '../overlay.service';

describe('ProgressSpinnerComponent', () => {
  let component: ProgressSpinnerComponent;
  let fixture: ComponentFixture<ProgressSpinnerComponent>;
  let overlayService: OverlayService;
  let overlayRefSpy: jasmine.SpyObj<OverlayRef>;
  let positionStrategySpy: jasmine.SpyObj<PositionStrategy>;

  beforeEach(() => {
    overlayRefSpy = jasmine.createSpyObj(
      'OverlayRef',
      ['hasAttached', 'detach']
    );
    positionStrategySpy = jasmine.createSpyObj('PositionStrategy', ['global', 'centerHorizontally', 'centerVertically']);

    TestBed.configureTestingModule({
      declarations: [ProgressSpinnerComponent],
      providers: [
        {
          provide: Overlay,
          useValue: {
            create: () => overlayRefSpy,
            position: () => positionStrategySpy
          }
        },
        OverlayService
      ]
    });

    fixture = TestBed.createComponent(ProgressSpinnerComponent);
    component = fixture.componentInstance;
    overlayService = TestBed.inject(OverlayService);

    // add a custom overlayRef to the component for testing purposes
    component.setOverlayRefForTesting(overlayRefSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should attach the template portal when displayProgressSpinner is true', () => {
    component.displayProgressSpinner = true;
    overlayRefSpy.hasAttached.and.returnValue(false);
    const attachSpy = spyOn(overlayService, 'attachTemplatePortal');

    component.ngDoCheck();

    expect(attachSpy).toHaveBeenCalled();
  });

  it('should detach the template portal when displayProgressSpinner is false', () => {
    component.displayProgressSpinner = false;
    overlayRefSpy.hasAttached.and.returnValue(true);

    component.ngDoCheck();

    expect(overlayRefSpy.detach).toHaveBeenCalled();
  });

  it('should create overlay on init', () => {
    const createSpy = spyOn(overlayService, 'createOverlay');
    const positionSpy = spyOn(overlayService, 'positionGloballyCenter');

    component.ngOnInit();

    expect(createSpy).toHaveBeenCalled();
    expect(positionSpy).toHaveBeenCalled();
  });
});
