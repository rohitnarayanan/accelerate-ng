import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorMode } from './color-mode';

describe('ColorMode', () => {
  let component: ColorMode;
  let fixture: ComponentFixture<ColorMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorMode],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
