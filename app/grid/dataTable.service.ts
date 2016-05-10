import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class DataTableService {

    // Observable string sources
    private _announceSort = new Subject<any>();
    announceSort$ = this._announceSort.asObservable();

    private _updateEvent = new Subject<any>();
    updateEvent$ = this._updateEvent.asObservable();

    // Service message commands
    announceSort(sortBy: string, sortOrder: string) {
      //  this._announceSort.next(sortBy, sortOrder);
    }

    updateEvent(data: any, sortBy: string, sortOrder: string) {
        //this._updateEvent.next(data, sortBy, sortOrder);
    }

}