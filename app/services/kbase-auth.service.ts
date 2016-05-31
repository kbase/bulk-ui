/*
 *  Simple service class to handle login/logout actions
 *
 *  Notes:
 *    - We don't need to retrieve tokens as this is can be
 *      handled by https://narrative.kbase.us/#login
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { token } from '../nconrad-token-2';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class KBaseAuth {
    user: string;
    token: string;


    constructor(private http: Http) {
        console.log('called auth constructor.  cookie:', document.cookie)

        document.cookie = 'kbase_session='+token;
        this.user = token.split('|')[0].replace('un=', '');
        this.token = token;
    }

    logout() {}

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}