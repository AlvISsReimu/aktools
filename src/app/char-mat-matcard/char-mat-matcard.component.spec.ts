import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharMatMatcardComponent } from './char-mat-matcard.component';

describe('CharMatMatcardComponent', () => {
  let component: CharMatMatcardComponent;
  let fixture: ComponentFixture<CharMatMatcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharMatMatcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharMatMatcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
