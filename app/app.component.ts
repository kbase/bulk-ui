import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { SelectorView } from './selector.view/selector.view';
import { EditMetaView } from './edit-meta.view/edit-meta.view';
import { AboutView } from './about.view/about.view';
import { ToolbarComponent } from './toolbar/toolbar';
import { FileTableComponent } from './file-table/file-table';


// singleton
import { HTTP_PROVIDERS }    from '@angular/http';
import { FtpService } from './services/ftp.service';
import { KBaseRpc } from './services/kbase-rpc.service';



@Component({
    selector: 'my-app',
    template: `
        <header></header>

        <div class="content">
            <router-outlet></router-outlet>
        </div>
    `,
    directives: [
        ROUTER_DIRECTIVES,
        ToolbarComponent
    ],
    providers: [
        HTTP_PROVIDERS,
        FtpService,
        KBaseRpc
    ]
})


@RouteConfig([
  {
    path: '/...',
    name: 'Selector',
    component: SelectorView
  }, {
    path: '/about',
    name: 'About',
    component: AboutView,
  },{
    path:'/edit-meta',
    name: 'EditMeta',
    component: EditMetaView
  }
])

export class AppComponent {

    constructor(public ftpService: FtpService) {

    }

}


