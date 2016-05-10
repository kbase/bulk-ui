import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
//import 'rxjs/Rx';

import { Subject }    from 'rxjs/Subject';

import { Folder } from './folder';

// test data!
//import { Folders } from './mock-folders';
//import { Folders3 } from './mock-folders.3';


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
                        .do(data => console.log(data) )
                        .catch(this.handleError);

        // mock testing
        //if (id == 3) return Promise.resolve(Folders3);
        //else return Promise.resolve(Folders);
    }

    // get files and cache
    getFiles(path?: string) {
        path = path ? path : '/www';
        return this.http.get(this.ftpUrl+path+'?type=file')
                        .map(res => res.json())
                        .do(files => this.files[path] = files)
                        .do(files => console.log(files))
                        .catch(this.handleError);
    }


    setFolder(folder: Folder) {
        this.selectedFolder = folder;
        return folder;
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
