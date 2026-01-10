// external imports
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

// internal imports

// definitions
export interface AccelerateHttpConfig {
  apiBasePath?: string;
}

export const DEFAULT_ACCELERATE_HTTP_CONFIG: Partial<AccelerateHttpConfig> = {};

export const ACCELERATE_HTTP_CONFIG_TOKEN =
  new InjectionToken<AccelerateHttpConfig>('AccelerateHttpConfig', {
    providedIn: 'root',
    factory: () => DEFAULT_ACCELERATE_HTTP_CONFIG as AccelerateHttpConfig,
  });

export const provideAccelerateHttpConfig = (config: AccelerateHttpConfig) => {
  console.warn('provideAccelerateHttpConfig:', config);

  return makeEnvironmentProviders([
    {
      provide: ACCELERATE_HTTP_CONFIG_TOKEN,
      useValue: { ...DEFAULT_ACCELERATE_HTTP_CONFIG, ...config },
    },
  ]);
};
