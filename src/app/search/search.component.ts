import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { AutocompleteService } from '../shared/services/autocomplete.service';
import { transformResponse } from 'src/app/shared/utils/transformResponse';
import { UserService } from '../shared/services/user.service';
import { MonthsService } from '../shared/services/months.service';
import { UserAgeService } from '../shared/services/user-age.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild('currentAddressView1') currentAddressView1: ElementRef;
  @ViewChild('currentAddressView2') currentAddressView2: ElementRef;
  @ViewChild('currentAddressView3') currentAddressView3: ElementRef;
  @ViewChild('modal1') modal1: ElementRef;
  @ViewChild('modal2') modal2: ElementRef;
  @ViewChild('modal3') modal3: ElementRef;
  @ViewChild('addressContainer1') addressContainer1: ElementRef;
  @ViewChild('addressContainer2') addressContainer2: ElementRef;
  @ViewChild('addressContainer3') addressContainer3: ElementRef;
  @ViewChild('activeBtn1') activeBtn1: ElementRef;
  @ViewChild('activeBtn2') activeBtn2: ElementRef;
  @ViewChild('activeBtn3') activeBtn3: ElementRef;
  @ViewChild('searchField') searchField: ElementRef;
  @ViewChild('searchButton') searchButton: ElementRef;
  @ViewChild('monthInput1') monthInput1: ElementRef;
  @ViewChild('yearInput1') yearInput1: ElementRef;
  @ViewChild('monthInput2') monthInput2: ElementRef;
  @ViewChild('yearInput2') yearInput2: ElementRef;
  @ViewChild('monthInput3') monthInput3: ElementRef;
  @ViewChild('yearInput3') yearInput3: ElementRef;
  @ViewChild('indication1') indication1: ElementRef;
  @ViewChild('indication2') indication2: ElementRef;
  @ViewChild('indication3') indication3: ElementRef;

  constructor(
    private autoService: AutocompleteService,
    private userService: UserService,
    private monthsService: MonthsService,
    private userAgeService: UserAgeService
  ) {}

  newAddress: FormGroup;
  userObj: FormGroup;
  userBirthMonthNo: number;
  userBirthYear: number;

  modalNo = null;
  buttonNo = 1;
  btnLineHover = null;
  btnDisabled = true;
  hover = false;
  formInput = true;

  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.userService.userServiceObject.subscribe((value) => {
      this.userBirthMonthNo = value.userBirthMonthNo;
    });
    this.userService.userServiceObject.subscribe((value) => {
      this.userBirthYear = value.userBirthYear;
    });

    this.newAddress = new FormGroup({
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
  }

  ngAfterViewInit() {
    const loader = new Loader({
      apiKey: environment.gmApiKey,
      libraries: ['places', 'geometry'],
    });
    const mapCenter = {
      lat: 39.742043,
      lng: -104.991531,
    };
    loader.load().then(() => {
      //Map
      const map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 3.05,
        minZoom: 2,
        maxZoom: 16,
        mapId: 'f8d8ef48c763294f',
        disableDefaultUI: true,
        mapTypeControl: false,
        gestureHandling: 'greedy',
        draggable: false,
        panControl: false,
        scrollwheel: false,
      });

      //AutoComplete
      const input = this.searchField.nativeElement as HTMLInputElement;
      const autoComplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
        fields: ['address_components', 'geometry', 'formatted_address'],
      });
      autoComplete.bindTo('bounds', map), 3000;

      const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, 0),
        animation: google.maps.Animation.DROP,
      });

      autoComplete.addListener('place_changed', () => {
        marker.setVisible(true);
        const place = autoComplete.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const addressObject = transformResponse(place, lat, lng);
        this.autoService.autoAddress.next(addressObject);
        this.newAddress.patchValue(addressObject);
        if (!place.geometry || !place.geometry.location) {
          return alert('select from the dropdown menu');
        }
        const searchButton = this.searchButton.nativeElement as HTMLElement;
        const livedBtn = this.activeBtn1.nativeElement as HTMLElement;
        const currentBtn = this.activeBtn2.nativeElement as HTMLElement;
        const visitedBtn = this.activeBtn3.nativeElement as HTMLElement;

        function search() {
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(16);
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
        }

        searchButton.addEventListener('click', search);
        livedBtn.addEventListener('click', () => {
          setTimeout(() => {
            this.currentAddressView1.nativeElement.innerHTML =
              place.formatted_address;
          }, 500);
        });
        currentBtn.addEventListener('click', () => {
          setTimeout(() => {
            this.currentAddressView2.nativeElement.innerHTML =
              place.formatted_address;
          }, 500);
        });
        visitedBtn.addEventListener('click', () => {
          setTimeout(() => {
            this.currentAddressView3.nativeElement.innerHTML =
              place.formatted_address;
          }, 500);
        });
      });
    });
  }

  //Button
  inputField: string;
  addressView: string = '';
  inputFieldStatus = false;
  buttonValidState = false;

  textInput() {
    if (this.inputField !== '') {
      this.inputFieldStatus = true;
    } else if (this.inputField === '') {
      this.inputFieldStatus = false;
    }
  }
  onMouseEnter() {
    this.buttonValidState = true;
  }
  onMouseExit() {
    this.buttonValidState = false;
  }
  onButtonSubmit() {
    if (this.buttonValidState === true) {
      this.inputField = '';
      this.textInput();
      this.activeBtn1.nativeElement.classList.add('activatingBtn');
      this.activeBtn2.nativeElement.classList.add('activatingBtn');
      this.activeBtn3.nativeElement.classList.add('activatingBtn');
      this.btnDisabled = false;
    }
  }
  addingText(text: any) {
    if (this.buttonValidState === true) {
      this.addressView = text;
      this.inputField = '';
      this.textInput();
    }
  }

  buttonLineActivate() {
    this.btnLineHover = true;
  }
  buttonLineDeactivate() {
    this.btnLineHover = false;
  }

  openModal1() {
    this.activeBtn1.nativeElement.classList.add('activeBtnAnimate');
    setTimeout(() => {
      this.modalNo = 1;
      this.btnLineHover = false;
    }, 400);
  }
  closeModal1() {
    this.activeBtn1.nativeElement.classList.remove('activeBtnAnimate');
    this.addressContainer1.nativeElement.classList.add('inactiveModal');
    setTimeout(() => {
      this.modal1.nativeElement.classList.add('inactiveModal');
    }, 200);
    setTimeout(() => {
      this.modalNo = null;
      this.formInput = true;
      this.btnLineHover = false;
    }, 500);
  }
  openModal2() {
    this.activeBtn2.nativeElement.classList.add('activeBtnAnimate');
    setTimeout(() => {
      this.modalNo = 2;
      this.btnLineHover = false;
    }, 400);
  }
  closeModal2() {
    this.activeBtn2.nativeElement.classList.remove('activeBtnAnimate');
    this.addressContainer2.nativeElement.classList.add('inactiveModal');
    setTimeout(() => {
      this.modal2.nativeElement.classList.add('inactiveModal');
      this.newAddress.get('monthNumber')?.reset();
      this.newAddress.get('year')?.reset();
      this.newAddress.get('street2')?.reset();
    }, 200);
    setTimeout(() => {
      this.modalNo = null;
      this.formInput = true;
      this.btnLineHover = false;
    }, 500);
  }
  openModal3() {
    this.activeBtn3.nativeElement.classList.add('activeBtnAnimate');
    setTimeout(() => {
      this.modalNo = 3;
      this.btnLineHover = false;
    }, 400);
  }
  closeModal3() {
    this.activeBtn3.nativeElement.classList.remove('activeBtnAnimate');
    this.addressContainer3.nativeElement.classList.add('inactiveModal');
    setTimeout(() => {
      this.modal3.nativeElement.classList.add('inactiveModal');
      this.newAddress.get('monthNumber')?.reset();
      this.newAddress.get('year')?.reset();
      this.newAddress.get('street2')?.reset();
    }, 200);
    setTimeout(() => {
      this.modalNo = null;
      this.formInput = true;
      this.btnLineHover = false;
    }, 500);
  }

  changeBtnA() {
    this.hover = true;
  }
  changeBtnIa() {
    this.hover = false;
  }

  handleForm(userAddress: FormGroup) {
    if (this.modalNo === 1) {
      this.newAddress.patchValue({
        monthNumber: Number(userAddress.value.monthNumber),
        month:
          this.monthsService.monthsArray[userAddress.value.monthNumber - 1],
        age: Number(
          this.userAgeService.pastAgeCal(
            this.userBirthYear,
            userAddress.value.year,
            this.userBirthMonthNo,
            userAddress.value.monthNumber
          )
        ),
      });
      this.userService.userPastObject.next(this.newAddress.value);

      //Past Residences
      this.userService.userPastResidences.push(
        this.userService.userPastObject.getValue()
      );

      this.userObj.patchValue(this.newAddress.value);
      this.userService.userPR.push(this.userObj.value);
      console.log('userPastResidences:', this.userService.userPastResidences);
      console.log('userPR:', this.userService.userPR);
      //For distance service
      this.userService.userResidences.push(
        this.userService.userPastObject.value
      );
      this.indication1.nativeElement.style.opacity = '1';
      setTimeout(() => {
        this.indication1.nativeElement.style.opacity = '0';
        setTimeout(() => {
          this.closeModal1();
        }, 500);
      }, 500);
    }
    if (this.modalNo === 2) {
      this.newAddress.patchValue({
        monthNumber: Number(userAddress.value.monthNumber),
        month:
          this.monthsService.monthsArray[userAddress.value.monthNumber - 1],
        age: Number(
          this.userAgeService.pastAgeCal(
            this.userBirthYear,
            userAddress.value.year,
            this.userBirthMonthNo,
            userAddress.value.monthNumber
          )
        ),
      });

      if (this.userService.userCurrentObject.getValue().street !== null) {
        const previousCurrentObj =
          this.userService.userCurrentObject.getValue();
        this.userObj.patchValue(previousCurrentObj);
        this.userService.userPR.push(this.userObj.value);
      }
      this.userService.userCurrentObject.next(this.newAddress.value);

      //Add value at 0 in userResidences to userPastResidences
      if (this.userService.userResidences.length !== 0) {
        this.userService.userPastResidences.push(
          this.userService.userResidences.at(0)
        );
      }

      //For distance service add new current to userResidences at index 0
      this.userService.userResidences.unshift(
        this.userService.userCurrentObject.value
      );
      this.userService.readCurrentAddress();
      this.indication2.nativeElement.style.opacity = '1';
      setTimeout(() => {
        this.indication2.nativeElement.style.opacity = '0';
        setTimeout(() => {
          this.closeModal2();
        }, 500);
      }, 500);
    }
    if (this.modalNo === 3) {
      this.newAddress.patchValue({
        monthNumber: Number(userAddress.value.monthNumber),
        month:
          this.monthsService.monthsArray[userAddress.value.monthNumber - 1],
        age: Number(
          this.userAgeService.pastAgeCal(
            this.userBirthYear,
            userAddress.value.year,
            this.userBirthMonthNo,
            userAddress.value.monthNumber
          )
        ),
      });
      this.userService.userVisitObject.next(this.newAddress.value);

      //Past Residences
      this.userService.userVisits.push(
        this.userService.userVisitObject.getValue()
      );

      this.userObj.patchValue(this.newAddress.value);
      this.userService.userV.push(this.userObj.value);
      console.log('userVisits:', this.userService.userVisits);
      console.log('userV:', this.userService.userV);

      //I have lat/lng for visit addresses if I do decide to change total distance to include visits
      this.indication3.nativeElement.style.opacity = '1';
      setTimeout(() => {
        this.indication3.nativeElement.style.opacity = '0';
        setTimeout(() => {
          this.closeModal3();
        }, 500);
      }, 500);
    }

    console.log(this.newAddress.value);
    this.newAddress.get('monthNumber')?.reset();
    this.newAddress.get('year')?.reset();
    this.newAddress.get('street2')?.reset();
  }

  checkYearMonthInput() {
    if (this.modalNo === 1) {
      if (
        this.yearInput1.nativeElement.value !== '' &&
        this.monthInput1.nativeElement.value !== '' &&
        this.yearInput1.nativeElement.value >= 1930 &&
        this.yearInput1.nativeElement.value <= this.currentYear
      ) {
        this.formInput = false;
      } else {
        this.formInput = true;
      }
    }

    if (this.modalNo === 2) {
      if (
        this.yearInput2.nativeElement.value !== '' &&
        this.monthInput2.nativeElement.value !== '' &&
        this.yearInput2.nativeElement.value >= 1930 &&
        this.yearInput2.nativeElement.value <= this.currentYear
      ) {
        this.formInput = false;
        console.log(this.formInput);
      } else {
        this.formInput = true;
      }
    }

    if (this.modalNo === 3) {
      if (
        this.yearInput3.nativeElement.value !== '' &&
        this.monthInput3.nativeElement.value !== '' &&
        this.yearInput3.nativeElement.value >= 1930 &&
        this.yearInput3.nativeElement.value <= this.currentYear
      ) {
        this.formInput = false;
      } else {
        this.formInput = true;
      }
    }
  }
}
