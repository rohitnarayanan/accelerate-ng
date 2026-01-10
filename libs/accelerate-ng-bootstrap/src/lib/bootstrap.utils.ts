// external imports
import { Injectable } from '@angular/core';

// global variables
const THEME_CSS_LINK_ID = 'themeCssLink';
const COLOR_MODE_ICON_MAP: Record<string, string> = {
  light: 'sun-fill',
  dark: 'moon-stars-fill',
  auto: 'circle-half',
};

@Injectable({
  providedIn: 'root',
})
export class StyleHelper {
  /**
   * Registers a listener for system color scheme changes.
   *
   * @param colorMode - The current color mode preference.
   */
  listenToColorModeChanges(colorMode: string) {
    // this.setColorMode(colorMode);

    // register listener for system color scheme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        console.warn('StyleHelper: System colorMode changed');
        if (colorMode === 'auto') {
          this.setColorMode(colorMode);
        }
      });
  }

  /**
   * Sets the theme preference and updates the UI accordingly.
   *
   * @param theme - The new theme preference.
   */
  setTheme(theme: string) {
    console.info('StyleHelper.setTheme: ', theme);

    const cssHref = `assets/styles/themes/${theme}/bootstrap.css`;
    let linkElement = jQuery('#' + THEME_CSS_LINK_ID);

    if (theme === 'default') {
      linkElement.remove();
    } else if (linkElement.length == 0) {
      linkElement = jQuery('<link>').attr({
        id: THEME_CSS_LINK_ID,
        rel: 'stylesheet',
        href: cssHref,
      });
      jQuery('#htmlHead').append(linkElement);
    } else {
      linkElement.attr('href', cssHref);
    }
  }

  /**
   * Sets the color mode preference and updates the UI accordingly.
   *
   * @param colorMode - The new color mode preference.
   */
  setColorMode(colorMode: string) {
    if (
      colorMode === 'auto' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', colorMode);
    }
  }

  /**
   * Retrieves the toggle mode for current color.
   *
   * @returns The color mode to toggle.
   */
  toggleColorMode(colorMode: string): string {
    return colorMode === 'light' ? 'dark' : 'light';
  }

  /**
   * Retrieves the icon for the given color mode.
   *
   * @returns The icon for the given color mode.
   */
  colorModeIcon(colorMode: string): string {
    return COLOR_MODE_ICON_MAP[colorMode];
  }
}
