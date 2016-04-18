import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { SelectorView } from './selector.view/selector.view';
import { AboutView } from './about.view/about.view';
import { ToolbarComponent } from './toolbar/toolbar';
import { FileTableComponent } from './file-table/file-table';


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
  }
])

export class AppComponent { }


