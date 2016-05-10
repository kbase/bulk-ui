import { Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';


@Component({
  selector: 'header',
  templateUrl: 'app/toolbar/toolbar.html',
  styleUrls: ['app/toolbar/toolbar.css'],
  directives: [
      ROUTER_DIRECTIVES
  ],
  providers: []
})



export class ToolbarComponent {

    constructor() {

    }

}
