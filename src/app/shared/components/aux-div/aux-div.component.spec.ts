import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxDivComponent } from './aux-div.component';

describe('AuxDivComponent', () => {
  let component: AuxDivComponent;
  let fixture: ComponentFixture<AuxDivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuxDivComponent]
    });
    fixture = TestBed.createComponent(AuxDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
