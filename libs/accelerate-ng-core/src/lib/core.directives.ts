import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import * as $ from 'jquery';

@Directive({
  selector: '[angHtmlAttributes]',
  standalone: true,
})
export class HtmlAttributesDirective implements OnInit {
  host: ElementRef = inject(ElementRef);
  @Input() angHtmlAttributes!: Record<string, string>;

  ngOnInit(): void {
    $.each(this.angHtmlAttributes, (key, value) => {
      this.host.nativeElement.setAttribute(key, value);
    });
  }
}
