import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FilterFormEmitterService {
  private filterWordSubject = new BehaviorSubject('');

  get filteredWord$() {
    return this.filterWordSubject.asObservable();
  }

  public updateData(word:string): void {
    this.filterWordSubject.next(word);
  }
}
