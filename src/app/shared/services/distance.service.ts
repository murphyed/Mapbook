import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  totalDistance = new BehaviorSubject<number>(0);
  addressesArray = this.userService.userResidences;
  constructor(private userService: UserService) {}

  calDistance() {
    console.log(this.addressesArray);
    let output;
    let distanceComputed = 0;
    if (this.addressesArray.length > 0) {
      const sequenceArray = [];
      for (let i = 0; i < this.addressesArray.length; i++) {
        const val1 = i;
        const val2 = i + 1;
        sequenceArray.push([val1, val2]);
      }

      function distance(p1, p2) {
        var R = 3958.8;
        var rlat1 = p1.lat * (Math.PI / 180);
        var rlat2 = p2.lat * (Math.PI / 180);
        var difflat = rlat2 - rlat1;
        var difflon = (p2.lng - p1.lng) * (Math.PI / 180);
        var d =
          2 *
          R *
          Math.asin(
            Math.sqrt(
              Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                Math.cos(rlat1) *
                  Math.cos(rlat2) *
                  Math.sin(difflon / 2) *
                  Math.sin(difflon / 2)
            )
          );
        return (distanceComputed = Math.round(d));
      }
      for (let i = 0; i < sequenceArray.length - 1; i++) {
        const p1 = this.addressesArray[sequenceArray[i][0]];
        const p2 = this.addressesArray[sequenceArray[i][1]];
        distanceComputed += Number(distance(p1, p2));
        if (i === sequenceArray.length - 2) {
          output = `${distanceComputed} miles`;
          console.log(output);
        }
      }
      this.totalDistance.next(distanceComputed);
    }
  }
}
