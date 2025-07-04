import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenderComponent } from './defender.component';

describe('DefenderComponent', () => {
  let component: DefenderComponent;
  let fixture: ComponentFixture<DefenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefenderComponent]
    });
    fixture = TestBed.createComponent(DefenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
