// external imports
import { Injectable, inject } from '@angular/core';
import { buildUrl } from 'build-url-ts';
import { flatten, map, union, uniq } from 'lodash-es';
import { Observable } from 'rxjs';

// internal imports
import {
  GenericType,
  LocalStorageService,
  PubSubService,
  RouteService,
} from '@rn-accelerate-ng/core';
import { AbstractHTTPService } from '@rn-accelerate-ng/http';
import {
  ACCELERATE_AUTH_CONFIG_TOKEN,
  AccelerateAuthConfig,
} from './auth.config';
import { JwtToken, LoginResponse, UserProfile } from './auth.types';

// global constants
const JWT_TOKEN_KEY = '_ACCELERATE_AUTH_TOKEN';

/**
 * The `AuthService` class is responsible for managing the authentication state and permissions within the application.
 * It extends the `PubSubService` to provide reactive updates on the authentication state.
 *
 * This service handles JWT-based authentication, including login, logout, and permission checks.
 * It also integrates with local storage to persist authentication tokens and provides utility methods for navigating to the login page.
 *
 * It is used by other components, interceptors, guards etc. to check if the user is authenticated and has the required permissions.
 *
 * Default implementation is to not have any authentication and authorization, unless explicitly enabled in the configuration.
 *
 * @extends PubSubService<boolean>
 */
@Injectable({ providedIn: 'root' })
export class AuthService extends PubSubService<boolean> {
  private routeService: RouteService = inject(RouteService);
  private localStorageService: LocalStorageService =
    inject(LocalStorageService);
  private config: Partial<AccelerateAuthConfig> = inject(
    ACCELERATE_AUTH_CONFIG_TOKEN,
  );
  private authDisabled: boolean = this.config.frontend?.disableAuth ?? false;

  private _jwtToken?: JwtToken;
  private _userProfile?: UserProfile;
  private _userPermissions?: string[];

  constructor() {
    super();

    // If authentication is disabled in the configuration, publish an authenticated state and return.
    if (this.authDisabled) {
      this.publish(true);
      return;
    }

    // Attempt to retrieve the stored JWT token from local storage and log in if available.
    const storedJwtToken = this.localStorageService.get(JWT_TOKEN_KEY);
    if (storedJwtToken) {
      this.login(storedJwtToken);
    }
  }

  /**
   * Provides the initial value for the authentication state.
   * @returns {boolean} The initial authentication state (false).
   */
  override initialValue(): boolean {
    return false;
  }

  /**
   * The current JWT token, if available.
   * @returns {JwtToken | undefined}
   */
  get jwtToken(): JwtToken | undefined {
    return this._jwtToken;
  }

  /**
   * The current user profile, if available.
   * @returns {UserProfile | undefined}
   */
  get userProfile(): UserProfile | undefined {
    return this._userProfile;
  }

  /**
   * The current user permissions, if available.
   * @returns {string[] | undefined}
   */
  get userPermissions(): string[] | undefined {
    return this._userPermissions;
  }

  /**
   * Getter for the bearer token string used for authorization headers.
   * @returns {string} The bearer token string.
   */
  get bearerToken(): string {
    return this.jwtToken ? `Bearer ${this.jwtToken.token}` : '';
  }

  /**
   * Checks if the user is currently authenticated.
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  get isAuthenticated(): boolean {
    if (this.authDisabled) {
      return true;
    }

    if (this.subject.value) {
      if (this.jwtToken?.isValid) {
        return true;
      }

      this.logout();
    }

    return false;
  }

  /**
   * Checks if the user has a specific permission.
   * @param {string} permission - The permission to check.
   * @returns {boolean} True if the user has the permission, false otherwise.
   */
  hasPermission(permission: string): boolean {
    return this.hasAnyPermission(permission);
  }

  /**
   * Checks if the user has any of the specified permissions.
   * @param {...string[]} permissions - The permissions to check.
   * @returns {boolean} True if the user has any of the permissions, false otherwise.
   */
  hasAnyPermission(...permissions: string[]): boolean {
    if (this.authDisabled) {
      // authentication is disabled, grant access to all
      return true;
    }

    if (!this.isAuthenticated) {
      // user is not authenticated, deny access
      return false;
    }

    return (
      this.userPermissions?.some((permission) =>
        permissions.includes(permission),
      ) || false
    );
  }

  /**
   * Redirects the user to the login page, optionally including the current URL as a return URL.
   * @param {string} [currentUrl] - The current URL to include as a return URL.
   */
  sendToLogin(currentUrl?: string): void {
    currentUrl ??= window.location.pathname;
    console.log('AuthService.sendToLogin:', currentUrl);
    const loginUrl = buildUrl(this.config.frontend?.loginPath, {
      queryParams: { returnUrl: currentUrl },
    });
    this.routeService.navigateByUrl(loginUrl);
  }

  /**
   * Logs in the user by validating the provided access token and updating the authentication state.
   * @param {string} accessToken - The access token to validate and use for login.
   */
  login(accessToken: string): JwtToken | undefined {
    console.debug('AuthService.login.start');
    const jwtToken = new JwtToken(accessToken);
    if (!jwtToken.isValid) {
      this.logout();
      return;
    }

    console.warn('AuthService.login: jwtToken valid');
    console.debug('AuthService.login.jwtToken', jwtToken);

    this.localStorageService.set(JWT_TOKEN_KEY, jwtToken.token);
    this._jwtToken = jwtToken;
    this._userProfile = jwtToken.getAttribute<UserProfile>('profile');
    this._userPermissions = uniq(
      union(
        this._userProfile.permissions,
        flatten(map(this._userProfile.groups, 'permissions')),
      ),
    );
    this.publish(true);

    return jwtToken;
  }

  /**
   * Logs out the user by clearing the JWT token and updating the authentication state.
   */
  logout(): void {
    console.warn('AuthService.logout');
    this._jwtToken = undefined;
    this._userProfile = undefined;
    this._userPermissions = undefined;
    this.localStorageService.remove(JWT_TOKEN_KEY);
    this.publish(false);
  }
}

/**
 * The `AuthBackendService` class provides methods to interact with the backend authentication API.
 * It extends the `BaseHTTPService` to leverage common HTTP functionality and is responsible for
 * handling login and logout operations with the backend server.
 *
 * This service is used to authenticate users and manage their sessions on the server side.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthBackendService extends AbstractHTTPService {
  // Injects the application configuration to access backend authentication paths.
  protected authConfig: Partial<AccelerateAuthConfig> = inject(
    ACCELERATE_AUTH_CONFIG_TOKEN,
  );

  /**
   * Constructor for the `AuthBackendService` class.
   * Initializes the base HTTP service with the 'auth' endpoint.
   */
  constructor() {
    super('auth');
  }

  /**
   * Sends a login request to the backend server.
   * @param {string} user - The username or identifier of the user.
   * @param {GenericType} [options] - Optional additional parameters for the request.
   * @returns {Observable<LoginResponse>} An observable that emits the login response from the server.
   */
  login(user: string, options?: GenericType): Observable<LoginResponse> {
    return this.POST<LoginResponse>(
      'login',
      this.authConfig.backend?.loginPath ?? '',
      { user: user },
      options,
    );
  }

  /**
   * Sends a logout request to the backend server.
   * @param {GenericType} [options] - Optional additional parameters for the request.
   * @returns {Observable<string>} An observable that emits the logout response from the server.
   */
  logout(options?: GenericType): Observable<string> {
    return this.POST<string>(
      'logout',
      this.authConfig.backend?.logoutPath ?? '',
      {},
      options,
    );
  }
}
