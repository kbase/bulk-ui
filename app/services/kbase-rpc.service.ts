import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { KBaseAuth } from './kbase-auth.service';
import { config } from '../service-config';

import { Observable}     from 'rxjs/Observable';

@Injectable()
export class KBaseRpc {

    constructor(private http: Http,
                private auth: KBaseAuth) {}

    call(service: string, method: string, params?: Object, isOrdered?: boolean, authToken?) {
        let headers = new Headers({ 'Authorization': authToken ? authToken : this.auth.token });
        let options = new RequestOptions({ headers: headers });

        var args = {
            version: "1.1",
            id: String(Math.random()).slice(5),
            params: params ? (isOrdered ? params : [params]) : []
        }

        if (service === 'njs') {
            args['method'] = 'NarrativeJobService.'+method;
            var endpoint = config.endpoints.njs;
        } else if (service === 'ujs') {
            args['method'] = 'UserAndJobState.'+method;
            var endpoint = config.endpoints.ujs;
        } else if (service === 'ws') {
            args['method'] = 'Workspace.'+method;
            var endpoint = config.endpoints.ws;
        } else {
            console.error("Can't make RPC call: invalid service abbreviation. Was given:", service);
            return;
        }

        let body = JSON.stringify(args);

        return this.http.post(endpoint, body, options)
            .map(res => { return res.json().result[0]; })
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}