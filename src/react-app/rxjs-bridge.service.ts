import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RxjsBridgeService<T = { type: string; payload: any }> {
  private subject: BehaviorSubject<T>;

  constructor() {
    this.subject = new BehaviorSubject(null as T);
  }

  getSubject(): BehaviorSubject<T> {
    return this.subject;
  }

  sendMessage(data: T): void {
    this.subject.next(data);
  }
}
