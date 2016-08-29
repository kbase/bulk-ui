import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

//import 'rxjs/Rx';

import { Folder } from './folder';

import { config } from '../service-config';
import { KBaseAuth } from './kbase-auth.service';

@Injectable()

export class FtpService {
    ftpUrl = config.endpoints.ftpApi;
    reqOptions; // temp storage of auth header

    selectedFiles = []; // files selected in UI
    selectedSets = []; // files selected in UI


    files = {};         // file lists loaded and cached

    // default selected folder
    selectedFolder: Folder;

    selectedPath = new Subject<string>();
    selectedFileCount = new Subject<number>();
    selectedSetCount = new Subject<number>();
    selectedType = new BehaviorSubject<Object>(false);

    selectedPath$ = this.selectedPath.asObservable();
    selectedFileCount$ = this.selectedFileCount.asObservable();
    selectedSetCount$ = this.selectedSetCount.asObservable();

    selectedType$ = this.selectedType.asObservable();

    constructor(private http: Http,
                private auth: KBaseAuth) {
        let headers = new Headers({ 'Authorization': this.auth.token });
        this.reqOptions = new RequestOptions({ headers: headers });

        this.selectedFolder = {
            name: auth.user,
            path: '/'+auth.user
        }
    }

    list(path?: string) {
        path = path ? path : '/'+this.auth.user;
        return this.http.get(this.ftpUrl+'/list/'+path, this.reqOptions)
            .map(res => {
                let files = [],
                    folders = [];

                res.json().forEach(file => {
                    if (file.isFolder) folders.push(file);
                    else files.push(file);
                })
                // crud sorting, for now
                folders.sort((a, b) => { return b.mtime - a.mtime; })
                files.sort((a, b) => { return b.mtime - a.mtime; })

                return folders.concat(files);
            })
            .do(files => this.files[path] = files)
            .catch(this.handleError);
    }

    setPath(path: string) {
        this.selectedPath.next(path);
    }

    getPath() {
        return this.selectedPath;
    }

    addToCache(files, path) {
        let existing = this.files[path];
        // remove any existing from model
        files.forEach(f => {
            let i = existing.length
            while(i--) {
                if (existing[i].name === f.name)
                    existing.splice(i, 1)
            }
        })

        // throw at top for now (until angular table is complete)
        this.files[path] = files.concat(existing);
        return this.files[path];
    }



    selectFile(file) {
        this.selectedFiles.push(file);
        this.selectedFileCount.next(this.selectedFiles.length);
    }

    unselectFile(file) {
        this.selectedFiles = this.selectedFiles.filter(f => {
            if (f.path != file.path) return true;
        })

        this.selectedFileCount.next(this.selectedFiles.length);

        return this.selectedFiles;
    }

    selectType(type) {
        this.selectedType.next(type);
    }

    addSet() {
        if (!this.selectedFiles.length) return;

        this.selectedSets.push(this.selectedFiles);
        this.selectedSetCount.next(this.selectedSets.length);
        this.selectedFileCount.next(0);
    }


    clearSelected() {
        this.selectedFiles = [];
        this.selectedFileCount.next(0);
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }


}
