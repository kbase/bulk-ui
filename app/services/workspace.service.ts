import { Injectable } from '@angular/core';
import { KBaseRpc } from './kbase-rpc.service';
import { KBaseAuth } from './kbase-auth.service';


@Injectable()
export class WorkspaceService {

    constructor(private rpc: KBaseRpc,
                private auth: KBaseAuth) {
    }


    listNarratives() {
        return this.rpc.call('ws', 'list_workspace_info', {excludeGlobal: 1})
            .map(res => {

                let narrativeSpaces = [];

                res.forEach(ws => {
                    let meta = ws[8];
                    if ('narrative_nice_name' in meta) {
                        narrativeSpaces.push({
                            name: meta.narrative_nice_name,
                            narrativeId: parseInt(ws[8].narrative),
                            wsId: ws[0],
                            wsName: ws[1]
                        });
                    }
                })

                return narrativeSpaces;
            })
    }

    getObjectInfos(objIds: Object[])  {
        return this.rpc.call('ws', 'get_object_info_new', {objects: objIds})
    }
}