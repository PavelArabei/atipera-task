import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FilterFormEmitterService {
  private filterWordSubject = new Subject<string>();

  public filteredWord$ = this.filterWordSubject.asObservable();

  public updateData(word:string): void {
    this.filterWordSubject.next(word);
  }
}
