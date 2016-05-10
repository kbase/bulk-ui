import {Component, Input, OnInit} from "@angular/core";
import { DataTableService } from './dataTable.service';
import { Sorter } from './sorter';

@Component({
    selector: "sorter",
    styleUrls: ['app/grid/sortable.css'],
    providers: [],
    template: `
        <a style="cursor: pointer" (click)="sort()" class="sorter" >
            <ng-content></ng-content>
            <i class="material-icons"
                [class.asc]="sortOrder == 'asc'"
                [class.desc]="sortOrder == 'desc'">
            </i>
        </a>`
})

export class DefaultSorter implements OnInit {
    @Input("by") private sortBy: string;
    @Input("sort") private sortOrder: string;

    sorter;
    data;

    constructor(private dataTableService: DataTableService) {
        this.sorter = new Sorter();

        /*
        this.dataTableService.updateEvent$.subscribe(
            (data, sortBy, sortOrder) => {
                console.log('new data', data)

                this.data = data;
                this.sortBy = sortBy;
                this.sortOrder = sortOrder;

                if (data && sortBy == this.sortBy) {
                    this.dataTableService.announceSort(this.sortBy, this.sortOrder);
                    //this.sorter.magicSort(this.sortBy, data, this.sortOrder);
                }
            })
            */
    }


    ngOnInit() {

    }

    private sort() {
        this.sortOrder = this.sortOrder == 'asc' ? 'desc' : 'asc';

        console.log('new sort order', this.sortBy, this.data, this.sortOrder);
        //this.sorter.magicSort(this.sortBy, data, this.sortOrder);

        //this.sorter.magicSort(this.sortBy, this.data, this.sortOrder);
        this.dataTableService.announceSort(this.sortBy, this.sortOrder);
    }
}