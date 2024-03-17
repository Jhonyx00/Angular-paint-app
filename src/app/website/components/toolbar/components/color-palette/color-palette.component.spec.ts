import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorComponent } from './color-palette.component';

describe('ColorComponent', () => {
  let component: ColorComponent;
  let fixture: ComponentFixture<ColorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorComponent],
    });
    fixture = TestBed.createComponent(ColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
