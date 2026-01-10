import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Watermark } from './watermark';

describe('Watermark', () => {
  let component: Watermark;
  let fixture: ComponentFixture<Watermark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Watermark],
    }).compileComponents();

    fixture = TestBed.createComponent(Watermark);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
