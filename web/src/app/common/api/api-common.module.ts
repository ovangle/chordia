

import {environment} from '../../../environments/environment';
import {Injectable, InjectionToken, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ApiBaseService} from './api-resource.service';
import {HttpClientModule} from '@angular/common/http';
import {provideApiRootHref} from './api.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    provideApiRootHref(environment.apiRootHref),
    ApiBaseService
  ]
})
export class ApiCommonModule {
}

