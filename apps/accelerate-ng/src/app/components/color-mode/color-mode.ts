import { Component } from '@angular/core';

// internal imports
import { ColorMode as ColorModeComponent } from '@rn-accelerate-ng/bootstrap';

@Component({
  selector: 'app-color-mode',
  imports: [ColorModeComponent],
  templateUrl: './color-mode.html',
  styleUrl: './color-mode.scss',
})
export class ColorMode {}
