/*
 *  Simple service class to handle login/logout actions
 *
 *  Notes:
 *    - We don't need to retrieve tokens as this is can be
 *      handled by https://narrative.kbase.us/#login
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Observable}     from 'rxjs/Observable';

@Injectable()
export class KBaseAuthHandler {

    constructor(private http: Http) {
        console.log('called auth contructor')
    }

    logout() {
        //document.cookie;
        console.log('fake logout; the cookie was:', document.cookie)
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}