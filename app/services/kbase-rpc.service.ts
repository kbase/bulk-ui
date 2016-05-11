import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { token } from '../dev-user-token'

import {Observable}     from 'rxjs/Observable';

@Injectable()
export class KBaseRpc {
    private njsUrl = 'https://appdev.kbase.us/services/njs_wrapper';

    constructor(private http: Http) { }

    call(service: string, method: string, params: Object, isOrdered?: boolean) {
        let headers = new Headers({ 'Authorization': token });
        let options = new RequestOptions({ headers: headers });

        var args = {
            version: "1.1",
            id: String(Math.random()).slice(5),
            params: isOrdered ? params : [params];
        }

        if ( service === 'njs' )
            args['method'] = 'NarrativeJobService.'+method

        let body = JSON.stringify(args);

        return this.http.post(this.njsUrl, body, options)
            .map(res => res.json().result[0][0])
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}