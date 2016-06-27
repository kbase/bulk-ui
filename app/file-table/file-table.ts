
import { Component, OnInit} from '@angular/core';
import { RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { MdCheckbox } from '@angular2-material/checkbox';
import { MdProgressCircle } from '@angular2-material/progress-circle';

import { DefaultSorter } from '../grid/defaultSorter';
import { DataTable } from '../grid/dataTable';

import { FtpService } from '../services/ftp.service';
import { Util } from '../services/util';

import { config } from '../service-config';


@Component({
  selector: 'file-table',
  templateUrl: 'app/file-table/file-table.html',
  styleUrls: ['app/file-table/file-table.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MdCheckbox,
    MdProgressCircle,

    DataTable,
    DefaultSorter
  ],
  providers: [
    DataTable
  ]
})

export class FileTableComponent implements OnInit {
    selectedPath: string;   // selected path from routeParams
    files;                  // list of file meta
    pathList = [];          // list of folder names
    allowedType: string;    // Once user selectes a file of one type,
                            // others are filtered out.?
    error;

    allChecked: boolean = false;    // wether or not all items are checked

    selectedFiles;
    selectedCount;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes
    readableSize = this.util.readableSize; // use pipes

    //sorter = new Sorter();
    sortedCol: string;

    constructor(
        private routeParams: RouteParams,
        private ftp: FtpService) {

        this.selectedPath = decodeURI(routeParams.get('path') );
        this.pathList = this.selectedPath.split('/');

        this.selectedFiles = ftp.selectedFiles;
    }


    ngOnInit() {
        console.log('path', this.selectedPath)

        // if cached, load cached data
        if (this.selectedPath in this.ftp.files)
            this.files = this.ftp.files[this.selectedPath];
        else {
            this.ftp
                .list(this.selectedPath)
                .subscribe(
                    files => this.files = files,
                    error => {
                        this.error = `Unfortunately, there's been an issue fetching your files.
                            You may wish to <a href="`+config.contactUrl+`">contact us</a>.`;
                    }
                )
        }

        // unchecked all files on clear event
        this.ftp.selectedFileCount$.subscribe(count => {
            if (count === 0) this.files.forEach(file => file.checked = false);
        })
    }

    toggleItem(checked, file) {
        file.checked = checked;

        if (checked == true)
            this.ftp.selectFile(file);
        else
            this.selectedFiles = this.ftp.unselectFile(file);
    }


    toggleCheckAll(event) {
        if (this.allChecked)
            this.files.forEach(file => file.checked = false);

        this.allChecked = !this.allChecked;
    }

    /*
    sort(key) {
        console.log('sorting')
        this.sorter.sort(key, this.files);
        this.sortedCol = key;
    }*/

}
