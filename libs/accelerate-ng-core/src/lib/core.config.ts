// external imports
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

// internal imports

// definitions
export interface AccelerateCoreConfig {
  name: string;
  apiBasePath?: string;
}

export const ACCELERATE_APP_CONFIG_TOKEN =
  new InjectionToken<AccelerateCoreConfig>('AccelerateCoreConfig', {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        '[accelerate-ng-core] AccelerateCoreConfig is not configured. ' +
          'Call provideAccelerateCoreConfig({ name: "..."}) in your application bootstrap.',
      );
    },
  });

export const provideAccelerateCoreConfig = (config: AccelerateCoreConfig) => {
  console.warn('provideAccelerateCoreConfig:', config);

  return makeEnvironmentProviders([
    { provide: ACCELERATE_APP_CONFIG_TOKEN, useValue: config },
  ]);
};
