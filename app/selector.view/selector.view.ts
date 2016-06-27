import { Component, OnInit} from '@angular/core';
import { RouteParams, RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MdButton } from '@angular2-material/button';

import { FileTreeComponent } from '../file-tree/file-tree';
import { FileTableComponent } from '../file-table/file-table';

import { FtpService } from '../services/ftp.service';

@Component({
  selector: 'selector',
  templateUrl: 'app/selector.view/selector.view.html',
  styleUrls: ['app/selector.view/selector.view.css'],
  directives: [
      FileTreeComponent,
      FileTableComponent,
      ROUTER_DIRECTIVES,
      MdButton
  ],
  providers: [
  ]
})

@RouteConfig([
  {path:'/:path', name: 'FileTable', component: FileTableComponent}
])

export class SelectorView implements OnInit {
    folders;

    selectedFolder;
    selectedPath: string;

    selectedFiles;
    selectedCount;

    activeImports: number = 0;
    completedImports: number = 0;

    constructor(
        private routeParams: RouteParams,
        private ftp: FtpService) {

        this.ftp.selectedPath$.subscribe(path => this.selectedPath = path)
        this.ftp.selectedFileCount$.subscribe(count => this.selectedCount = count)
    }

    ngOnInit() {
        this.selectedCount = this.ftp.selectedFiles.length;
    }


    clearSelected() {
        this.selectedFiles = [];
        this.ftp.clearSelected();
    }


}
