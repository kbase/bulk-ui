import { Component, OnInit, Input} from '@angular/core';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { FtpService } from '../services/ftp.service';
import { Folder } from '../services/folder';

@Component({
  selector: 'file-tree',
  templateUrl: 'app/file-tree/file-tree.html',
  styleUrls: ['app/file-tree/file-tree.css'],
  directives: [
    ROUTER_DIRECTIVES,
    FileTreeComponent  //rescursive
  ],
  providers: [

  ]
})

export class FileTreeComponent implements OnInit {
    @Input('folders') folders: Folder[];
    @Input() selectedPath;
    @Input() onSelect;

    selectedFolder: Folder;

    constructor(
        private _routeParams: RouteParams,
        private _ftpService: FtpService) {

    }

    ngOnInit() {}

    expandFolder($e, folder: Folder) {
        $e.preventDefault();
        $e.stopPropagation();
        folder.expanded = !folder.expanded;

        if (folder.expanded) {
            this._ftpService.listFolders(folder.path)
                .subscribe(newFolders => folder.folders = newFolders)
        } else {
            folder.folders = [];
        }
    }

    selectFolder($e, folder: Folder) {
        this._ftpService.setPath(folder.path)
        //this.onSelect(folder);
    }



}
