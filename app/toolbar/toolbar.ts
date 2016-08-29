import { Component, Input} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MdButton } from '@angular2-material/button';
//import { MdRipple } from '@angular2-material/core/core';


import { KBaseAuth } from '../services/kbase-auth.service';

@Component({
  selector: 'toolbar',
  templateUrl: 'app/toolbar/toolbar.html',
  styleUrls: ['app/toolbar/toolbar.css'],
  directives: [
      ROUTER_DIRECTIVES,
      MdButton,
      //MdRipple
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
