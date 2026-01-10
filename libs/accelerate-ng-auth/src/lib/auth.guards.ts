// external imports
import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';

// internal imports
import {
  ACCELERATE_AUTH_CONFIG_TOKEN,
  AuthFrontendConfig,
} from './auth.config';
import { AuthService } from './auth.services';

/**
 * A route guard function that checks for user authentication and permissions before allowing access to a route.
 *
 * @returns {CanActivateChildFn} A function that determines whether the route can be activated.
 *
 * The guard performs the following checks:
 * 1. If the route URL matches any pattern in the `ignoreAppRoutes` configuration, the route is allowed without authentication.
 * 2. If the user is not authenticated, they are redirected to the login page.
 * 3. If the route requires a specific permission (defined in `route.data.permission`), the guard checks if the user has that permission.
 */
export const authRouteGuard: CanActivateChildFn = (route, state) => {
  const config: AuthFrontendConfig | undefined = inject(
    ACCELERATE_AUTH_CONFIG_TOKEN,
  ).frontend;
  const authService = inject(AuthService);

  console.debug('accelereate.auth.routeGuard: %O | %O', route, state);

  for (const pattern of config?.ignoreAppRoutes ?? []) {
    if (state.url.includes(pattern)) {
      console.debug(
        'accelereate.auth.routeGuard: ignoring auth URL | %s',
        state.url,
      );
      return true;
    }
  }

  if (!authService.isAuthenticated) {
    console.warn(
      'accelereate.auth.routeGuard: User not authenticated, redirecting to login page | %s',
      state.url,
    );
    authService.sendToLogin(state.url);
    return false;
  }

  const permission = (route.data ?? {})['permission'];
  if (permission && !authService.hasPermission(permission)) {
    console.warn(
      'accelereate.auth.routeGuard: User does not have permission for the route - %s | %s',
      state.url,
      permission,
    );
    return false;
  }

  return true;
};
