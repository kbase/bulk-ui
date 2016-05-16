import { Component, OnInit } from '@angular/core';
import { FtpService } from '../services/ftp.service'
import { HTTP_PROVIDERS }    from '@angular/http';

import { JobService } from '../services/job.service'


@Component({
    templateUrl: 'app/edit-meta.view/edit-meta.view.html',
    providers: [
        JobService,
        HTTP_PROVIDERS
    ]

})

export class EditMetaView implements OnInit {
    files = [];

    errorMessage;

    constructor(
        private _ftpService : FtpService,
        private _jobService : JobService) {

        this.files = this._ftpService.selectedFiles;
    }


    ngOnInit() {
        console.log('selected files', this.files)
        /*
            this._jobService.runJob()
            .subscribe(
                res => {
                    console.log('this is the res', res)
                },
                error =>  this.errorMessage = <any>error)
        */
    }

}