import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeContainerComponent } from './shape-container.component';

describe('AuxDivComponent', () => {
  let component: ShapeContainerComponent;
  let fixture: ComponentFixture<ShapeContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShapeContainerComponent],
    });
    fixture = TestBed.createComponent(ShapeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
