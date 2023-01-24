import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbuttonService } from '../services/navbutton.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  active: boolean;
  mouseInActive: boolean;
  showBtnState = false;

  onShowClick() {
    if (this.active === null || this.active === false) {
      this.navButtonService.active.next(true);
    } else {
      this.navButtonService.active.next(false);
    }
  }

  onMouseIn() {
    this.navButtonService.mouseInActive.next(true);
  }

  onMouseOut() {
    setTimeout(() => {
      this.navButtonService.mouseInActive.next(false);
      setTimeout(() => {
        if (this.mouseInActive === false && this.active === true) {
          this.navButtonService.active.next(false);
        }
      }, 10000);
    }, 3500);
  }

  constructor(
    private router: Router,
    private navButtonService: NavbuttonService
  ) {}

  ngOnInit(): void {
    this.navButtonService.active.subscribe((value) => (this.active = value));
    this.navButtonService.mouseInActive.subscribe(
      (value) => (this.mouseInActive = value)
    );
  }

  activeLogout() {
    if (this.active === true) {
      setTimeout(() => {
        this.router.navigateByUrl('/auth');
      }, 1000);
    }
  }
}
