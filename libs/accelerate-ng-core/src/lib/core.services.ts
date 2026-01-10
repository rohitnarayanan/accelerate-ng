// external imports
import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

// internal imports
import {
  ACCELERATE_APP_CONFIG_TOKEN,
  AccelerateCoreConfig,
} from './core.config';

// definitions
/**
 * Service class for handling local storage operations with a specific prefix
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  /**
   * The prefix used for local storage keys, typically the application name.
   */
  private appName: string;

  /**
   * The application configuration, injected via Angular's dependency injection system.
   */
  private config: AccelerateCoreConfig = inject(ACCELERATE_APP_CONFIG_TOKEN);

  /**
   * constructor for this service
   * @param config
   */
  constructor() {
    this.appName = this.config.name;
  }

  /**
   * Retrieves a value from local storage by key
   * @param key - The key to retrieve the value for
   * @returns The parsed value or null if not found
   */
  get(key: string, defaultValue = ''): string {
    return localStorage.getItem(`${this.appName}.${key}`) ?? defaultValue;
  }

  /**
   * Retrieves a JSON value from local storage by key
   * @param key - The key to retrieve the value for
   * @returns The parsed value or null if not found
   */
  getJSON<T>(key: string, defaultValue?: T): T {
    const data = this.get(key);
    return data ? JSON.parse(data) : ((defaultValue ?? {}) as T);
  }

  /**
   * Stores a value in local storage under the specified key
   * @param key - The key to store the value under
   * @param value - The value to store
   */
  set(key: string, value: string): void {
    localStorage.setItem(`${this.appName}.${key}`, value);
  }

  /**
   * Stores a JSON value in local storage under the specified key
   * @param key - The key to store the value under
   * @param value - The value to store
   */
  setJSON(key: string, value: object): void {
    localStorage.setItem(`${this.appName}.${key}`, JSON.stringify(value));
  }

  /**
   * Removes a value from local storage by key
   * @param key - The key to remove the value for
   */
  remove(key: string): void {
    localStorage.removeItem(`${this.appName}.${key}`);
  }

  /**
   * Clears all values in local storage that match the prefix
   */
  clearAll(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${this.appName}.`))
      .forEach((key) => localStorage.removeItem(key));
  }
}

@Injectable({ providedIn: 'root' })
/**
 * A service that provides utility methods for interacting with Angular's routing system.
 * It offers access to the current route snapshot, URL, query parameters, and navigation methods.
 */
export class RouteService {
  /**
   * The Angular Router instance, used for navigation and route management.
   */
  router: Router = inject(Router);

  // /**
  //  * The Angular NgZone instance, used to ensure navigation occurs within the Angular zone.
  //  */
  // ngZone: NgZone = inject(NgZone);

  /**
   * The Angular Location service, used for interacting with the browser's URL and history.
   */
  location: Location = inject(Location);

  /**
   * Retrieves the current `ActivatedRouteSnapshot` by traversing to the deepest child route.
   *
   * @returns The deepest `ActivatedRouteSnapshot` in the current route tree.
   */
  get snapshot(): ActivatedRouteSnapshot {
    let activatedRoute = this.router.routerState.snapshot.root;
    while (activatedRoute.firstChild) {
      activatedRoute = activatedRoute.firstChild;
    }

    return activatedRoute;
  }

  /**
   * Retrieves the current URL as a string.
   *
   * @returns The current URL.
   */
  get currentUrl(): string {
    return this.router.url;
  }

  /**
   * Retrieves the current path from the browser's location.
   *
   * @returns The current path.
   */
  get currentPath(): string {
    return this.location.path();
  }

  /**
   * Retrieves the query parameters from the current route snapshot.
   *
   * @returns An object containing the query parameters.
   */
  get queryParams(): Params {
    return this.snapshot.queryParams;
  }

  /**
   * Navigates to a specified URL.
   *
   * @param url - The URL to navigate to.
   */
  navigateByUrl(url: string): void {
    console.debug('RouteService.navigateByUrl:', url);
    // this.ngZone.run(() => {  });
    this.router.navigateByUrl(url, {
      onSameUrlNavigation: 'reload',
      replaceUrl: true,
    });
  }

  /**
   * Navigates back to the previous location in the browser's history.
   */
  goBack(): void {
    console.debug('AbstractComponent.goBack');
    this.location.back();
  }
}

/**
 * Abstract service class for implementing a publish-subscribe pattern
 * with a BehaviorSubject to manage state and notify subscribers.
 * @template T - The type of the state managed by the service.
 */
export abstract class PubSubService<T> {
  /**
   * BehaviorSubject to hold the current state and notify subscribers of changes
   */
  protected subject: BehaviorSubject<T>;

  /**
   * Constructor initializes the BehaviorSubject with the initial value.
   */
  constructor() {
    this.subject = new BehaviorSubject<T>(this.initialValue());
  }

  /**
   * Abstract method to define the initial value of the state.
   * Must be implemented by subclasses.
   * @returns The initial value of type T.
   */
  abstract initialValue(): T;

  /**
   * Getter to retrieve the current value of the state.
   * @returns The current value of type T.
   */
  get value(): T {
    return this.subject.value;
  }

  /**
   * Subscribes to changes in the state.
   * @param callback - A function to be called whenever the state changes.
   */
  subscribe(callback: (value: T) => void): void {
    this.subject.subscribe((changedValue) => {
      callback(changedValue);
    });
  }

  /**
   * Publishes a new value to the state, notifying all subscribers.
   * @param newValue - The new value of type T to be published.
   */
  protected publish(newValue: T): void {
    this.subject.next(newValue);
  }
}
