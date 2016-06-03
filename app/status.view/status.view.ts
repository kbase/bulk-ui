import { Component} from '@angular/core';
import { JobService } from '../services/job.service'
import { ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { MdProgressCircle } from '@angular2-material/progress-circle';
import { MdButton } from '@angular2-material/button';

import { Observable } from 'rxjs/Rx';

import { Util } from '../services/util';


@Component({
    templateUrl: 'app/status.view/status.view.html',
    styleUrls: ['app/status.view/status.view.html'],
    directives: [
        ROUTER_DIRECTIVES,
        MdProgressCircle,
        MdButton
    ],
    providers: [
        JobService
    ]
})
export class StatusView {
    metaList;
    errorMessage;

    jobStatusByImportId = {}

    loading: boolean = false;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes

    constructor(private jobService: JobService) { }


    ngOnInit() {
        this.loadStatus()
    }

    reload() {
        this.loadStatus();
    }

    private loadStatus() {
        this.loading = true;
        // Fetch import jobs and filter out any jobs with non-leginimate-looking ids
        // next get individual job status
        // Note: a service would be very useful here.
        this.jobService.listImports()
            .subscribe(res => {
                let realImports = [];
                for (let i=0; i<res.length; i++) {
                    let jobIds = res[i][12].split(',');

                    // ensure valid job ids for testing purposes
                    if (jobIds[0].length !== 24) continue;

                    realImports.push(res[i]);
                }

                this.metaList = realImports;
                this.getIndividualJobStatus(this.metaList);
                //console.log('metaList', this.metaList)
            })
    }


    private getIndividualJobStatus(importMetas) {

        importMetas.forEach(importMeta => {
            let importId = importMeta[0];
            let jobIds = importMeta[12].split(',');

            this.jobService.checkJobs(jobIds)
                .subscribe(res => {
                    let counts = {queued: 0, inProgress: 0, completed: 0, suspend: 0};
                    for (var key in res) {
                        let jobStatus = res[key];
                        if (jobStatus.job_state === 'completed')
                            counts.completed += 1;
                        else if (jobStatus.job_state === 'in-progress')
                            counts.inProgress += 1;
                        else if (jobStatus.job_state === 'completed')
                            counts.completed += 1;
                        else if (jobStatus.job_state === 'suspend')
                            counts.suspend += 1;
                    }

                    this.jobStatusByImportId[importId] = {
                        jobStatuses: res,
                        counts: counts
                    }

                    this.loading = false;
                })
        })
    }

    getRelativeTime(time) {
        let timestamp = Date.parse(time);
        return this.relativeTime(timestamp);
    }


}