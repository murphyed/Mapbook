import { Component, AfterViewInit, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-places-visited',
  templateUrl: './places-visited.component.html',
  styleUrls: ['./places-visited.component.css'],
})
export class PlacesVisitedComponent implements AfterViewInit {
  display = false;
  displayActive(i) {
    const month = document.getElementById(`month${i}`);
    const age = document.getElementById(`age${i}`);
    if (!month.classList.contains('visible')) {
      month.classList.add('visible');
      age.classList.add('visible');
    } else {
      month.classList.remove('visible');
      age.classList.remove('visible');
    }
  }

  //Number of boxes in a grid;
  boxNumbers() {
    if (this.userService.userVisits !== null) {
      const boxArray = [];
      for (let i = 0; i < this.userService.userVisits.length * 2; i++) {
        boxArray.push(i);
      }
      return boxArray;
    }
  }
  boxes = this.boxNumbers();

  //Generates 0,3,4,7,8,11 sequence for classes .box && .leftBox || .box .rightBox
  classSequences1() {
    if (this.userService.userVisits !== null) {
      const classNumberSet = [];
      for (let i = 0; i < this.boxes.length * 2; i++) {
        if (i % 2 === 0) {
          classNumberSet.push(i);
        }
      }
      for (let i = 0; i < this.boxes.length; i++) {
        if (i % 2 === 1) {
          classNumberSet[i] = classNumberSet[i] + 1;
        }
      }
      // console.log(classNumberSet);
      return classNumberSet;
    }
  }
  classSet = this.classSequences1();

  //Generates 1,2,5,6,9,10 sequence for classes .infoRightOpposite || .infoLeftOpposite
  classSequences2() {
    if (this.userService.userVisits !== null) {
      const classNumberSet2 = [];
      for (let i = 0; i < this.boxes.length; i++) {
        if (i % 2 === 0) {
          classNumberSet2.push(this.classSet[i] + 1);
        } else {
          classNumberSet2.push(this.classSet[i] - 1);
        }
      }
      // console.log(classNumberSet2);
      return classNumberSet2;
    }
  }
  classSet2 = this.classSequences2();

  //Generates 0,4,8 sequence for classes .infoBoxLeft || .infoBoxRight
  classSequences3() {
    if (this.userService.userVisits !== null) {
      const classNumberSet3 = [];
      for (let i = 0; i < this.boxes.length * 2; i++) {
        if (i % 4 === 0) {
          classNumberSet3.push(i);
        }
      }
      // console.log(classNumberSet3);
      return classNumberSet3;
    }
  }
  classSet3 = this.classSequences3();

  constructor(public userService: UserService) {}

  ngOnInit() {}

  //Using ngAfterXX because DOM elements need to be created with correct classes dynamically
  ngAfterViewInit() {
    if (this.userService.userVisits.length !== 0) {
      const pastAddresses: any = this.userService.userV;

      //Reference keys from the service object
      const keysInObject: any = Object.keys(pastAddresses[0]);
      const objectKeysLength = keysInObject.length;
      // console.log(objectKeysLength);

      function numberSetFirst() {
        let numberSet = [];
        for (let i = 0; i < objectKeysLength * 2; i++) {
          if (i % 2 === 0) {
            numberSet.push(i);
          }
        }
        for (let i = 0; i < objectKeysLength; i++) {
          if (i % 2 === 1) {
            numberSet[i] = numberSet[i] + 1;
          }
        }
        return numberSet;
      }
      const sequencedNumbers = numberSetFirst();
      // console.log(sequencedNumbers);

      function numberSetSecond() {
        const numberSetSecond = [];
        for (let i = 0; i < sequencedNumbers.length; i++) {
          if (i % 2 === 0) {
            numberSetSecond.push(sequencedNumbers[i] + 1);
          } else {
            numberSetSecond.push(sequencedNumbers[i] - 1);
          }
        }
        return numberSetSecond;
      }
      const sequencedNumbers2 = numberSetSecond();
      // console.log(sequencedNumbers2);

      function objectKeyValues(n: any) {
        let keys: any = Object.keys(pastAddresses[n]);
        // console.log('Keys:', keys);

        let values: any = Object.values(pastAddresses[n]);
        // console.log('Values', values);
        // console.log(values);

        for (let i = 0; i < objectKeysLength; i++) {
          //At x index
          //key and value of x object that gets passed through
          console.log('index:', i);
          console.log(keys[i], values[i]);
          //Used this instead of ViewChild 'cause I couldn't figure out how to make it work with ViewChildren
          //Getting element by key[i] --> streetName + sequencedNumbers[n] --> 0 from based on sequence 0,3,4,7,8,11
          //element id --> streetName0 of box0

          let element = document.getElementById(keys[i] + sequencedNumbers[n]);

          //Function for values that are going to be shown opposite
          function oppositeValues(property: string) {
            //checking if DOM element's id equals Object's property + the sequencedNumbers[n] --> streetName0
            if (element.id === property + sequencedNumbers[n]) {
              //Selecting property-id based on second set of sequenced numbers
              //Will select DOM node based on property-id
              element = document.getElementById(
                property + sequencedNumbers2[n]
              );
              // console.log(element);
              //year0.innerHTML = yearValue (of the object that gets passed)
              // element.innerHTML = values[i];
            }
          }

          //Opposite values to be received by the opppositeValues function
          const properitiesFromObj = ['year', 'month', 'age'];
          for (let i = 0; i < properitiesFromObj.length; i++) {
            //calling the function x amount of times
            oppositeValues(properitiesFromObj[i]);
          }
          //year1.innerHTML = yearValue (of the object that gets passed) //values[0]
          element.innerHTML = values[i];
          // console.log(element);
        }
      }
      //Calling function objectKeyValues passed on number of address-objects present
      for (let i = 0; i < pastAddresses.length; i++) {
        objectKeyValues(i);
      }
    }
  }
}
