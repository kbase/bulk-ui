
import { Component, OnInit} from '@angular/core';
import { RouteParams, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MdButton } from '@angular2-material/button';

import { DefaultSorter } from '../grid/defaultSorter';
import { DataTable } from '../grid/dataTable';


import { FtpService } from '../services/ftp.service';
import { Util } from '../services/util';


@Component({
  selector: 'file-table',
  templateUrl: 'app/file-table/file-table.html',
  styleUrls: ['app/file-table/file-table.css'],
  directives: [
    ROUTER_DIRECTIVES,
    MdCheckbox,
    MdButton,

    DataTable,
    DefaultSorter
  ],
  providers: [
    DataTable
  ]
})

export class FileTableComponent implements OnInit {
    selectedPath: string;                  // selected path from routeParams
    files;                                 // list of file meta
    pathList = [];                         // list of folder names

    allChecked: boolean = false;           // wether or not all items are checked

    selectedFiles;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes
    readableSize = this.util.readableSize; // use pipes

    //sorter = new Sorter();
    sortedCol: string;

    constructor(
        private _routeParams: RouteParams,
        private _ftp: FtpService) {

        this.selectedPath = decodeURI(_routeParams.get('path') );
        this.pathList = this.selectedPath.split('/');

        this.selectedFiles = _ftp.selectedFiles;
     }

    ngOnInit() {
        console.log('path', this.selectedPath)
        if (this.selectedPath in this._ftp.files)
            this.files = this._ftp.files[this.selectedPath;
        else
            this._ftp
                .getFiles(this.selectedPath)
                .subscribe(files => {
                    this.files = files
                })
    }

    toggleItem(checked, file) {
        file.checked = checked;

        if (checked == true)
            this._ftp.selectFile(file);
        else
            this.selectedFiles = this._ftp.unselectFile(file);
    }


    toggleCheckAll(event) {
        if (this.allChecked) {
            this.files.forEach(file => file.checked = false);
            //this._ftp.unselectAllFiles();
        }

        this.allChecked = !this.allChecked;
    }

    /*
    sort(key) {
        console.log('sorting')
        this.sorter.sort(key, this.files);
        this.sortedCol = key;
    }*/

}
