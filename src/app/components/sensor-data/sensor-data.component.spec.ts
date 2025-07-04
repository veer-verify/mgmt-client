import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDataComponent } from './sensor-data.component';

describe('SensorDataComponent', () => {
  let component: SensorDataComponent;
  let fixture: ComponentFixture<SensorDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorDataComponent]
    });
    fixture = TestBed.createComponent(SensorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
