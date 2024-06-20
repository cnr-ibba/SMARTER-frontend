import { Component, EventEmitter, Output } from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  // mind authentication
  isAuthenticated = false;
  authSubscription!: Subscription;

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    // required to close the sidebar
    this.onClose();
  }

}
