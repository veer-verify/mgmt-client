import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSensorDeviceComponent } from './create-sensor-device.component';

describe('CreateSensorDeviceComponent', () => {
  let component: CreateSensorDeviceComponent;
  let fixture: ComponentFixture<CreateSensorDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSensorDeviceComponent]
    });
    fixture = TestBed.createComponent(CreateSensorDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
