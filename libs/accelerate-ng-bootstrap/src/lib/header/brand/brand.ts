// external imports
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// internal imports
import {
  ConfigOptions,
  ConfigurableComponent,
} from '../../bootstrap.component';

@Component({
  selector: 'ang-brand',
  imports: [CommonModule],
  templateUrl: './brand.html',
  styleUrl: './brand.scss',
})
export class Brand extends ConfigurableComponent<BrandOptions> {
  override configKey = 'brand';
}

export interface BrandOptions extends ConfigOptions {
  class?: string;
  href?: string;
  text?: string;
  logo?: {
    src: string;
    alt?: string;
    height: number;
    width: number;
    class?: string;
  };
}
