import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { FormsModule }   from '@angular/forms';


import { routing }        from './app.routes';

import { SelectorView } from './selector.view/selector.view';
import { EditMetaView } from './edit-meta.view/edit-meta.view';
import { AboutView } from './about.view/about.view';
import { StatusView } from './status.view/status.view';
import { ImportDetailsView } from './import-details.view/import-details.view';
import { JobLogView } from './job-log.view/job-log.view';
import { FileTableComponent } from './file-table/file-table';
import { HomeView } from './home.view/home.view';



@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule
    ],
    declarations: [
        AppComponent,
        SelectorView,
        EditMetaView,
        AboutView,
        StatusView,
        ImportDetailsView,
        JobLogView,
        FileTableComponent,
        HomeView
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }