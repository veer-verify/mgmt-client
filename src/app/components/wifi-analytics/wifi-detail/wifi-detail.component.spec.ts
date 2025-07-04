import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiDetailComponent } from './wifi-detail.component';

describe('WifiDetailComponent', () => {
  let component: WifiDetailComponent;
  let fixture: ComponentFixture<WifiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WifiDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
