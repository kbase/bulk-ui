
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';

import { MdCheckbox } from '@angular2-material/checkbox';
import { MdProgressCircle } from '@angular2-material/progress-circle';

import { DefaultSorter } from '../grid/defaultSorter';
import { DataTable } from '../grid/dataTable';
import { DataTableService } from '../grid/dataTable.service';

import { FtpService } from '../services/ftp.service';

import { Util } from '../services/util';
import { Encode } from '../services/pipes';

import { config } from '../service-config';
import { KBaseAuth } from '../services/kbase-auth.service';


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
    path;
    pathList = [];                  // list of folder names
    allowedType: string;            // Once user selects a file of one type,
                                    // others are filtered out.?  to be removed
    error;

    selectedType;                          // selected type to upload

    allChecked: boolean = false;    // wether or not all items are checked

    selectedFiles;
    selectedCount;

    dndZone;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes
    readableSize = this.util.readableSize; // use pipes

    constructor(private router: ActivatedRoute,
                private ftp: FtpService,
                private auth: KBaseAuth,
                private ref: ChangeDetectorRef) {

        this.selectedFiles = ftp.selectedFiles;
    }


    ngOnInit() {
        this.router.params.subscribe(params => {
            let path = decodeURIComponent( params['path'] );
            this.path = path[0] === '/' ? path : '/'+path;
            this.pathList = this.path.split('/');
            this.loadData(this.path);

            this.initDragAndDrop();
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


    // put drag and drop stuff here for now
    initDragAndDrop() {
        // treat body as drag and drop zone
        this.dndZone = document.getElementById('drag-and-drop');
        this.dndZone.addEventListener('dragover', this.onDragOver);
        this.dndZone.addEventListener("dragleave", this.onDragLeave);
        this.dndZone.addEventListener('drop', this.onDragDrop);
    }

    upload(files: FileList) {
        for (var i = 0; i < files.length; i++) {
            let file = files[i];

            let f = {
                name: file.name,
                uploadProgress: 0,
                size: 96390
            }
            this.files.unshift(f)

            this.uploadRequest(
                config.endpoints.ftpApi+'/upload', [file], this.path, f
            ).then(result => {
                this.files = this.ftp.addToCache(result, this.path)
            }, (error) => {
                console.error(error);
            })
        }
    }

    uploadRequest(url: string, files: Array<File>, dest: string, fileRef) {
        return new Promise((resolve, reject) => {
            var form = new FormData(),
                xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                form.append("destPath", dest);
                form.append("uploads", files[i], files[i].name );
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200)
                        resolve(JSON.parse(xhr.response));
                     else
                        reject(xhr.response);
                }
            }

            xhr.upload.addEventListener("progress", function(e) {
                if (e['lengthComputable']) {
                    let percent = Math.round((e['loaded'] * 100) / e['total']);
                    fileRef.uploadProgress = percent;
                }
            }, false);

            xhr.open("POST", url, true);
            xhr.setRequestHeader('Authorization', this.auth.token );
            xhr.send(form);
        });
    }

     onDragLeave = (e) => {
        if ( e.target['className'] == "dnd-active" )
            this.dndZone.classList.remove("dnd-active");
    }

     onDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();

        //todo: support styling on IE?  or not.
        this.dndZone.classList.add("dnd-active");
        e.dataTransfer.dropEffect = 'copy';
    }

    onDragDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if ( e.target['className'] == "dnd-active" )
            this.dndZone.classList.remove("dnd-active");

        var files = e.dataTransfer.files; // Array of all files
        this.upload(files);
    }

    ngOnDestroy() {
        this.dndZone.removeEventListener('dragover', this.onDragOver);
        this.dndZone.removeEventListener('dragleave', this.onDragLeave);
        this.dndZone.removeEventListener('drop', this.onDragDrop);
    }

}
