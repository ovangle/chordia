import {InjectionToken, Provider} from '@angular/core';
import {environment} from '../../../environments/environment';


export const API_ROOT_HREF = new InjectionToken<string>('API_ROOT_HREF');

export function provideApiRootHref(href: string): Provider {
  return {
    provide: API_ROOT_HREF,
    useValue: href
  };
}

