import { Component, OnInit } from '@angular/core';
import { RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MdProgressCircle } from '@angular2-material/progress-circle';

import { Observable } from 'rxjs/Rx';

import { JobService } from '../services/job.service';
import { Util } from '../services/util';

@Component({
    templateUrl: 'app/import-details.view/import-details.view.html',
    styleUrls: ['app/import-details.view/import-details.view.css'],
    providers: [
        JobService
    ],
    directives: [
        MdProgressCircle,
        ROUTER_DIRECTIVES
    ]
})


export class ImportDetailsView implements OnInit {
    id: string;
    loading: boolean = false;
    jobs;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes

    constructor(params: RouteParams, private jobService: JobService) {
        this.id = params.get('id');
     }

    ngOnInit() {
        this.loadStatus()
    }


    private loadStatus() {
        this.loading = true;

        // Fetch import jobs and filter out any jobs with non-leginimate-looking ids
        // next get individual job status
        // Note: a service would be very useful here.
        this.jobService.getJobInfo(this.id)
            .subscribe(jobInfo => {
                let jobIds = jobInfo[12].split(',')

                this.jobService.checkJobs(jobIds)
                    .subscribe(jobs => {
                        this.jobs = jobs;
                        this.loading = false;
                    })

            })
    }

}