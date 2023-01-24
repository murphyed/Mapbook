import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../new-user-form/new-user.model';
import { UserAddress } from '../models/user-address.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentAddressDisplay = new BehaviorSubject<string>('unknown');
  //User Visits
  userVisits = [];
  userV = [];

  //User Past Residences
  userPastResidences = [];
  userPR = [];

  //For Total Distance service Current/past
  userResidences = [];

  pastAddressCount = new BehaviorSubject<number>(0);
  userServiceObject = new BehaviorSubject<User>({
    userName: null,
    userBirthMonthNo: null,
    userBirthYear: null,
    userCurrentAge: null,
    userPastAddressesCount: null,
  });

  userCurrentObject = new BehaviorSubject<UserAddress>({
    street: null,
    street2: null,
    city: null,
    state: null,
    zipCode: null,
    country: null,
    lat: null,
    lng: null,
    monthNumber: null,
    month: null,
    year: null,
    age: null,
  });
  userPastObject = new BehaviorSubject<UserAddress>({
    street: null,
    street2: null,
    city: null,
    state: null,
    zipCode: null,
    country: null,
    lat: null,
    lng: null,
    monthNumber: null,
    month: null,
    year: null,
    age: null,
  });
  userVisitObject = new BehaviorSubject<UserAddress>({
    street: null,
    street2: null,
    city: null,
    state: null,
    zipCode: null,
    country: null,
    lat: null,
    lng: null,
    monthNumber: null,
    month: null,
    year: null,
    age: null,
  });

  constructor() {}
  readCurrentAddress() {
    // console.log(this.userCurrentObject.value);
    if (this.userCurrentObject.value.street2 !== null) {
      this.currentAddressDisplay.next(
        `${this.userCurrentObject.value.street}, ${this.userCurrentObject.value.street2}, ${this.userCurrentObject.value.city}, ${this.userCurrentObject.value.state} ${this.userCurrentObject.value.zipCode}, ${this.userCurrentObject.value.country}`
      );
    }
    if (this.userCurrentObject.value.street2 === null) {
      this.currentAddressDisplay.next(
        `${this.userCurrentObject.value.street}, ${this.userCurrentObject.value.city}, ${this.userCurrentObject.value.state} ${this.userCurrentObject.value.zipCode}, ${this.userCurrentObject.value.country}`
      );
    }
    console.log(this.currentAddressDisplay.value);
  }
}
