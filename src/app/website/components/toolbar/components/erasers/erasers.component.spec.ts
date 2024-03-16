import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErasersComponent } from './erasers.component';

describe('ErasersComponent', () => {
  let component: ErasersComponent;
  let fixture: ComponentFixture<ErasersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErasersComponent]
    });
    fixture = TestBed.createComponent(ErasersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
