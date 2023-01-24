import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css'],
})
export class PlacesComponent implements OnInit {
  routerL = 'places-lived';
  routerV = 'places-visited';
  routerA: string;
  viewControl: boolean;
  currentRoute: string;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.toChild(this.routerL);
  }

  toChild(urlPath: string) {
    this.router.navigate([urlPath], { relativeTo: this.activatedRoute });
  }
  onChangeView() {
    this.viewControl = !this.viewControl;
    if (this.viewControl === false) {
      this.routerA = this.routerL;
      this.toChild(this.routerA);
    } else if (this.viewControl === true) {
      this.routerA = this.routerV;
      this.toChild(this.routerA);
    }
  }
}
