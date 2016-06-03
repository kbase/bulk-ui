import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { SelectorView } from './selector.view/selector.view';
import { EditMetaView } from './edit-meta.view/edit-meta.view';
import { AboutView } from './about.view/about.view';
import { StatusView } from './status.view/status.view';
import { JobDetailsView } from './job-details.view/job-details.view';

import { ToolbarComponent } from './toolbar/toolbar';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav'

import { FileTableComponent } from './file-table/file-table';


// singletons
import { HTTP_PROVIDERS }    from '@angular/http';
import { FtpService } from './services/ftp.service';
import { KBaseRpc } from './services/kbase-rpc.service';

import { KBaseAuth } from './services/kbase-auth.service';



@Component({
    selector: 'my-app',
    directives: [
        ROUTER_DIRECTIVES,
        ToolbarComponent,
        MD_SIDENAV_DIRECTIVES
    ],
    providers: [
        HTTP_PROVIDERS,
        FtpService,
        KBaseRpc,
        KBaseAuth,
    ],
    template: `
        <md-sidenav-layout>

            <md-sidenav #sidenav mode="side" id="kbase-sidenav">
                <ul class="list-unstyled">
                    <li>
                        <a href="#narrativemanager/start">
                            <i class="icon-file"></i> Narrative
                        </a>
                    </li>
                    <li>
                        <a href="#appcatalog">
                        <i class="icon-book"></i> App Catalog</a>
                    </li>
                    <li>
                        <a href="/search/#/search/?q=*">
                        <i class="icon-search"></i> Search</a>
                    </li>
                    <li>
                        <a href="#dashboard">
                        <i class="icon-tachometer"></i> Dashbaord</a>
                    </li>
                    <li><hr class="no-margin"></li>
                    <li>
                        <a href="https://kbase.us/contact" target="_blank">
                        <i  class="icon-envelope-o"></i> Contact KBase</a>
                    </li>
                    <li>
                        <a href="https://kbase.us/about" target="_blank">
                        <i class="icon-info-circle"></i> About KBase</a>
                    </li>
                </ul>
            </md-sidenav>

            <toolbar [sidenav]="sidenav"></toolbar>

            <div class="content">
                <router-outlet></router-outlet>
            </div>

        </md-sidenav-layout>`
})


@RouteConfig([{
    path: '/...',
    name: 'Selector',
    component: SelectorView
  }, {
    path: '/about',
    name: 'About',
    component: AboutView,
  }, {
    path:'/edit-meta',
    name: 'EditMeta',
    component: EditMetaView
  }, {
    path:'/status',
    name: 'Status',
    component: StatusView
  },{
    path:'/job-details/:id',
    name: 'JobDetails',
    component: JobDetailsView
  }
])

export class AppComponent {

    constructor(ftpService: FtpService,
                authService: KBaseAuth) {}



}


