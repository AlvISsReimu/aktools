import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrTagsComponent } from './hr-tags.component';

describe('HrTagsComponent', () => {
  let component: HrTagsComponent;
  let fixture: ComponentFixture<HrTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
