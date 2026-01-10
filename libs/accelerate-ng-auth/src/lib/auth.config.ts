// external imports
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { merge } from 'lodash-es';

// internal imports

// type definitions
export interface AuthFrontendConfig {
  loginPath?: string;
  logoutPath?: string;
  ignoreAppRoutes?: string[];
  audience?: string;
  permissions?: string[];
  disableAuth?: boolean;
}

export interface AuthBackendConfig {
  authApiRoot?: string;
  loginPath?: string;
  logoutPath?: string;
  ignoreBackendURLs?: string[];
  refreshToken?: (token: string) => Promise<string>;
}

export interface AccelerateAuthConfig {
  frontend?: AuthFrontendConfig;
  backend?: AuthBackendConfig;
}

// default config
export const DEFAULT_ACCELERATE_AUTH_CONFIG: AccelerateAuthConfig = {
  frontend: {
    loginPath: '/auth?mode=login',
    logoutPath: '/auth?mode=logout',
    ignoreAppRoutes: ['/auth'],
    disableAuth: true,
  },
  backend: {
    authApiRoot: '/auth',
    loginPath: '/login',
    logoutPath: '/logout',
    ignoreBackendURLs: ['/auth/'],
  },
};

// injection token
export const ACCELERATE_AUTH_CONFIG_TOKEN =
  new InjectionToken<AccelerateAuthConfig>('AccelerateAuthConfig', {
    providedIn: 'root',
    factory: () => DEFAULT_ACCELERATE_AUTH_CONFIG,
  });

// provider function
export const provideAccelerateAuthConfig = (config: AccelerateAuthConfig) => {
  console.warn('provideAccelerateAuthConfig:', config);

  return makeEnvironmentProviders([
    {
      provide: ACCELERATE_AUTH_CONFIG_TOKEN,
      useValue: merge(DEFAULT_ACCELERATE_AUTH_CONFIG, config),
    },
  ]);
};
