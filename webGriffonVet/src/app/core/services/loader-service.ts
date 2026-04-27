import { Injectable } from '@angular/core';
import { Observable, Subject, observeOn, asyncScheduler } from 'rxjs';

export declare type Loader = {
  loaded: boolean
};

@Injectable({ providedIn: 'root' })
export class LoaderService {

  private _subject = new Subject<Loader>();

  get loader$(): Observable<Loader> {
    return this._subject.asObservable().pipe(
      observeOn(asyncScheduler) 
    );
  }

  start(): void {
    this._subject.next({ loaded: true });
  }

  complete(): void {
    this._subject.next({ loaded: false });
  }
}