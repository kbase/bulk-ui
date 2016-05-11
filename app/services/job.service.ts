import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Observable}     from 'rxjs/Observable';

import { KBaseRpc } from './kbase-rpc.service';

@Injectable()
export class JobService {

    constructor(private rpc: KBaseRpc) {}

    runJob() {
        let params = {
            steps: [{
                service: {
                    method_name: "filter_contigs",
                    service_name: "ContigFilterPython",
                    service_url: "",
                    service_version: "295f0d2aa5586c8a0478304a4e70ff952e124532"
                },
                script: {
                    method_name: "",
                    service_name: "",
                    has_files: 0
                },
                method_spec_id: "ContigFilterPython/filter_contigs",
                input_values: [{
                    contigset_id: "Rhodobacter_CACIA_14H1_contigs",
                    min_length: "123",
                    workspace: "rsutormin:1452124397525"
                }],
                step_id: "ContigFilterPython/filter_contigs",
                type: "service",
                is_long_running: 1
            }],
            name: "App wrapper for method ContigFilterPython/filter_contigs"
        }

        return this.rpc.call('njs', 'run_app', params);
    }


    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}