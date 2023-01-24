import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteService } from '../shared/services/autocomplete.service';
import { UserAgeService } from '../shared/services/user-age.service';
import { User } from './new-user.model';
import { environment } from 'src/environments/environment';
import { Loader } from '@googlemaps/js-api-loader';
import { transformResponse } from 'src/app/shared/utils/transformResponse';
import { UserService } from '../shared/services/user.service';
import { MonthsService } from '../shared/services/months.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css'],
})
export class NewUserFormComponent implements OnInit {
  @ViewChild('inputField') inputField: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('inputFieldMonth') inputFieldMonth: ElementRef;
  @ViewChild('year') year: ElementRef;
  @ViewChild('pastAddressesCount') pastAddressesCount: ElementRef;
  @ViewChild('addCurrent') addCurrent: ElementRef;
  @ViewChild('searchAuto') searchAuto: ElementRef;
  @ViewChild('searchAuto2') searchAuto2: ElementRef;
  @ViewChild('currentAddressView') currentAddressView: ElementRef;
  @ViewChild('currentAddressView2') currentAddressView2: ElementRef;
  @ViewChild('addressFoundLabel') addressFoundLabel: ElementRef;
  @ViewChild('addressFoundLabel2') addressFoundLabel2: ElementRef;
  @ViewChild('street2Input') street2Input: ElementRef;
  @ViewChild('currentFormBtn1') currentFormBtn1: ElementRef;
  @ViewChild('pastFormBtn') pastFormBtn: ElementRef;
  @ViewChild('addressYear') addressYear: ElementRef;
  @ViewChild('addressMonth') addressMonth: ElementRef;
  @ViewChild('addressCountDisplay') addressCountDisplay: ElementRef;
  @ViewChild('pastSection3') pastSection3: ElementRef;
  @ViewChild('addressYearPast') addressYearPast: ElementRef;
  @ViewChild('addressMonthPast') addressMonthPast: ElementRef;

  newUser: FormGroup;
  currentForm: FormGroup;
  pastForm: FormGroup;
  userObj: FormGroup;

  userObject: User = {
    userName: null,
    userBirthMonthNo: null,
    userBirthYear: null,
    userPastAddressesCount: null,
    userCurrentAge: null,
  };

  currentYear = new Date().getFullYear();
  focusIn = false;
  innerFocusIn = false;
  isInputEmpty = true;
  isSafari = false;
  currentBtnDisabled: boolean;
  formNo = 1;
  currentSubFormNo = 1;
  disabled = true;
  currentAddressDisplay: string;
  pastFormDisplay = false;
  pastAddressCount: number;
  initialPastAddressCount = 1;

  constructor(
    private userAgeService: UserAgeService,
    private autoService: AutocompleteService,
    private userService: UserService,
    private monthsService: MonthsService,
    private router: Router
  ) {}

  updateState() {}

  ngOnInit(): void {
    this.userService.pastAddressCount.subscribe(
      (value) => (this.pastAddressCount = value)
    );
    this.userService.currentAddressDisplay.subscribe(
      (value) => (this.currentAddressDisplay = value)
    );
    this.checkBrowser();
    this.newUser = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      month: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required]),
      pastAddressesCount: new FormControl(null, [Validators.required]),
    });
    this.currentForm = new FormGroup({
      street: new FormControl(null, [Validators.required]),
      street2: new FormControl(null),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
      month: new FormControl(null, [Validators.required]),
      monthNumber: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required]),
      age: new FormControl(null, [Validators.required]),
    });
    this.pastForm = new FormGroup({
      street: new FormControl(null, [Validators.required]),
      street2: new FormControl(null),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
      month: new FormControl(null, [Validators.required]),
      monthNumber: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required]),
      age: new FormControl(null, [Validators.required]),
    });

    this.userObj = new FormGroup({
      street: new FormControl(null, [Validators.required]),
      street2: new FormControl(null),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      month: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required]),
      age: new FormControl(null, [Validators.required]),
    });

    this.autoService.autoAddress.subscribe((address) => {
      if (address) {
        this.currentForm.patchValue(address);
        this.pastForm.patchValue(address);
      }
    });
  }

  initAuto() {
    if (this.formNo === 5) {
      let loader = new Loader({
        apiKey: environment.gmApiKey,
        libraries: ['places', 'geometry'],
      });
      loader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(
          this.searchAuto.nativeElement as HTMLInputElement,
          {
            types: ['address'],
            fields: ['address_components', 'geometry', 'formatted_address'],
          }
        );
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const addressObject = transformResponse(place, lat, lng);
          this.autoService.autoAddress.next(addressObject);
          this.currentAddressView.nativeElement.innerHTML =
            place.formatted_address;
          console.log(place.formatted_address);
          setTimeout(() => {
            this.addressFoundLabel.nativeElement.style.opacity = '1';
            this.currentAddressView.nativeElement.style.opacity = '1';
            this.currentFormBtn1.nativeElement.style.opacity = '1';
          }, 250);
          this.searchAuto.nativeElement.value = '';
        });
      });
    }
    if (this.formNo === 6) {
      let loader = new Loader({
        apiKey: environment.gmApiKey,
        libraries: ['places', 'geometry'],
      });
      loader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(
          this.searchAuto2.nativeElement as HTMLInputElement,
          {
            types: ['address'],
          }
        );
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const addressObject = transformResponse(place, lat, lng);
          this.autoService.autoAddress.next(addressObject);
          this.currentAddressView2.nativeElement.innerHTML =
            place.formatted_address;
          this.enableControls();
          setTimeout(() => {
            this.currentAddressView2.nativeElement.style.opacity = '1';
            this.pastSection3.nativeElement.style.opacity = '1';
          }, 250);
          this.searchAuto2.nativeElement.value = '';
        });
      });
    }
  }

  handleNewUser(newUserForm: FormGroup) {
    if (this.formNo === 1) {
      if (Object.keys(newUserForm.value)[0] === 'name') {
        let nameValue = Object.values(newUserForm.value)[0] as string;
        function upperCase(name: string) {
          let userNameUp = name.charAt(0).toUpperCase() + name.slice(1);
          nameValue = userNameUp;
          return nameValue;
        }
        upperCase(Object.values(newUserForm.value)[0] as string);
        this.userObject.userName = nameValue;
        this.inputField.nativeElement.value = '';
        this.isInputEmpty = true;
      }
    }
    if (this.formNo === 2) {
      if (Object.keys(newUserForm.value)[1] === 'month') {
        this.userObject.userBirthMonthNo = Number(
          Object.values(newUserForm.value)[1] as number
        );
        this.inputFieldMonth.nativeElement.value = '';
        this.isInputEmpty = true;
      }
    }
    if (this.formNo === 3) {
      if (Object.keys(newUserForm.value)[2] === 'year') {
        this.userObject.userBirthYear = Object.values(
          newUserForm.value
        )[2] as number;
        if (
          this.userObject.userBirthYear !== null &&
          this.userObject.userCurrentAge === null
        ) {
          this.userAgeService.currentAgeCal(
            this.userObject.userBirthYear,
            this.userObject.userBirthMonthNo
          );
          this.userAgeService.currentAge.subscribe(
            (value) => (this.userObject.userCurrentAge = value)
          );
        }
        this.inputField.nativeElement.value = '';
        this.isInputEmpty = true;
      }
    }
    if (this.formNo === 4) {
      if (Object.keys(newUserForm.value)[3] === 'pastAddressesCount') {
        this.userObject.userPastAddressesCount = Object.values(
          newUserForm.value
        )[3] as number;
        this.userService.pastAddressCount.next(
          this.userObject.userPastAddressesCount
        );
        this.inputField.nativeElement.value = '';
        this.isInputEmpty = true;
        this.userService.userServiceObject.next(this.userObject);
        console.log(this.userService.userServiceObject.value);
      }
    }
    setTimeout(() => {
      this.formNo += 1;
    }, 500);
  }

  handleNewUserCurrent(currentFormObject: FormGroup) {
    if (this.currentSubFormNo === 1) {
      this.currentForm.patchValue(currentFormObject);
      this.userService.userCurrentObject.next(this.currentForm.value);
      this.userService.readCurrentAddress();
      this.addressFoundLabel.nativeElement.style.opacity = '1';
    }
    if (this.currentSubFormNo === 2) {
      this.currentForm.patchValue(currentFormObject);
      this.userService.userCurrentObject.next(this.currentForm.value);
      if (this.street2Input.nativeElement.value !== '') {
        this.userService.readCurrentAddress();
        this.disabled = true;
      } else {
        this.userService.readCurrentAddress();
      }
    }
    if (this.currentSubFormNo === 3) {
      this.currentForm.patchValue({
        monthNumber: Number(currentFormObject.value.monthNumber),
        month:
          this.monthsService.monthsArray[
            currentFormObject.value.monthNumber - 1
          ],
        age: Number(
          this.userAgeService.pastAgeCal(
            this.userObject.userBirthYear,
            currentFormObject.value.year,
            this.userObject.userBirthMonthNo,
            currentFormObject.value.monthNumber
          )
        ),
      });

      this.userService.userCurrentObject.next(this.currentForm.value);

      //For distance service
      this.userService.userResidences.push(
        this.userService.userCurrentObject.value
      );
      this.changeFocus();
      setTimeout(() => {
        if (this.userObject.userPastAddressesCount !== 0) {
          this.formNo += 1;
        } else {
          this.formNo = 7;
        }
      }, 1000);
    }
    if (this.currentSubFormNo < 4) {
      this.currentSubFormNo += 1;
    }
  }
  handleNewUserPast(pastFormObject: FormGroup) {
    if (this.formNo === 6) {
      this.pastForm.patchValue({
        monthNumber: Number(pastFormObject.value.monthNumber),
        month:
          this.monthsService.monthsArray[pastFormObject.value.monthNumber - 1],
        age: Number(
          this.userAgeService.pastAgeCal(
            this.userObject.userBirthYear,
            pastFormObject.value.year,
            this.userObject.userBirthMonthNo,
            pastFormObject.value.monthNumber
          )
        ),
      });
      if (pastFormObject.value.street2 === '') {
        this.pastForm.patchValue({ street2: null });
      }
      this.userService.userPastObject.next(this.pastForm.value);

      //For distance service
      this.userService.userResidences.push(
        this.userService.userPastObject.value
      );

      //For pastaddresses count
      this.userService.userPastResidences.push(
        this.userService.userPastObject.getValue()
      );
      this.userObj.patchValue(this.pastForm.value);
      this.userService.userPR.push(this.userObj.value);
      if (this.initialPastAddressCount < this.pastAddressCount) {
        if (this.initialPastAddressCount !== this.pastAddressCount) {
          this.initialPastAddressCount += 1;
        }
        this.currentAddressView2.nativeElement.style.opacity = '0';
        pastFormObject.reset();
        this.disableControls();
        this.checkAddressMonthYearInput();
      } else {
        this.currentAddressView2.nativeElement.style.display = 'none';
        this.addressCountDisplay.nativeElement.style.display = 'none';
        pastFormObject.reset();
        this.disableControls();
        this.changeFocus();
        setTimeout(() => {
          this.formNo = 7;
        }, 1000);
      }
    }
  }

  checkBrowser() {
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      this.isSafari = true;
    }
  }
  checkNameInput() {
    if (this.name.nativeElement.value !== '') {
      this.isInputEmpty = false;
    } else {
      this.isInputEmpty = true;
    }
  }
  checkMonthInput() {
    if (this.inputFieldMonth.nativeElement.value !== '') {
      this.isInputEmpty = false;
    } else {
      this.isInputEmpty = true;
    }
  }
  checkYearInput() {
    if (
      this.year.nativeElement.value >= 1930 &&
      this.year.nativeElement.value <= this.currentYear
    ) {
      this.isInputEmpty = false;
    } else {
      this.isInputEmpty = true;
    }
  }
  checkPastAddressesCountInput() {
    if (this.pastAddressesCount.nativeElement.value !== '') {
      this.isInputEmpty = false;
    } else {
      this.isInputEmpty = true;
    }
  }

  checkCurrentInput() {
    if (this.formNo === 5) {
      if (this.searchAuto.nativeElement.value !== '') {
        this.isInputEmpty = false;
      } else {
        this.isInputEmpty = true;
      }
    }
    if (this.formNo === 6) {
      if (this.searchAuto2.nativeElement.value !== '') {
        this.isInputEmpty = false;
      } else {
        this.isInputEmpty = true;
      }
    }
  }
  checkStreet2Input() {
    if (this.street2Input.nativeElement.value !== '') {
      this.disabled = false;
    } else {
      this.disabled = !this.disabled;
    }
  }
  checkAddressMonthYearInput() {
    if (this.formNo === 5) {
      if (
        this.addressYear.nativeElement.value >= 1930 &&
        this.addressYear.nativeElement.value <= this.currentYear &&
        this.addressMonth.nativeElement.value !== ''
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
    if (this.formNo === 6) {
      if (
        this.addressYearPast.nativeElement.value >= 1930 &&
        this.addressYearPast.nativeElement.value <= this.currentYear &&
        this.addressMonthPast.nativeElement.value !== '' &&
        this.currentAddressView2.nativeElement.style.opacity === '1'
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  }
  changeFocus() {
    if (this.focusIn === false) {
      this.focusIn = true;
      setTimeout(() => {
        this.innerFocusIn = true;
        setTimeout(() => {
          if (this.formNo === 5) {
            this.searchAuto.nativeElement.style.opacity = '1';
          }
          if (this.formNo === 6) {
            this.searchAuto2.nativeElement.style.opacity = '1';
            this.addressCountDisplay.nativeElement.style.opacity = '1';
          }
        }, 300);
      }, 200);
    } else {
      this.addCurrent.nativeElement.style.opacity = '0';
      this.innerFocusIn = false;
      setTimeout(() => {
        this.focusIn = false;
        this.addCurrent.nativeElement.style.opacity = '1';
      }, 300);
    }
  }
  displayPastForm() {
    this.pastFormDisplay = true;
    this.disableControls();
    this.disabled = true;
  }

  disableControls() {
    this.pastForm.get('monthNumber')?.disable();
    this.pastForm.get('year')?.disable();
    this.pastForm.get('street2')?.disable();
  }
  enableControls() {
    this.pastForm.get('monthNumber')?.enable();
    this.pastForm.get('year')?.enable();
    this.pastForm.get('street2')?.enable();
  }

  toDashBoard() {
    const userObject = JSON.stringify(this.newUser.value);
    this.router.navigateByUrl('/dashboard');
    // sessionStorage.setItem('user', userObject);
  }
}
