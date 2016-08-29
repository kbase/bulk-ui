import { Component} from '@angular/core';
import { JobService } from '../services/job.service'
import { WorkspaceService } from '../services/workspace.service'
import { ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';

import { MdProgressCircle } from '@angular2-material/progress-circle';
import { MdButton } from '@angular2-material/button';
//import { MdRipple } from '@angular2-material/core/core';

import { Observable } from 'rxjs/Rx';

import { Util } from '../services/util';
import { ElapsedTime } from '../services/pipes';
import { config } from '../service-config';

@Component({
    templateUrl: 'app/status.view/status.view.html',
    styleUrls: ['app/status.view/status.view.css'],
    directives: [
        ROUTER_DIRECTIVES,
        MdProgressCircle,
        MdButton,
        //MdRipple
    ],
    providers: [
        JobService,
        WorkspaceService,
        Location,
        Util
    ],
    pipes: [
        ElapsedTime
    ]
})
export class StatusView {
    lastUpdated: string;
    loading: boolean = false;
    narrativeUrl = config.narrativeUrl

    imports;
    errorMessage;
    jobStatusByImportId = {};


    constructor(private jobService: JobService,
                private wsService: WorkspaceService,
                private _location: Location,
                private util: Util) {}


    ngOnInit() {
        this.loadStatus()
    }

    reload() {
        this.loadStatus();
    }

    private loadStatus() {
        this.loading = true;
        let narrativeObjIds = []

        // Fetch import jobs and filter out any jobs with non-leginimate-looking ids
        // next get individual job status
        // Note: a service would be very useful here.
        this.jobService.listImports()
            .subscribe(res => {
                let realImports = [];
                for (let i=0; i<res.length; i++) {
                    let jobInfo = res[i];
                    let jobIds = jobInfo[12].split(',');

                    let parsedId = jobInfo[1].split('.');
                    let wsId = parsedId[1],
                        objId = parsedId[3];

                    // ensure valid job ids for testing purposes
                    if (jobIds[0].length !== 24) continue;

                    realImports.push(res[i]);

                    if (!wsId && !objId) continue;

                    // add narrative destination to list to request
                    // for actual narrative names.
                    narrativeObjIds.push({
                        wsid: wsId,
                        objid: objId
                    })
                }

                // add unix timestamp
                realImports.forEach((item, i) => realImports[i].timestamp = Date.parse(realImports[i][3]) )

                // sort asc
                realImports.sort((a, b) => {
                    if (a.timestamp < b.timestamp) return 1;
                    else if (a.timestamp > b.timestamp) return -1;
                })

                this.imports = realImports;

                console.log('narrative object ids', narrativeObjIds)

                this.getIndividualJobStatus(this.imports);
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
                        if (jobStatus.job_state === 'queued')
                            counts.queued += 1;
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

                    this.lastUpdated = this.util.getClockTime();
                    this.loading = false;
                })
        })
    }

    getRelativeTime(time) {
        let timestamp = Date.parse(time);
        return new ElapsedTime().transform(timestamp);
    }

    // special helper to simplify template of "Status" column
    getStatusHtml(id: string) {
        let counts = this.jobStatusByImportId[id].counts;

        let status = [];

        if (counts.queued)
            status.push('<span class="queued"><b>'+counts.queued+'</b> queued</span>');
        if (counts.inProgress)
            status.push('<span class="in-progress"><b>'+counts.inProgress+'</b> in progress</span>');
        if (counts.completed)
            status.push('<span class="completed"><b>'+counts.completed+'</b> completed</span>');
        if (counts.suspend)
            status.push('<span class="suspended"><b>'+counts.suspend+'</b> suspended</span>');

        return status.join(', ');
    }

    // delete fake import job, along with associated jobs
    deleteJob(meta) {
        let jobIds = meta[12].split(',');
        jobIds.push(meta[0]); // delete all ids, including import job

        console.log('deleting', meta)
        console.log('ids', jobIds)
        this.jobService.deleteJobs(jobIds)
            .subscribe(res => {
                console.log('res', res)
            })
    }

    goBack() {
        this._location.back()
    }
}