import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToHomescreenComponent } from './add-to-homescreen.component';

describe('AddToHomescreenComponent', () => {
  let component: AddToHomescreenComponent;
  let fixture: ComponentFixture<AddToHomescreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToHomescreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToHomescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
