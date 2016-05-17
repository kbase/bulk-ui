import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { KBaseAuthHandler } from './kbase-auth.service';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
//import 'rxjs/Rx';

import { Folder } from './folder';


@Injectable()

export class FtpService {
    ftpUrl = 'http://0.0.0.0:3000/v0/list';

    public selectedFiles = []; // files selected in UI

    selectedFolder: Folder = {
        name: 'www',
        path: '/www'
    }

    files = {};  // files organized by path

    selectedPath = new Subject<string>();
    selectedPath$ = this.selectedPath.asObservable();

    constructor(private http: Http) {}


    // this method should be replaced with service calls
    getFolders(path?: string) {
        path = path ? path : '/www';
        return this.http.get(this.ftpUrl+path+'?type=folder')
                        .map(res =>  res.json() )
                        .catch(this.handleError);
    }

    // get files and cache
    getFiles(path?: string) {
        path = path ? path : '/www';
        return this.http.get(this.ftpUrl+path+'?type=file')
                        .map(res => res.json())
                        .do(files => this.files[path] = files)
                        .catch(this.handleError);
    }

    setPath(path: string) {
        this.selectedPath.next(path);
    }

    getPath() {
        return this.selectedPath;
    }

    selectFile(file) {
        this.selectedFiles.push(file);
    }

    unselectFile(file) {
        this.selectedFiles = this.selectedFiles.filter(existingFile => {
            if (existingFile.path != file.path) return true;
        })

        return this.selectedFiles;

    }


    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }



}
