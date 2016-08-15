
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';

import { MdCheckbox } from '@angular2-material/checkbox';
import { MdProgressCircle } from '@angular2-material/progress-circle';

import { DefaultSorter } from '../grid/defaultSorter';
import { DataTable } from '../grid/dataTable';
import { DataTableService } from '../grid/dataTable.service';

import { FtpService } from '../services/ftp.service';
import { Util } from '../services/util';
import { Encode } from '../services/pipes'

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
        DataTable,
        DataTableService
    ],
    pipes: [Encode]
})

export class FileTableComponent implements OnInit {
    files;                          // list of file meta
    pathList = [];                  // list of folder names
    allowedType: string;            // Once user selects a file of one type,
                                    // others are filtered out.?  to be removed
    error;

    selectedType;                          // selected type to upload

    allChecked: boolean = false;    // wether or not all items are checked

    selectedFiles;
    selectedCount;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes
    readableSize = this.util.readableSize; // use pipes

    constructor(private router: ActivatedRoute,
                private ftp: FtpService) {

        this.selectedFiles = ftp.selectedFiles;
    }


    ngOnInit() {
        this.router.params.subscribe(params => {
            let path = decodeURIComponent( params['path'] );
            path = path[0] === '/' ? path : '/'+path;
            this.pathList = path.split('/');
            this.loadData(path);
        })
    }

    loadData(path) {
        this.ftp.selectedType$.subscribe(type => this.selectedType = type)


        // if cached, load cached data
        if (path in this.ftp.files)
            this.files = this.ftp.files[path];
        else {
            this.ftp
                .list(path)
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

}
