import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { Router, ROUTER_DIRECTIVES} from '@angular/router';
import { HTTP_PROVIDERS }    from '@angular/http';

import { KBaseAuth } from '../services/kbase-auth.service'
import { FtpService } from '../services/ftp.service'
import { JobService } from '../services/job.service';
import { WorkspaceService } from '../services/workspace.service';

import { MdButton } from '@angular2-material/button';
//import { MdRipple } from '@angular2-material/core/core';
import { ElapsedTime } from '../services/pipes';


@Component({
    templateUrl: 'app/edit-meta.view/edit-meta.view.html',
    styleUrls: ['app/edit-meta.view/edit-meta.view.css'],
    providers: [
        JobService,
        WorkspaceService,
        HTTP_PROVIDERS
    ],
    directives: [
        ROUTER_DIRECTIVES,
        MdButton,
        //MdRipple
    ],
    pipes: [
        ElapsedTime
    ]
})

export class EditMetaView implements OnInit {
    user;
    files = [];
    selectedPath;
    selectedCount;
    selectedSetCount;

    errorMessage;

    narratives;
    selectedNarrative;
    selectedType;

    importInProgress: boolean = false;


    genomeSpec = [{
        name: 'Import Name',
        prop: "importName",
        required: 'true', // need to implement
        type: 'wsObject'  // need to implemented error handling in UI
    }, {
        name: 'Contig Set',
        prop: "contigsetName",
        type: 'string'
    }]

    singleReadsSpec = [{
        name: 'Import Name',
        prop: "importName",
        required: 'true',
        type: 'wsObject'
    }, {
        name: 'SRA?',
        prop: "sra",
        type: 'checkbox'
    }, {
        name: 'Mean Insert Size',
        prop: "insert_size"
    }, {
        name: 'Stdev of Insert Size',
        prop: "std_dev"
    }]

    // use same spec file for paired-end for now.
    pairedReadsSpec = this.singleReadsSpec;

    // the actual spec being used, dependent on selected type
    importSpec;

    // cell interaction
    cellSelection: boolean = false;


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer,
        private ftp: FtpService,
        private jobService: JobService,
        private wsService: WorkspaceService,
        private router: Router,
        private auth: KBaseAuth) {
        this.user = auth.user;

        this.ftp.selectedPath$.subscribe(path => this.selectedPath = path)
    }

    ngOnInit() {
        // get type selected on browser
        this.selectedType = this.ftp.selectedType.getValue()['name'];

        if (this.selectedType == 'Genomes')
            this.importSpec = this.genomeSpec;
        else if (this.selectedType == 'Single-end Reads')
            this.importSpec = this.singleReadsSpec;
        else if (this.selectedType == 'Paired-end Reads')
            this.importSpec = this.pairedReadsSpec;
        else if (this.selectedType == 'Interleaved Paired-end Reads')
	    this.importSpec = this.singleReadsSpec;


        this.preprocessData(this.selectedType);
        this.selectedCount = this.ftp.selectedFiles.length;
        this.selectedSetCount = this.ftp.selectedSets.length;

        this.wsService.listNarratives().subscribe(res => {
            this.narratives = res;
            this.selectedNarrative = this.narratives[0];
        })
    }

    selectNarrative(index) {
        this.selectedNarrative = this.narratives[index];
    }

    startImport() {
        console.log('starting import!')
        this.importInProgress = true;

        let wsName = this.selectedNarrative.wsName,
            wsId = this.selectedNarrative.wsId,
            narId = this.selectedNarrative.narrativeId;

        let type = this.selectedType;
        if (type === 'Genomes') {
            this.jobService.runGenomeTransforms(this.files, wsName)
                .subscribe(ids => {
                    console.log('genome import jobIds', ids)
                    this.createBulkJob(ids, wsId, narId)
                })
        } else if (type === "Single-end Reads") {
            this.jobService.runReadsImports(this.files, wsName)
                .subscribe(ids => {
                    console.log('reads import jobIds', ids);
                    this.createBulkJob(ids, wsId, narId)
                })
        } else if (type === "Interleaved Paired-end Reads") {
            this.jobService.runReadsImports(this.files, wsName)
                .subscribe(ids => {
                    console.log('reads import jobIds', ids);
                    this.createBulkJob(ids, wsId, narId)
                })
        } else if (type === "Paired-end Reads") {
            this.jobService.runReadsImports(this.files, wsName)
                .subscribe(ids => {
                    console.log('reads import jobIds', ids);
                    this.createBulkJob(ids, wsId, narId)
                })
        }
    }


    // creates a bulk "job" that simply contains ids of jobs in description
    // and narrative ws.1.obj.1 in status
    createBulkJob(jobIds, wsId, narId) {
        this.jobService.createImportJob(jobIds, wsId, narId)
            .subscribe(res => {
                console.log('create import res', res)
                this.router.navigate(['status']);
        })
    }

    // method to copy selected file data
    // and add any defaults to edit meta table data
    preprocessData(type) {
        if (type == "Genomes")
            this.preprocessGenomes();
        else if (type == "Paired-end Reads")
            this.preprocessPairedReads();
        else if (type == "Single-end Reads")
            this.preprocessSingleReads();
        else if (type == "Interleaved Paired-end Reads")
            this.preprocessSingleReads();
    }

    preprocessGenomes() {
        let files = Object.assign([], this.ftp.selectedFiles);

        for (let i=0; i < files.length; i++) {
            let file = files[i],
                objName = file.name.replace(/[^\w\-\.\_]/g,'-'),
                ext = objName.slice(objName.lastIndexOf('.'), objName.length);

            file['meta'] = {
                importName: objName,
                contigsetName: objName.replace(ext, '')+'_contigset'
            }
        }

        this.files = files;
    }

    preprocessSingleReads() {
        let files = Object.assign([], this.ftp.selectedFiles);

        for (let i=0; i < files.length; i++) {
            let file = files[i],
                objName = file.name.replace(/[^\w\-\.\_]/g,'-'),
                ext = objName.slice(objName.lastIndexOf('.'), objName.length);

            file['meta'] = {
                importName: objName,
                sra: false,
                insert_size: 0,
                std_dev: 0
            }
        }

        console.log('files!', files)
        this.files = files;
    }

    preprocessPairedReads() {
        let ftpRoot= '/data/bulktest';
        let sets = Object.assign([], this.ftp.selectedSets);
        console.log('sets', sets)

        let rows = []
        sets.forEach(set => {
            rows.push({
                name: set[0].name+', '+set[1].name,
                paths: [ftpRoot+set[0].path, ftpRoot+set[1].path],
                meta: {
                    importName: set[0].name.replace(/[^\w\-\.\_]/g,'-')
                }
            })
        })

        console.log('rows', rows)
        this.files = rows;
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
