import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor() {}

  private isButtonEnabled = new BehaviorSubject<boolean>(false);

  //get value
  currentButtonState = this.isButtonEnabled.asObservable();

  //set value
  changeButtonState(state: boolean) {
    this.isButtonEnabled.next(state);
  }
}
