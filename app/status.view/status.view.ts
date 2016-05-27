import { Component} from '@angular/core';
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
    metaList;
    errorMessage;

    constructor(private jobService: JobService) { }


    ngOnInit() {
        this.jobService.listJobs()
            .subscribe(
                res => this.metaList = res,
                error =>  this.errorMessage = <any>error)

        // testing
        //this.jobService.createAndStartJob()
        //    .subscribe(
        //        res => console.log('create and start res', res),
        //        error =>  this.errorMessage = <any>error)

    }


}