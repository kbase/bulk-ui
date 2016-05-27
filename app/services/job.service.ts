import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { KBaseRpc } from './kbase-rpc.service';

// test tokens for ujs calls
//import { token } from '../dev-user-token';
import { token } from '../bulkio-token';


@Injectable()
export class JobService {

    constructor(private rpc: KBaseRpc) {}

    runGenomeTransform() {
        let params = {
            method: "genome_transform.genbank_to_genome",
            service_ver: 'dev',
            params: [{
                genbank_file_path: "/kb/module/data/NC_003197.gbk",
                //genbank_shock_ref: "https://ci.kbase.us/services/shock-api",
                workspace: "janakakbase:1464032798535",
                genome_id: "NC_003197",
                contigset_id: "NC_003197ContigSet"
            }]
        }

        return this.rpc.call('njs', 'run_job', params);
    }

    private _runTestApp() {
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


    listJobs() {
        let user = 'bulkio';
        console.log('calling list jobs with user:', user)
        return this.rpc.call('ujs', 'list_jobs', [[user], ''], true)
    }

    createAndStartJob() {
        console.log('calling create and start with token:', token)
        return this.rpc.call('ujs', 'create_and_start_job',
            [token, 'starting', 'job description placeholder', {ptype: 'percent'}, '2020-04-03T08:56:32+0000'], true)
    }

    status(jobId: string) {
        return this.rpc.call('njs', 'check_job', [jobId], true);
    }

    //unused
    setState(jobId: string){
        return this.rpc.call('ujs', 'set_state', ['bulkupload', jobId, ''], true)
    }

    //unused
    listState() {
        return this.rpc.call('ujs', 'list_state', ['bulkupload', 0], true)
    }

}