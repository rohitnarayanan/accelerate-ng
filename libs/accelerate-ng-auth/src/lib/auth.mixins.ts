// external imports
import { inject } from '@angular/core';

// internal imports
import { AbstractConstructor } from '@rn-accelerate-ng/core';
import { AuthService } from './auth.services';
import { UserProfile } from './auth.types';

/**
 * Mixin to provide access to AuthService and its methods within a component
 * @param BaseClass
 * @returns
 */
export function authComponentMixin<$C extends AbstractConstructor>(
  BaseClass: $C,
) {
  abstract class AuthenticatedBaseComponent extends BaseClass {
    public readonly authService: AuthService = inject(AuthService);

    get userProfile(): UserProfile {
      return (this.authService.userProfile || {}) as UserProfile;
    }

    get isAuthenticated(): boolean {
      return this.authService.isAuthenticated;
    }

    userHasPermission(permission: string): boolean {
      return this.authService.hasPermission(permission);
    }

    userHasAnyPermission(...permissions: string[]): boolean {
      return this.authService.hasAnyPermission(...permissions);
    }
  }

  return AuthenticatedBaseComponent;
}
