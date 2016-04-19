import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { Subject }    from 'rxjs/Subject';

import { Folder } from './folder';

// test data!
//import { Folders } from './mock-folders';
//import { Folders3 } from './mock-folders.3';


@Injectable()

export class FtpService {
    //public folders;
    public files;

    public selectedFolder: Folder = {
        name: 'www',
        path: '/www'
    }

    public selectedPath = new Subject<string>();

    // Observable string streams
    selectedPath$ = this.selectedPath.asObservable();


    private ftpUrl = 'http://0.0.0.0:3000/v0/list';

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


    getFiles(path?: string) {
        path = path ? path : '/www';
        return this.http.get(this.ftpUrl+path+'?type=file')
                        .map(res => res.json())
                        .do(data => console.log(data))
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

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
