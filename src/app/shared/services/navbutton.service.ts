import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbuttonService {
  active = new BehaviorSubject<boolean>(null);
  mouseInActive = new BehaviorSubject<boolean>(false);
  constructor() {}
}
