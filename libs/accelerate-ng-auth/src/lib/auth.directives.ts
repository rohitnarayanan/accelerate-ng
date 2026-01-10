// external imports
import {
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

// internal imports
import { AuthService } from './auth.services';

/**
 * Directive to conditionally include an Angular template/element based on user permissions.
 *
 * This directive uses the `AuthService` to check if the current user has the specified permission.
 * If the user has the permission, the template is rendered; otherwise, it is removed from the view.
 *
 * @example
 * ```html
 * <ng-template [angHasPermission]="'admin'">
 *   <p>You have admin access!</p>
 * </ng-template>
 * ```
 *
 * @selector [angHasPermission]
 *
 * @Input
 * @param {string} angHasPermission - permission key to check against the user's permissions.
 */
@Directive({
  selector: '[angHasPermission]',
})
export class HasPermissionDirective {
  host: ElementRef = inject(ElementRef);
  private templateRef: TemplateRef<unknown> = inject(TemplateRef);
  private viewContainer: ViewContainerRef = inject(ViewContainerRef);
  private authService: AuthService = inject(AuthService);

  @Input() set angHasPermission(permission: string) {
    if (this.authService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    this.viewContainer.clear();
  }
}

@Directive({
  selector: '[angHasAnyPermission]',
})
/**
 * Directive to conditionally include an Angular template based on user permissions.
 *
 * This directive checks if the user has any of the specified permissions and includes
 * the template content if the user has at least one of the permissions. If the user
 * does not have any of the specified permissions, the template content is not included.
 *
 *
 * @example
 * ```html
 * <ng-template [angHasAnyPermission]="['admin', 'editor']">
 *   <p>You have access to this content.</p>
 * </ng-template>
 * ```
 *
 * @selector [angHasAnyPermission]
 *
 * @Input
 * @param {string[]} angHasAnyPermission - Array of permissions to check against the user's permissions.
 */
export class HasAnyPermissionDirective {
  host: ElementRef = inject(ElementRef);
  private templateRef: TemplateRef<unknown> = inject(TemplateRef);
  private viewContainer: ViewContainerRef = inject(ViewContainerRef);
  private authService: AuthService = inject(AuthService);

  @Input() set angHasAnyPermission(permissions: string[]) {
    if (this.authService.hasAnyPermission(...permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    this.viewContainer.clear();
  }
}
