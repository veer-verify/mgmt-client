import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefenderCamComponent } from './add-defender-cam.component';

describe('AddDefenderCamComponent', () => {
  let component: AddDefenderCamComponent;
  let fixture: ComponentFixture<AddDefenderCamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDefenderCamComponent]
    });
    fixture = TestBed.createComponent(AddDefenderCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
