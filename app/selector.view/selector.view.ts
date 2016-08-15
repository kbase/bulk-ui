import { Component, OnInit} from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { MdButton } from '@angular2-material/button';
//import { MdRipple } from '@angular2-material/core/core';

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
      MdButton,
      //MdRipple
  ],
  providers: [
  ]
})

/*@Routes([
  {path:'/:path', name: 'FileTable', component: FileTableComponent}
])*/

export class SelectorView implements OnInit {
    folders;

    selectedFolder;
    selectedPath: string;
    selectedType = {};

    selectedFiles;      // for selecting individual files
    selectedSets;       // for selecting sets of files

    selectedCount;      // for selecting individual files
    selectedSetCount;   // for selecting individual files

    activeImports: number = 0;
    completedImports: number = 0;

    types = [
        {name: 'Reads', allowedType: 'file', setsAllowed: true},
        {name: 'Genomes',  allowedType: 'file'}
    ]

    constructor(
        private router: Router,
        private ftp: FtpService) {

        this.ftp.selectedPath$.subscribe(path => this.selectedPath = path)
        this.ftp.selectedFileCount$.subscribe(count => this.selectedCount = count)
        this.ftp.selectedSetCount$.subscribe(count => {
            this.selectedSetCount = count;
            console.log('updating count', this.selectedSetCount)
        })
    }

    ngOnInit() {
        this.selectedCount = this.ftp.selectedFiles.length;
    }

    clearSelected() {
        this.selectedFiles = [];
        this.ftp.clearSelected();
    }

    onFolderSelect(folder) {
        console.log('folder!', folder)
    }

    onSelectType(index) {
        this.selectedType = this.types[index];
        this.ftp.selectType(this.selectedType);
    }

    addSet() {
        console.log('calling ftp.addSet')
        this.ftp.addSet();
    }


}
