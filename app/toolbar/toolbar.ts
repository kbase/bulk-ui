import { Component, Input} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { KBaseAuth } from '../services/kbase-auth.service';

@Component({
  selector: 'toolbar',
  templateUrl: 'app/toolbar/toolbar.html',
  styleUrls: ['app/toolbar/toolbar.css'],
  directives: [
      ROUTER_DIRECTIVES
  ],
  providers: []
})



export class ToolbarComponent {
    @Input() sidenav;

    user;

    constructor(private auth: KBaseAuth) {
        this.user = auth.user;
    }

    toggleSidenav() {
         this.sidenav.toggle();
    }

}
