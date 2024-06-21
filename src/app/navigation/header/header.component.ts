import { Component, EventEmitter, Output } from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {
  // listed to sidenav from outside
  @Output() sidenavToggle = new EventEmitter<void>();

  // mind authentication
  isAuthenticated = false;
  authSubscription!: Subscription;

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

}
