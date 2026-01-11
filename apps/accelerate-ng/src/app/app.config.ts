// external imports
import { IMAGE_CONFIG } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

// internal imports
import {
  authHttpInterceptor,
  provideAccelerateAuthConfig,
} from '@rn-accelerate-ng/auth';
import { provideAccelerateBootstrapConfig } from '@rn-accelerate-ng/bootstrap';
import { provideAccelerateCoreConfig } from '@rn-accelerate-ng/core';
import { basicHttpInterceptor } from '@rn-accelerate-ng/http';
import { appRoutes } from './app.routes';

// app config
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),

    // http client config
    provideHttpClient(
      withFetch(),
      withInterceptors([basicHttpInterceptor(), authHttpInterceptor()]),
    ),

    // // quill config
    // provideQuillConfig({
    //   theme: 'snow',
    //   modules: {
    //     toolbar: [
    //       ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //       ['blockquote', 'code-block'],                     // blocks
    //       [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // lists
    //       [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
    //       [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
    //       [{ 'direction': 'rtl' }],                         // text direction
    //       [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        // header dropdown
    //       [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    //       [{ 'font': [] }],                                 // font family
    //       [{ 'align': [] }],                                // text align
    //       ['clean'],                                        // remove formatting button
    //       ['link', 'image', 'video']                        // link and image, video
    //     ]
    //   }
    // }),

    // image config
    {
      provide: IMAGE_CONFIG,
      useValue: {
        breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
      },
    },

    // Accelerate Config
    provideAccelerateCoreConfig({
      name: 'accelerate',
    }),
    provideAccelerateAuthConfig({
      frontend: {
        disableAuth: true,
      },
    }),
    provideAccelerateBootstrapConfig({
      table: {
        minWidth: 700,
      },
      user: {
        settings: {
          format: 'accordion',
          standardSettings: {
            theme: {
              options: [
                'default',
                'brite',
                'cerulean',
                'cosmo',
                'cyborg',
                'darkly',
                'flatly',
                'journal',
                'litera',
                'lumen',
                'lux',
                'materia',
                'minty',
                'morph',
                'pulse',
                'quartz',
                'sandstone',
                'simplex',
                'sketchy',
                'slate',
                'solar',
                'spacelab',
                'superhero',
                'united',
                'vapor',
                'yeti',
                'zephyr',
              ],
            },
          },
          customSettings: {
            downloadfileType: {
              key: 'downloadfileType',
              label: 'Download File Type',
              icon: 'file-arrow-down',
              enabled: true,
              optionList: ['Excel', 'CSV', 'PDF'],
              callback: (value: string) => {
                alert('Download File Type: ' + value);
              },
            },
          },
        },
      },
    }),
  ],
};
