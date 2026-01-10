// external imports
import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * Interceptor to verify URLs and add headers to the request
 * Creates an HTTP interceptor function that can ignore specified URLs and add custom headers to requests.
 *
 * @param ignoreUrls - An array of URL patterns to ignore. If the request URL contains any of these patterns, the request will be passed through without modification.
 * @param headers - An optional record of headers to add to the request. Each key-value pair represents a header name and its value(s).
 * @returns An `HttpInterceptorFn` that processes the request and response.
 */
export function basicHttpInterceptor(
  // withCredentials = true,
  ignoreUrls: string[] = [],
  headers?: Record<string, string | string[]>,
): HttpInterceptorFn {
  return (req, next) => {
    for (const pattern of ignoreUrls) {
      if (req.url.includes(pattern)) {
        console.debug(
          'accelerate-ng-core.http.basicInterceptor: ignoring URL | %s',
          req.url,
        );
        return next(req);
      }
    }

    console.debug(
      'accelerate-ng-core.http.basicInterceptor: adding required headers/flags to request',
      req.headers,
    );
    req = req.clone({
      // withCredentials: withCredentials,
      setHeaders: headers ?? {},
    });

    return next(req).pipe(
      tap((event: HttpEvent<unknown>) => {
        console.debug(
          'accelerate-ng-core.http.basicInterceptor.interceptResponse:',
          event,
        );
      }),
    );
  };
}
