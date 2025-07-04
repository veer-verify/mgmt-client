import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSecondDeviceComponent } from './add-second-device.component';

describe('AddSecondDeviceComponent', () => {
  let component: AddSecondDeviceComponent;
  let fixture: ComponentFixture<AddSecondDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSecondDeviceComponent]
    });
    fixture = TestBed.createComponent(AddSecondDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
