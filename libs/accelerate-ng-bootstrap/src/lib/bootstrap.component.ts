// external imports
import {
  Component,
  effect,
  ElementRef,
  inject,
  Injectable,
  input,
  InputSignal,
  signal,
  Signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { get, isEmpty, merge } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import * as $ from 'jquery';

// internal imports
import {
  BaseComponent,
  GenericType,
  memoizeComputed,
  ObjectUtil,
} from '@rn-accelerate-ng/core';
import { ACCELERATE_BOOTSTRAP_CONFIG_TOKEN } from './bootstrap.config';

/**
 * Interface representing the configuration options for a component.
 * This interface extends the GenericType interface and serves as a base type
 * for defining specific configuration options for various components.
 */
export type ConfigOptions<$T = unknown> = GenericType<$T>;

/**
 * Represents a component that can be configured with a set of options.
 *
 * @template $O - The type of configuration options, extending `ConfigOptions`.
 */
export interface Configurable<$O extends ConfigOptions> {
  /**
   * A unique identifier for the component instance.
   */
  readonly instanceId: string;

  /**
   * The key used to identify the configuration for this component.
   */
  readonly configKey: string;

  /**
   * Optional input signal to provide configuration options.
   */
  readonly options: InputSignal<Partial<$O>>;

  /**
   * The current options for the component.
   */
  get config(): $O;

  /**
   * Returns the default options for the component.
   *
   * @returns A partial object containing the default options.
   */
  defaultOptions(): Partial<$O>;

  /**
   * Configures the component's options based on the provided current options.
   *
   * @param currentOptions - The current options to configure.
   */
  configureOptions(currentOptions: Partial<$O>): void;

  /**
   * Updates the component's options with the provided updates.
   *
   * @param updates - An optional partial object containing updates to apply to the options.
   */
  updateOptions(updates?: Partial<$O>): void;
}

/**
 * Service responsible for managing and merging configuration options for configurable components.
 *
 * The `ConfigurerService` provides methods to retrieve, merge, and cache default and global configuration
 * options for components, as well as to apply input and override options in a prioritized manner.
 * It supports deep merging of configuration objects and logs detailed trace information for debugging.
 *
 * ### Responsibilities:
 * - Retrieve and cache merged default configuration options for components.
 * - Merge global, default, input, and override options for components in a defined priority order.
 * - Provide debugging and trace logs for each step of the configuration process.
 * - Allow resetting of cached defaults.
 *
 * ### Configuration Priority (ascending order):
 * 1. Default options provided by the component.
 * 2. Global configuration options from the application config.
 * 3. Input options provided directly to the component.
 * 4. Explicit overrides passed to the service.
 *
 * @template ConfigOptions - The base type for configuration option objects.
 * @template ConfigurableComponent - The type for components that can be configured by this service.
 * @template GenericType - A generic type mapping for configuration options.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigurerService {
  appConfig = inject(ACCELERATE_BOOTSTRAP_CONFIG_TOKEN);

  private defaultsCache: GenericType<ConfigOptions> = {};
  private inputsCache: GenericType<ConfigOptions> = {};
  private overridesCache: GenericType<ConfigOptions> = {};
  private finalOptionsCache: GenericType<ConfigOptions> = {};

  /**
   * Resets the configuration defaults to an empty object.
   *
   * This method clears all existing default configuration values,
   * effectively restoring the configuration to its initial state.
   * Debug messages are logged at the start and end of the operation.
   */
  resetDefaults(): void {
    console.debug('ConfigurerService.resetDefaults: START');
    this.defaultsCache = {};
    console.debug('ConfigurerService.resetDefaults: END');
  }

  /**
   * Retrieves and merges the default configuration options for a given configurable component.
   *
   * This method first checks if the merged defaults for the component's configuration key are already cached.
   * If cached, it returns the cached defaults. Otherwise, it fetches the global configuration options using
   * the component's configuration key, merges them with the component's own default options, and caches the result.
   * The merged defaults are then returned.
   *
   * @typeParam $O - The type of configuration options for the component.
   * @param component - The configurable component instance for which to retrieve default options.
   * @returns A partial object containing the merged default configuration options for the component.
   */
  componentDefaults<$O extends ConfigOptions>(
    component: ConfigurableComponent<$O>,
  ): Partial<$O> {
    console.debug(
      `ConfigurerService.${component.configKey}[${component.instanceId}].componentDefaults: START`,
    );

    if (this.defaultsCache[component.configKey]) {
      const cachedDefaults = this.defaultsCache[
        component.configKey
      ] as Partial<$O>;
      console.debug(
        `ConfigurerService.${component.configKey}[${component.instanceId}].componentDefaults.cached`,
        cachedDefaults,
      );

      return cachedDefaults;
    }

    // Fetch global configuration options using the configuration key.
    const globalOptions = get(
      this.appConfig,
      component.configKey,
    ) as Partial<$O>;
    this.traceOptions(component, 'global', globalOptions);

    const defaultOptions = component.defaultOptions();
    this.traceOptions(component, 'default', defaultOptions);

    const mergedDefaults = merge({}, defaultOptions, globalOptions ?? {});
    this.traceOptions(component, 'mergedDefaults', mergedDefaults);

    // Store the merged defaults in the service's defaults object
    this.defaultsCache[component.configKey] = mergedDefaults as ConfigOptions;

    return mergedDefaults;
  }

  /**
   * Merges configuration options for a configurable component, applying defaults, input options, and overrides.
   *
   * This method takes the existing merged options and the new input options,
   * performs a deep merge, and returns the resulting configuration. It also
   * logs the input and final options for debugging purposes.
   *
   * The priority of configuration options is as follows (in ascending order):
   * 1. Default options provided by the component.
   * 2. Global configuration options from `AccelerateBootstrapConfig`.
   * 3. Input options provided directly to the component.
   *
   * This method performs the following steps:
   * 1. Retrieves the component's input options.
   * 2. Merges the component's default options with the input options.
   * 3. Applies the merged options to the component via `configureOptions`.
   * 4. Merges any provided overrides into the configured options.
   * 5. Returns the final merged options.
   *
   * Debug and trace information is logged at each step for easier troubleshooting.
   *
   * @template $O - The type of configuration options for the component.
   * @param component - The configurable component instance.
   * @param overrides - Partial options to override the merged configuration.
   * @returns The final merged configuration options for the component.
   */
  componentOptions<$O extends ConfigOptions>(
    component: ConfigurableComponent<$O>,
    overrides: Partial<$O>,
  ): Partial<$O> {
    console.debug(
      `ConfigurerService.${component.configKey}[${component.instanceId}].componentOptions: START |`,
      overrides,
    );

    const inputOptions = component.options();
    let inputChanged = true;
    if (component.instanceId in this.inputsCache) {
      const cachedInputs = this.inputsCache[
        component.instanceId
      ] as Partial<$O>;
      const inputDiff = ObjectUtil.diff(cachedInputs, inputOptions);
      if (isEmpty(inputDiff)) {
        inputChanged = false;
      } else {
        console.debug(
          `ConfigurerService.${component.configKey}[${component.instanceId}].componentOptions.inputChanged`,
          inputDiff,
        );
      }
    }

    if (inputChanged) {
      this.traceOptions(component, 'input', inputOptions);
      this.inputsCache[component.instanceId] = inputOptions as ConfigOptions;
    }

    let overridesChanged = true;
    if (component.instanceId in this.overridesCache) {
      const cachedOverrides = this.overridesCache[
        component.instanceId
      ] as Partial<$O>;
      const overrideDiff = ObjectUtil.diff(cachedOverrides, overrides);
      if (isEmpty(overrideDiff)) {
        overridesChanged = false;
      } else {
        console.debug(
          `ConfigurerService.${component.configKey}[${component.instanceId}].componentOptions.overridesChanged`,
          overrideDiff,
        );
      }
    }

    if (overridesChanged) {
      this.traceOptions(component, 'overrides', overrides);
      this.overridesCache[component.instanceId] = overrides as ConfigOptions;
    }

    if (!inputChanged && !overridesChanged) {
      console.debug(
        `ConfigurerService.${component.configKey}[${component.instanceId}].componentOptions: No changes detected in input or overrides. Using cached options.`,
      );
      return this.finalOptionsCache[component.instanceId] as Partial<$O>;
    }

    const mergedOptions = merge(
      {},
      this.componentDefaults(component),
      inputOptions ?? {},
    );
    this.traceOptions(component, 'mergedWithInput', mergedOptions);

    const finalOptions = merge(mergedOptions, overrides);
    this.traceOptions(component, 'beforeConfigure', finalOptions);

    component.configureOptions(finalOptions);
    this.traceOptions(component, 'finalOptions', finalOptions);
    this.finalOptionsCache[component.instanceId] = finalOptions;

    return finalOptions;
  }

  /**
   * Logs the configuration options for a given configurable component to the console for debugging purposes.
   *
   * @template $O - The type of configuration options.
   * @param component - The configurable component whose options are being traced.
   * @param optionType - A string representing the type or category of the options.
   * @param options - An optional partial set of configuration options to be logged.
   */
  traceOptions<$O extends ConfigOptions>(
    component: ConfigurableComponent<$O>,
    optionType: string,
    options?: Partial<ConfigOptions>,
  ): void {
    console.debug(
      `ConfigurerService.${component.configKey}[${component.instanceId}].options.${optionType}:`,
      options,
    );
  }
}

/**
 * Represents a base component that provides Configurable behavior for creating dynamic components.
 *
 * @template $O - The type of the configuration options.
 * @template $C - The base class constructor type to extend.
 * @param BaseClass - The base class to be extended with configurable behavior.
 * @returns An abstract class extending the base class, implementing the `ConfigurableComponent` interface.
 *
 * @remarks
 * Mixed-in classes must implement the `config` property as an `InputSignal`.
 *
 * @example
 * ```typescript
 * class MyComponent extends ConfigurableMixin<MyOptions, typeof BaseComponent>(BaseComponent) {
 *   readonly config: InputSignal<Partial<CONFIG_TYPE> | undefined> = input<Partial<CONFIG_TYPE> | undefined>();
 *   // ...
 * }
 * ```
 */
@Component({
  template: '',
})
export abstract class ConfigurableComponent<
    $O extends ConfigOptions = ConfigOptions,
  >
  extends BaseComponent
  implements Configurable<$O>
{
  private readonly configurerService = inject(ConfigurerService);
  private readonly host = inject(ElementRef);

  readonly instanceId: string = uuidv4();
  readonly configKey = this.constructor.name;
  readonly options: InputSignal<Partial<$O>> = input<Partial<$O>>({}); //, {alias: 'config'}

  /**
   * Input signal to collect additional HTML attributes to be applied to the component.
   */
  readonly htmlAttributes: InputSignal<Record<string, string>> = input<
    Record<string, string>
  >({});

  private _finalOptions: Partial<$O> | undefined;
  _componentOptions!: Signal<Partial<$O>>;
  _updatedOptions: WritableSignal<Partial<$O>> = signal<Partial<$O>>({});

  constructor() {
    super();
    this.__initialize();
  }

  __initialize(): void {
    console.debug(
      `ConfigurableComponent.${this.configKey}[${this.instanceId}].__initialize: START`,
    );

    // step 1: Compute the final merged options for this component
    this._componentOptions = memoizeComputed(() => {
      const _oldOptions = this._finalOptions;
      this._finalOptions = this.configurerService.componentOptions(
        this,
        this._updatedOptions(),
      ) as $O;

      untracked(() => {
        this._updatedOptions.set({});
      });

      if (_oldOptions !== undefined) {
        console.warn(
          `ConfigurableComponent.${this.configKey}[${this.instanceId}].recomputed.`,
          _oldOptions,
          ObjectUtil.diff(_oldOptions, this._finalOptions),
        );
      }

      return this._finalOptions;
    });

    // step 2: Set any html attributes provided
    effect(() => {
      $.each(this.htmlAttributes(), (key, value) => {
        this.host.nativeElement.setAttribute(key, value);
      });
    });
  }

  get config(): $O {
    return this._componentOptions() as $O;
  }

  defaultOptions(): Partial<$O> {
    return {};
  }

  configureOptions(_currentOptions: Partial<$O>): void {
    return;
  }

  updateOptions(updates?: Partial<$O>): void {
    if (updates) {
      /**
       * If updates are provided, set _updatedOptions. This triggers a re-computation of the _componentOptions
       */
      console.debug(
        `ConfigurableComponent.${this.configKey}[${this.instanceId}].updateOptions: Setting updated options`,
        updates,
      );
      this._updatedOptions.set(updates);
    }
  }
}
