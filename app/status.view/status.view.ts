import { Component } from '@angular/core';
import { JobService } from '../services/job.service'
import { ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { MdProgressCircle } from '@angular2-material/progress-circle';
import { MdButton } from '@angular2-material/button';

@Component({
    templateUrl: 'app/status.view/status.view.html',
    styleUrls: ['app/status.view/status.view.html'],
    directives: [
        ROUTER_DIRECTIVES,
        MdProgressCircle,
        MdButton
    ],
    providers: [JobService]
})
export class StatusView {
    status;
    errorMessage;

    constructor(private jobService: JobService) { }


    ngOnInit() {
        this.jobService.status()
            .subscribe(
                status => this.status = JSON.stringify(status, null, 4),
                error =>  this.errorMessage = <any>error)

    }


}