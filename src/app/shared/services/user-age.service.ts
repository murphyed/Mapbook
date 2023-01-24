import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAgeService {
  currentAge = new BehaviorSubject<number>(null);
  pastAge: number;

  currentAgeCal(birthYear: number, birthMonth: number) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthToYear = (currentMonth - birthMonth) / 12;
    this.currentAge.next(
      Number((currentYear - birthYear + monthToYear).toFixed(2))
    );
    return this.currentAge;
  }

  pastAgeCal(
    birthYear: number,
    pastYear: number,
    birthMonth: number,
    pastMonth: number
  ) {
    const monthToYear = (pastMonth - birthMonth) / 12;
    const currentAge = (pastYear - birthYear + monthToYear).toFixed(2);
    return currentAge;
  }

  constructor() {}
}
