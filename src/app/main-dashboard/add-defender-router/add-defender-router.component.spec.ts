import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefenderRouterComponent } from './add-defender-router.component';

describe('AddDefenderRouterComponent', () => {
  let component: AddDefenderRouterComponent;
  let fixture: ComponentFixture<AddDefenderRouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDefenderRouterComponent]
    });
    fixture = TestBed.createComponent(AddDefenderRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
