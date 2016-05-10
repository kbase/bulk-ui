import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Observable}     from 'rxjs/Observable';

import { token } from '../dev-user-token'

@Injectable()
export class JobService {
    private _njsUrl = 'https://kbase.us/services/njs_wrapper';  // URL to web api

    constructor(private http: Http) {

    }

    runJob() {
        console.log('in run job', token)

        let headers = new Headers({ 'Authorization': token });
        let options = new RequestOptions({ headers: headers });

        let body = JSON.stringify({
            version: "1.1",
            method: 'NarrativeJobService.run_app',
            id: String(Math.random()).slice(2),
            params: [{name: 'genbank_transform', steps: [{script_method: 'genbank_to_genome'}] }]
        })

        return this.http.post(this._njsUrl, body, options)
            .map(res => res.json().result[0][0])
            .do(blah => console.log('test', blah))
            .catch(this.handleError);
    }




    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}