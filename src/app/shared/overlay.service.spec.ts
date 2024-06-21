import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from './overlay.service';
import { Component, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';

// A fake component with ViewContainerRef
@Component({
  template: `
    <div #testContainer></div>
    <ng-template #testTemplate></ng-template>
  `
})
class TestComponent {
  @ViewChild('testContainer', { read: ViewContainerRef }) vcRef!: ViewContainerRef;
  @ViewChild('testTemplate') templateRef!: TemplateRef<any>;
}

describe('OverlayService', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: OverlayService;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [OverlayService, Overlay]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OverlayService);
    overlay = TestBed.inject(Overlay);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an overlay', () => {
    const spy = spyOn(overlay, 'create').and.callThrough();
    service.createOverlay({});
    expect(spy).toHaveBeenCalled();
  });

  it('should attach a template portal', () => {
    const overlayRef = service.createOverlay({});
    const spy = spyOn(overlayRef, 'attach').and.callThrough();
    const templateRef = component.templateRef;
    const vcRef = component.vcRef;
    service.attachTemplatePortal(overlayRef, templateRef, vcRef);
    expect(spy).toHaveBeenCalled();
  });

  it('should position globally center', () => {
    const positionStrategy = service.positionGloballyCenter();
    expect(positionStrategy).toBeTruthy();
  });
});
