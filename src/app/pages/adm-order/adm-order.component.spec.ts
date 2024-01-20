import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmOrderComponent } from './adm-order.component';

describe('AdmOrderComponent', () => {
  let component: AdmOrderComponent;
  let fixture: ComponentFixture<AdmOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
