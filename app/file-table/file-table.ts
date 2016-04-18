
import { Component, OnInit} from 'angular2/core';
import { RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import { MdCheckbox } from 'node_modules/@angular2-material/checkbox/checkbox.js';


import { FtpService } from '../services/ftp.service';
import { Util } from '../services/util';


@Component({
  selector: 'file-table',
  templateUrl: 'app/file-table/file-table.html',
  styleUrls: ['app/file-table/file-table.css'],
  directives: [
    MdCheckbox,
    ROUTER_DIRECTIVES
  ],
  providers: [
    FtpService,
  ]
})

export class FileTableComponent implements OnInit {

    private selectedPath;
    private files;
    private pathList;

    private allChecked;

    private util = new Util();
    private relativeTime = this.util.relativeTime;
    private readableSize = this.util.readableSize;

    constructor(
        private _routeParams: RouteParams,
        private _ftpService: FtpService) {

        this.selectedPath = this._routeParams.get('path');
        this.pathList = decodeURI(this.selectedPath).split('/');
     }

    ngOnInit() {
        this._ftpService.getFiles(this.selectedPath)
            .subscribe(files => this.files = files)
    }

    toggleCheckAll(event) {
        let files = this.files;

        if (!this.allChecked)
            files.forEach(file => file.checked = true);
        else
            files.forEach(file => file.checked = false);

        this.allChecked =! this.allChecked;
    }


}
