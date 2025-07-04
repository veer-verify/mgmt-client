import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeviceComponent } from './new-device.component';

describe('NewDeviceComponent', () => {
  let component: NewDeviceComponent;
  let fixture: ComponentFixture<NewDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDeviceComponent]
    });
    fixture = TestBed.createComponent(NewDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
