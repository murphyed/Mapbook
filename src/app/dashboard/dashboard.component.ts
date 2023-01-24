import { Component, OnInit } from '@angular/core';
import { DistanceService } from '../shared/services/distance.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userName: string;
  totalAddressesCount: number;
  pastAddressesCount: number;
  currentView: any;
  totalMiles: number;
  constructor(
    private userService: UserService,
    private distanceService: DistanceService
  ) {}

  ngOnInit(): void {
    this.distanceService.calDistance();
    this.userService.userServiceObject.subscribe((value) => {
      this.userName = value.userName;
    });
    this.userService.currentAddressDisplay.subscribe((value) => {
      this.currentView = value;
    });
    this.pastAddressesCount = this.userService.userPastResidences.length;

    this.totalAddressesCount =
      this.userService.userResidences.length +
      this.userService.userVisits.length;

    this.distanceService.totalDistance.subscribe((value) => {
      this.totalMiles = value;
    });
  }
}
