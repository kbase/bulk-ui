import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { FtpService } from '../services/ftp.service'
import { HTTP_PROVIDERS }    from '@angular/http';

import { JobService } from '../services/job.service';

import { MdButton } from '@angular2-material/button'

@Component({
    templateUrl: 'app/edit-meta.view/edit-meta.view.html',
    styleUrls: ['app/edit-meta.view/edit-meta.view.css'],
    providers: [
        JobService,
        HTTP_PROVIDERS
    ],
    directives: [
        ROUTER_DIRECTIVES,
        MdButton
    ]
})

export class EditMetaView implements OnInit {
    files = [];
    errorMessage;

    exampleSpec = [{
        name: 'Import Name',
        prop: "importName",
        required: 'true', // need to implement
        type: 'wsObject'  // need to implemented error handling in UI
    }, {
        name: 'Contig Set',
        prop: "contigSet",
        type: 'string'
    }]

    // cell interaction
    cellSelection: boolean = false;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer,
        private ftpService: FtpService,
        private jobService: JobService) {
    }

    ngOnInit() {
        this.preprocessData();

        /* testing
        this.jobService.runGenomeTransform()
            .subscribe(
                jobId => {
                    console.log('this is the res:', jobId)

                    // setting state in UJS
                    this.jobService.setState(jobId)
                        .subscribe(
                            res => {
                                console.log('this is the set_state res:', res)

                                // listing ujs state for bulkupload
                                this.jobService.listState()
                                    .subscribe(
                                        res => { console.log('this is the list_state res:', res) },
                                        error =>  this.errorMessage = <any>error)

                            },
                            error =>  this.errorMessage = <any>error)

                    // getting status from njswrapper
                    this.jobService.status(jobId)
                        .subscribe(
                            res => { console.log('this is the status res:', res) },
                            error =>  this.errorMessage = <any>error)
                },
                error =>  this.errorMessage = <any>error)
        */
    }

    // method to copy selected file data
    // and add any defaults to edit meta table data
    preprocessData() {
        let files = Object.assign([], this.ftpService.selectedFiles);


        for (let i=0; i < files.length; i++) {
            let file = files[i];

            file['meta'] = {
                importName: file.name.replace(/[^\w\-\.\_]/g,'-')
            }
        }

        console.log('resulting files', files)
        this.files = files;
    }

    showData() {
        console.log('data to save', this.files)
    }

    selectCell(e) {
        this.cellSelection = true;
        console.log('event', e, this.cellSelection)

    }

    mouseUp(e) {
        this.cellSelection = false;
        console.log('event', e, this.cellSelection)
    }

    mouseOver(e) {
        console.log('e', e);
        //this.renderer.setElementClass(e.fromElement, 'selected', true);
        //this.renderer.setElementClass(e.target, 'selected', true);
    }



}