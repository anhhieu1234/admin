import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhComponent } from './kh.component';

describe('KhComponent', () => {
  let component: KhComponent;
  let fixture: ComponentFixture<KhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
