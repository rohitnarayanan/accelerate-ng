// external imports
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { merge } from 'lodash-es';

// internal imports
import { AlertOptions } from './alert/alert.component';
import { AuthOptions } from './auth/auth.component';
import { ButtonOptions } from './button/button.component';
import { ColorModeOptions } from './color-mode/color-mode';
import { CRUDOptions } from './crud/crud.component';
import { ErrorOptions } from './error/error.component';
import { FooterOptions } from './footer/footer.component';
import { FormOptions } from './form/form.component';
import { HeaderOptions } from './header/header.component';
import { ModalOptions } from './modal/modal.component';
import { NavbarOptions } from './navbar/navbar';
import { OffcanvasOptions } from './offcanvas/offcanvas';
import { TableOptions } from './table/table.component';
import { UserOptions } from './user/user.component';

/** Config interface to provide application wide default properties for components **/
/**
 * Configuration interface for customizing various Bootstrap-based UI components
 * in the Accelerate NG Bootstrap library.
 *
 * Each property corresponds to a specific UI component and allows partial
 * customization via its respective options interface.
 *
 * @property alert - Partial configuration for alert components.
 * @property button - Partial configuration for button components.
 * @property crud - Partial configuration for CRUD (Create, Read, Update, Delete) components.
 * @property error - Partial configuration for error handling components.
 * @property footer - Partial configuration for footer components.
 * @property form - Partial configuration for form components.
 * @property header - Partial configuration for header components.
 * @property modal - Partial configuration for modal dialog components.
 * @property table - Partial configuration for table components.
 * @property user - Partial configuration for user-related components.
 */
export interface AccelerateBootstrapConfig {
  alert: Partial<AlertOptions>;
  auth: Partial<AuthOptions>;
  button: Partial<ButtonOptions>;
  colorMode: Partial<ColorModeOptions>;
  crud: Partial<CRUDOptions>;
  error: Partial<ErrorOptions>;
  footer: Partial<FooterOptions>;
  form: Partial<FormOptions>;
  header: Partial<HeaderOptions>;
  modal: Partial<ModalOptions>;
  navbar: Partial<NavbarOptions>;
  offcanvas: Partial<OffcanvasOptions>;
  table: Partial<TableOptions>;
  user: Partial<UserOptions>;
}

/**
 * The default configuration object for Accelerate Bootstrap.
 *
 * This constant provides a partial configuration for `AccelerateBootstrapConfig`,
 * serving as the base or fallback settings for the Accelerate Bootstrap module.
 * Properties can be overridden as needed to customize the bootstrap behavior.
 *
 * @see AccelerateBootstrapConfig
 */
export const DEFAULT_ACCELERATE_BOOTSTRAP_CONFIG: Partial<AccelerateBootstrapConfig> =
  {};

/**
 * Injection token for providing the global configuration of Accelerate Bootstrap components.
 *
 * This token is used to inject the default or custom configuration for Accelerate Bootstrap
 * throughout the Angular application. The configuration is provided at the root level and
 * defaults to `DEFAULT_ACCELERATE_BOOTSTRAP_CONFIG` if not overridden.
 *
 * @see DEFAULT_ACCELERATE_BOOTSTRAP_CONFIG
 * @publicApi
 */
export const ACCELERATE_BOOTSTRAP_CONFIG_TOKEN =
  new InjectionToken<AccelerateBootstrapConfig>('AccelerateBootstrapConfig', {
    providedIn: 'root',
    factory: () =>
      DEFAULT_ACCELERATE_BOOTSTRAP_CONFIG as AccelerateBootstrapConfig,
  });

/**
 * Creates Angular environment providers for the Accelerate Bootstrap configuration.
 *
 * Merges the provided partial configuration with the default configuration and
 * registers it under the `ACCELERATE_BOOTSTRAP_CONFIG_TOKEN` injection token.
 *
 * @param config - A partial configuration object to override default bootstrap settings.
 * @returns An array of environment providers with the merged configuration.
 */
export const provideAccelerateBootstrapConfig = (
  config: Partial<AccelerateBootstrapConfig>,
) => {
  console.warn('provideAccelerateBootstrapConfig:', config);

  return makeEnvironmentProviders([
    {
      provide: ACCELERATE_BOOTSTRAP_CONFIG_TOKEN,
      useValue: merge(DEFAULT_ACCELERATE_BOOTSTRAP_CONFIG, config),
    },
  ]);
};
