import { Component, OnInit} from 'angular2/core';
import { HTTP_PROVIDERS }    from 'angular2/http';
import { RouteParams, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

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
      ROUTER_DIRECTIVES
  ],
  providers: [
    FtpService,
    HTTP_PROVIDERS
  ]
})

@RouteConfig([
  {path:'/:path', name: 'FileTable', component: FileTableComponent}
])

export class SelectorView implements OnInit {
    public folders;

    selectedFolder;
    selectedPath: string;

    constructor(
        private _routeParams: RouteParams,
        private _ftpService: FtpService) {

        this._ftpService.selectedPath$.subscribe(
            thing => {
                console.log('chang!')
                this.selectedPath = thing;
            })
    }

    // initial loading of top level folders
    getFolders() {
        this._ftpService.getFolders()
            .subscribe(folders => this.folders = folders)
    }


    ngOnInit() {
        this.getFolders();
    }

    onFolderSelect(folder) {
        console.log('folder!', folder)
    }



}
