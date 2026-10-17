import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingAnimationComponent } from './floating-animation.component';

describe('FloatingAnimationComponent', () => {
  let component: FloatingAnimationComponent;
  let fixture: ComponentFixture<FloatingAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
