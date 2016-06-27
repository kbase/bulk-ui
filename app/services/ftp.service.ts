import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
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
    files = {};         // file lists loaded and cached

    // default selected folder
    selectedFolder: Folder;

    selectedPath = new Subject<string>();
    selectedFileCount = new Subject<number>();

    selectedPath$ = this.selectedPath.asObservable();
    selectedFileCount$ = this.selectedFileCount.asObservable();

    constructor(private http: Http,
                private auth: KBaseAuth) {

        let headers = new Headers({ 'Authorization': this.auth.token });
        this.reqOptions = new RequestOptions({ headers: headers });

        this.selectedFolder= {
            name: auth.user,
            path: '/'+auth.user
        }
    }

    list(path?: string) {
        path = path ? path : '/'+this.auth.user;
        return this.http.get(this.ftpUrl+'/list/'+path, this.reqOptions)
                        .map(res =>  res.json() )
                        .do(files => this.files[path] = files)
                        .catch(this.handleError);
    }

    // this method should be replaced with service calls
    listFolders(path?: string) {
        path = path ? path : '/'+this.auth.user;
        return this.http.get(this.ftpUrl+'/list/'+path+'?type=folder', this.reqOptions)
                        .map(res =>  res.json() )
                        .do(res => console.log('list files resp', res))
                        .catch(this.handleError);
    }

    // get files and cache
    listFiles(path?: string) {
        path = path ? path : '/'+this.auth.user;
        return this.http.get(this.ftpUrl+'/list/'+path+'?type=file', this.reqOptions)
                   .map(res => res.json())
                   //.do(files => this.files[path] = files)
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
        this.selectedFileCount.next(this.selectedFiles.length);
    }

    unselectFile(file) {
        this.selectedFiles = this.selectedFiles.filter(f => {
            if (f.path != file.path) return true;
        })

        this.selectedFileCount.next(this.selectedFiles.length);

        return this.selectedFiles;
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
