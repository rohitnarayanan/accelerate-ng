// external imports
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

// internal imports
import { ACCELERATE_AUTH_CONFIG_TOKEN, AuthBackendConfig } from './auth.config';
import { AuthService } from './auth.services';

/**
 * Interceptor to verify authentication and add the authorization token to the request
 * @returns An `HttpInterceptorFn` that processes the request and response.
 */
export function authHttpInterceptor(): HttpInterceptorFn {
  return (req, next) => {
    const config: AuthBackendConfig | undefined = inject(
      ACCELERATE_AUTH_CONFIG_TOKEN,
    ).backend;
    const authService = inject(AuthService);

    for (const pattern of config?.ignoreBackendURLs ?? []) {
      if (req.url.includes(pattern)) {
        console.debug(
          'accelerate-ng-core.auth.apiInterceptor: ignoring URL | %s',
          req.url,
        );
        return next(req);
      }
    }

    if (!authService.isAuthenticated) {
      console.warn(
        'accelerate-ng-core.auth.apiInterceptor: user is not authenticated, redirecting to auth page | %s',
        req.url,
      );
      authService.sendToLogin();
      return new Observable();
    }

    console.debug(
      'accelerate-ng-core.auth.apiInterceptor: adding auth token | ',
      req.url,
    );
    req = req.clone({
      setHeaders: {
        Authorization: authService.bearerToken,
      },
    });

    return next(req).pipe(
      tap((event: HttpEvent<unknown>) => {
        // Check if the response has an error status
        if (
          event instanceof HttpResponse &&
          [401, 403].includes(event.status)
        ) {
          console.error(
            'accelerate-ng-core.auth.apiInterceptor: Auth error in response',
            event,
          );
          authService.sendToLogin();
        }
      }),
    );
  };
}
