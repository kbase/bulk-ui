import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { KBaseRpc } from './kbase-rpc.service';

// test tokens for ujs calls
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


    listJobs() {
        let user = 'bulkio';
        console.log('calling list jobs with user:', user)
        return this.rpc.call('ujs', 'list_jobs', [[user], ''], true)
    }

    createImportJob(jobIds: string[]) {
        console.log('creating import job', token)
        return this.rpc.call('ujs', 'create_and_start_job',
            [token, 'bulkimport', jobIds.join(','), {ptype: 'percent'}, ''], true)
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