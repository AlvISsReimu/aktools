import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LvlupComponent } from './lvlup.component';

describe('LvlupComponent', () => {
  let component: LvlupComponent;
  let fixture: ComponentFixture<LvlupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LvlupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LvlupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
