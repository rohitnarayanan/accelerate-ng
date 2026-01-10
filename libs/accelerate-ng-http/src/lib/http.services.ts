// external imports
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// internal imports
import { GenericType } from '@rn-accelerate-ng/core';
import {
  ACCELERATE_HTTP_CONFIG_TOKEN,
  AccelerateHttpConfig,
} from './http.config';
import { HttpUtil } from './http.utils';

/**
 * Abstract service class for implementing Backend API Service implementations
 */
export abstract class AbstractHTTPService {
  protected httpConfig: AccelerateHttpConfig = inject(
    ACCELERATE_HTTP_CONFIG_TOKEN,
  );

  private _basePath: string;
  private _httpClient: HttpClient;

  constructor(apiRoot = '') {
    this._basePath = HttpUtil.trimURL(
      `${this.httpConfig.apiBasePath}/${apiRoot}/`,
    );
    this._httpClient = inject(HttpClient);
  }

  protected updateBasePath(value: string) {
    this._basePath = HttpUtil.trimURL(value);
  }

  protected getEndpoint(apiSuffix?: string): string {
    const endpoint =
      !apiSuffix || apiSuffix === ''
        ? `${this._basePath}/`
        : `${this._basePath}/${apiSuffix}/`;
    return HttpUtil.trimURL(endpoint);
  }

  protected get httpClient(): HttpClient {
    return this._httpClient;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError(operation: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response: HttpErrorResponse): Observable<any> => {
      // TODO: better job of transforming error for user consumption
      console.error('HttpService.%s.ERROR: %O', operation, response);

      return of(response);
    };
  }

  protected getQueryString(queryParams?: GenericType): string {
    return queryParams
      ? `?${Object.keys(queryParams)
          .map((key) => `${key}=${queryParams[key]}`)
          .join('&')}`
      : '';
  }

  protected GET<T>(
    opName: string,
    apiPath: string,
    queryParams?: GenericType,
    options?: GenericType,
  ) {
    const queryString = this.getQueryString(queryParams);
    console.debug(
      'HttpService.GET (%s): apiPath = %s | queryString = %s | options = %s',
      opName,
      apiPath,
      queryString,
      options,
    );

    return this.httpClient
      .get<T>(`${this.getEndpoint(apiPath)}${queryString}`, options)
      .pipe(catchError(this.handleError(opName)));
  }

  protected POST<T>(
    opName: string,
    apiPath: string,
    body: unknown,
    queryParams?: GenericType,
    options?: GenericType,
  ) {
    const queryString = this.getQueryString(queryParams);
    console.debug(
      'HttpService.POST (%s): apiPath = %s | queryString = %s | options = %s',
      opName,
      apiPath,
      queryString,
      options,
    );

    return this.httpClient
      .post<T>(`${this.getEndpoint(apiPath)}${queryString}`, body, options)
      .pipe(catchError(this.handleError(opName)));
  }

  protected PUT<T>(
    opName: string,
    apiPath: string,
    body: unknown,
    queryParams?: GenericType,
    options?: GenericType,
  ) {
    const queryString = this.getQueryString(queryParams);
    console.debug(
      'HttpService.PUT (%s): apiPath = %s | queryString = %s | options = %s',
      opName,
      apiPath,
      queryString,
      options,
    );

    return this.httpClient
      .put<T>(`${this.getEndpoint(apiPath)}${queryString}`, body, options)
      .pipe(catchError(this.handleError(opName)));
  }

  protected DELETE<T>(
    opName: string,
    apiPath: string,
    body?: unknown,
    queryParams?: GenericType,
    options?: GenericType,
  ) {
    const queryString = this.getQueryString(queryParams);
    console.debug(
      'HttpService.DELETE (%s): apiPath = %s | queryString = %s | options = %s',
      opName,
      apiPath,
      queryString,
      options,
    );

    if (body) {
      options = options ?? {};
      options['body'] = body;
    }
    return this.httpClient
      .delete<T>(`${this.getEndpoint(apiPath)}${queryString}`, options)
      .pipe(catchError(this.handleError(opName)));
  }
}
