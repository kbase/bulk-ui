import { Component, OnInit } from '@angular/core';
import { RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MdProgressCircle } from '@angular2-material/progress-circle';

import { Observable } from 'rxjs/Rx';

import { JobService } from '../services/job.service';

@Component({
    templateUrl: 'app/job-log.view/job-log.view.html',
    styleUrls: ['app/job-log.view/job-log.view.css'],
    providers: [
        JobService
    ],
    directives: [
        MdProgressCircle
    ]
})


export class JobLogView implements OnInit {
    loading: boolean = false;
    id: string;
    output: string = '';

    constructor(params: RouteParams, private jobService: JobService) {
        this.id = params.get('id');
     }

    ngOnInit() {
        this.loadStatus()
    }

    private loadStatus() {
        this.loading = true;

        this.jobService.get_job_logs(this.id)
            .subscribe(res => {
                res.lines.forEach(line => { this.output += line.line+'\n' });
                this.loading = false;
            })
    }

}