import { Component} from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';


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
