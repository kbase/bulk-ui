import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import { FtpService } from '../services/ftp.service'
import { HTTP_PROVIDERS }    from '@angular/http';

import { JobService } from '../services/job.service';
import { WorkspaceService } from '../services/workspace.service';

import { MdButton } from '@angular2-material/button';
//import { MdRipple } from '@angular2-material/core/core';
import { Util } from '../services/util';


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
    ]
})

export class EditMetaView implements OnInit {
    files = [];
    selectedPath;
    selectedCount;
    errorMessage;

    narratives;
    selectedNarrative;
    selectedType;


    importInProgress: boolean = false;

    util = new Util();
    relativeTime = this.util.relativeTime; // use pipes

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

    readsSpec = [{
        name: 'Import Name',
        prop: "importName",
        required: 'true',
        type: 'wsObject'
    }, {
        name: 'Mean Insert Size',
        prop: "insert_size"
    }, {
        name: 'Stdev of Insert Size',
        prop: "std_dev"
    }]

    importSpec;  // the actual spec being used, dependent on selected type


    // cell interaction
    cellSelection: boolean = false;


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer,
        private ftp: FtpService,
        private jobService: JobService,
        private wsService: WorkspaceService,
        private router: Router) {

        this.ftp.selectedPath$.subscribe(path => this.selectedPath = path)
    }

    ngOnInit() {
        this.selectedType = this.ftp.selectedType.getValue()['name'];

        if (this.selectedType == 'Genomes')
            this.importSpec = this.genomeSpec;
        else if (this.selectedType == 'Reads')
            this.importSpec = this.readsSpec;


        this.preprocessData(this.selectedType);
        this.selectedCount = this.ftp.selectedFiles.length;

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

        this.jobService.runGenomeTransforms(this.files, wsName)
            .subscribe(res => {
                console.log('import response', res)
                let ids = [];
                for (let key in res ) ids.push(res[key]);

                this.jobService.createImportJob(ids, wsId, narId)
                    .subscribe(res => {
                        console.log('create import res', res)
                        this.router.navigate(['status']);
                })
            })
    }


    // method to copy selected file data
    // and add any defaults to edit meta table data
    preprocessData(type) {
        if (type == "Genomes")
            this.preprocessGenomes();
        else if (type == "Reads")
            this.preprocessReads();
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

    preprocessReads() {
        let sets = Object.assign([], this.ftp.selectedSets);
        console.log('sets', sets)

        let files = []
        sets.forEach(set => {
            set.forEach(file => {
                files.push({
                    name: set.name,
                    path: set.path
                })
            })
        })
        console.log('files', files)

        for (let i=0; i < files.length; i++) {
            let file = files[i],
                objName = file.name.replace(/[^\w\-\.\_]/g,'-'),
                ext = objName.slice(objName.lastIndexOf('.'), objName.length);

            file['meta'] = {
                importName: objName,
                insert_size: 0,
                std_dev: 0
            }
        }

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