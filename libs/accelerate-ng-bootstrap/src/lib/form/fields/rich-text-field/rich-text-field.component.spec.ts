import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichTextFieldComponent } from './rich-text-field.component';

describe('RichTextFieldComponent', () => {
  let component: RichTextFieldComponent;
  let fixture: ComponentFixture<RichTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
