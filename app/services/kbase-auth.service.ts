/*
 *  Class to handle token and login/logout actions
 *
 *  Notes:
 *    - We don't need to retrieve tokens as this is
 *      handled by https://narrative.kbase.us/#login
 */

import { Injectable } from '@angular/core';

import { config } from '../service-config';

import { Router } from '@angular/router';

@Injectable()
export class KBaseAuth {
    user: string;
    token: string;

    constructor(private router: Router) {
        let token;
        let shouldUseCookie = config.productionMode;
        console.log('Production mode:', shouldUseCookie)

        if (shouldUseCookie)
            token = this.getToken()
        else {
            token = this.getToken();
        }

        if (!token) {
            //window.location.href = config.loginUrl +
            //'?nextrequest={"path":"https://narrative-ci.kbase.us/#login","external":true}'

            console.log('no token', 'attempting to redirect')

            return
            //throw ('User token was not found in cookie "kbase_session"');
        }

        this.user = token.split('|')[0].replace('un=', '');
        this.token = token;
        console.log('token', this.token)

        // redirect '/browse/' to 'browse/<user>' on app start
        let path = window.location.pathname;
        console.log('path!', path)
        //if (path === '/' || path.split('/')[1] === 'browse')
        //    this.router.navigate( ['Selector/FileTable', { path: '/'+this.user }]);
    }

    // method to get and parse the token from "kbase_session" cookie
    // into the correct, usable format.
    // see https://atlassian.kbase.us/browse/NAR-855?jql=text%20~%20%22cookie%22
    getToken() {
        let token;
        let cookies = document.cookie.split('; ');

        cookies.some(cookie => {
            let key = cookie.split('=')[0];
            if (key === 'kbase_session') {
                token = this.decodeToken(cookie);
                return true;
            }
        })

        return token;
    }

    decodeToken(sessionString: string) {
        console.log('sessionString', sessionString)


        let s = sessionString,
        encodedToken = s.slice(s.indexOf('token'), s.length);

        let token = decodeURIComponent(encodedToken).split('=')[1]
            .replace(/EQUALSSIGN/g, '=').replace(/PIPESIGN/g, '|');

        return token;
    }

    logout() {}

    isLoggedIn() {
        if (this.token) return true;
        else return false
    }


}