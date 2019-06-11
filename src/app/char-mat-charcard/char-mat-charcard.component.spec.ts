import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharMatCharcardComponent } from './char-mat-charcard.component';

describe('CharMatCharcardComponent', () => {
  let component: CharMatCharcardComponent;
  let fixture: ComponentFixture<CharMatCharcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharMatCharcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharMatCharcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
