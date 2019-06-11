import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharMatComponent } from './char-mat.component';

describe('CharMatComponent', () => {
  let component: CharMatComponent;
  let fixture: ComponentFixture<CharMatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharMatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
