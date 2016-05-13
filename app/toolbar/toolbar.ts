import { Component, Input} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';


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

    constructor() {}

    toggleSidenav() {
         this.sidenav.toggle();
    }

}
