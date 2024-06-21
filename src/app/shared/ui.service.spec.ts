import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UIService } from './ui.service';

describe('UIService', () => {
  let service: UIService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      providers: [UIService]
    });

    service = TestBed.inject(UIService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show a snackbar', () => {
    const spy = spyOn(snackBar, 'open').and.callThrough();
    service.showSnackbar('Test message', 'Test action', 3000);
    expect(spy).toHaveBeenCalledWith('Test message', 'Test action', { duration: 3000 });
  });

  it('should show a snackbar with default duration when no duration is provided', () => {
    const spy = spyOn(snackBar, 'open').and.callThrough();
    service.showSnackbar('Test message', 'Test action');
    expect(spy).toHaveBeenCalledWith('Test message', 'Test action', { duration: 5000 });
  });
});
