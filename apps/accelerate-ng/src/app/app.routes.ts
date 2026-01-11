// external imports
import { Routes } from '@angular/router';

// internal imports
import { authRouteGuard } from '@rn-accelerate-ng/auth';
import {
  AuthComponent,
  ErrorComponent,
  UserComponent,
} from '@rn-accelerate-ng/bootstrap';
import { Admin } from './admin/admin';
import { Components } from './components/components';
import { NxWelcome } from './nx-welcome';

// define routes
export const appRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    data: {
      options: {
        errorStyle: 'danger',
        users: [
          { email: 'A', name: 'AAA' },
          { email: 'B', name: 'BBB' },
        ],
      },
    },
  },
  { path: 'user/settings', component: UserComponent },
  {
    path: '',
    canActivateChild: [authRouteGuard],
    children: [
      // core routes
      { path: 'home', component: NxWelcome, data: { permission: 'home' } },

      // components routes
      {
        path: 'components',
        component: Components,
        data: { permission: 'components' },
        loadChildren: () =>
          import('./components/components.routes').then(
            (r) => r.ComponentRoutes,
          ),
      },

      // admin routes
      {
        path: 'admin',
        component: Admin,
        data: { permission: 'admin' },
        loadChildren: () =>
          import('./admin/admin.routes').then((r) => r.AdminRoutes),
      },

      // user routes
      { path: 'user/profile', component: UserComponent },

      // exception routes
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        path: '**',
        component: ErrorComponent,
        data: {
          code: 404,
          message: 'Page not found',
          support: { label: 'contact Admin', url: 'mailto:rohit.nn@gmail.com' },
          home: { label: 'Home', url: '/dashboard' },
        },
      },
    ],
  },
];
