import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';

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
    output = [];

    constructor(route: ActivatedRoute, private jobService: JobService) {
        route.params.subscribe(params => this.id = params['id'] )
     }

    ngOnInit() {
        this.loadStatus()
    }

    private loadStatus() {
        this.loading = true;

        this.jobService.getJobLogs(this.id)
            .subscribe(res => {
                res.lines.forEach(line => {
                    this.output.push( line.line+'\n' );
                });
                this.loading = false;
            })
    }

}