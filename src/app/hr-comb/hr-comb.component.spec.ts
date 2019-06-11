import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCombComponent } from './hr-comb.component';

describe('HrCombComponent', () => {
  let component: HrCombComponent;
  let fixture: ComponentFixture<HrCombComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrCombComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrCombComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
