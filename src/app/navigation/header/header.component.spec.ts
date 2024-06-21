import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../material/material.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onToggleSidenav when the menu button is clicked', () => {
    spyOn(component, 'onToggleSidenav');
    const button = fixture.debugElement.query(By.css('button[mat-icon-button]')).nativeElement;
    button.click();
    expect(component.onToggleSidenav).toHaveBeenCalled();
  });

  it('should emit sidenavToggle event when onToggleSidenav is called', () => {
    spyOn(component.sidenavToggle, 'emit');

    component.onToggleSidenav();

    expect(component.sidenavToggle.emit).toHaveBeenCalled();
  });
});
