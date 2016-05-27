import {Directive, Input, EventEmitter, SimpleChange, OnChanges, DoCheck} from "@angular/core";

import { Sorter } from './sorter';
import { DataTableService } from './dataTable.service';


@Directive({
    selector: 'table[dTable]',
    exportAs: 'dataTable',
    providers: [DataTableService]
})
export class DataTable {

    @Input('dTable') data;

    private sortBy = "";
    private sortOrder = "";

    constructor(private dataTableService: DataTableService) {
        //this.sorter = new Sorter();
        /*
        this.dataTableService.announceSort$.subscribe(
            (sortBy, sortOrder) => {
                console.log('table params', sortBy, sortOrder)
                this.sorter.magicSort(sortBy, this.data);
                this.sortBy = sortBy;
                this.sortOrder = sortOrder;
            })
        */
    }


    ngOnChanges() {
        if (this.data)
            this.dataTableService.updateEvent(this.data, this.sortBy, this.sortOrder);
    }

    setSort(sortBy:string, sortOrder:string)  {
        console.log('the data', this.data)
    }


}