import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilsComponent } from './pencils.component';

describe('PencilsComponent', () => {
  let component: PencilsComponent;
  let fixture: ComponentFixture<PencilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PencilsComponent]
    });
    fixture = TestBed.createComponent(PencilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
