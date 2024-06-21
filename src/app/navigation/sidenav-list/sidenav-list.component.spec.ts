import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from '../../material/material.module';
import { SidenavListComponent } from './sidenav-list.component';

describe('SidenavListComponent', () => {
  let component: SidenavListComponent;
  let fixture: ComponentFixture<SidenavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
      ],
      declarations: [ SidenavListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeSidenav event when onClose is called', () => {
    spyOn(component.closeSidenav, 'emit');

    component.onClose();

    expect(component.closeSidenav.emit).toHaveBeenCalled();
  });

  it('should call onClose when onLogout is called', () => {
    spyOn(component, 'onClose');

    component.onLogout();

    expect(component.onClose).toHaveBeenCalled();
  });

});
