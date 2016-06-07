import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { KBaseRpc } from './kbase-rpc.service';


// test tokens for ujs calls
import { token } from '../bulkio-token';


interface FileMeta {
    importName: string; // only require import name in meta?
}

interface File {
    path: string;
    meta: FileMeta;
}

@Injectable()
export class JobService {

    constructor(private rpc: KBaseRpc) {}

    runGenomeTransform(f: File,  workspace: string) {
        console.log('file', f)
        let params = {
            method: "genome_transform.genbank_to_genome",
            service_ver: 'dev',
            params: [{
                genbank_file_path: '/data/bulktest/data/bulktest'+f.path,
                workspace: workspace,
                genome_id: f.meta.importName,
                contigset_id: f.meta['contigsetName']
            }]
        }

        return this.rpc.call('njs', 'run_job', params);
    }

    runGenomeTransforms(files: File[], workspace: string) {
        var reqs = [];
        files.forEach(file => reqs.push( this.runGenomeTransform(file, workspace) ) );
        return Observable.forkJoin(reqs)
    }

    // special method that is not implemented in service
    listImports() {
        let user = 'bulkio';
        console.log('calling list jobs with user:', user)
        return this.rpc.call('ujs', 'list_jobs', [[user], ''], true)
    }

    createImportJob(jobIds: string[]) {
        console.log('creating import job', jobIds)
        return this.rpc.call('ujs', 'create_and_start_job',
            [token, 'bulkimport', jobIds.join(','), {ptype: 'percent'}, '9999-04-03T08:56:32+0000'], true)
    }

    checkJob(jobId: string) {
        return this.rpc.call('njs', 'check_job', [jobId], true)
    }

    checkJobs(jobIds: string[]) {
        var reqs = [];
        jobIds.forEach(jobId => reqs.push( this.checkJob(jobId) ) )
        return Observable.forkJoin(reqs)
    }

    // this must be used in conjunction with the
    // fake jobs (which are created to store meta)
    getJobInfo(jobId: string) {
        return this.rpc.call('ujs', 'get_job_info', [jobId], true)
    }

    get_job_logs(jobId: string) {
        return this.rpc.call('njs', 'get_job_logs', {job_id: jobId, skip_lines: 0})
    }


    /**
     *  Unused methods
     */
    setState(jobId: string){
        return this.rpc.call('ujs', 'set_state', ['bulkupload', jobId, ''], true)
    }

    listState() {
        return this.rpc.call('ujs', 'list_state', ['bulkupload', 0], true)
    }

    getJobParams(jobId: string) {
        return this.rpc.call('njs', 'get_job_params', [jobId], true)
    }

}