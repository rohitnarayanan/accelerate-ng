import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTypeaheadFieldComponent } from './multi-typeahead-field.component';

describe('TypeaheadFieldComponent', () => {
  let component: MultiTypeaheadFieldComponent;
  let fixture: ComponentFixture<MultiTypeaheadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiTypeaheadFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiTypeaheadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
