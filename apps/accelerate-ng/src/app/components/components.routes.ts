// external imports
import { Route, Routes } from '@angular/router';
import { Alert } from './alert/alert';
import { Button } from './button/button';
import { ColorMode } from './color-mode/color-mode';
import { Crud } from './crud/crud';
import { Error } from './error/error';
import { Footer } from './footer/footer';
import { Form } from './form/form';
import { Header } from './header/header';
import { Modal } from './modal/modal';
import { Table } from './table/table';
import { User } from './user/user';

// internal imports

// admin routes
export const ComponentRoutes: Routes = [
  { path: 'alert', component: Alert },
  { path: 'button', component: Button },
  { path: 'color-mode', component: ColorMode },
  { path: 'crud', component: Crud },
  { path: 'error', component: Error },
  { path: 'footer', component: Footer },
  { path: 'form', component: Form },
  { path: 'header', component: Header },
  { path: 'modal', component: Modal },
  { path: 'table', component: Table },
  { path: 'user', component: User },
] satisfies Route[];
