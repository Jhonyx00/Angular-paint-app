import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiguresComponent } from './figures.component';

describe('FiguresComponent', () => {
  let component: FiguresComponent;
  let fixture: ComponentFixture<FiguresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiguresComponent]
    });
    fixture = TestBed.createComponent(FiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
