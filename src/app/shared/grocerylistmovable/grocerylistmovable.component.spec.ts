import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrocerylistmovableComponent } from './grocerylistmovable.component';

describe('GrocerylistmovableComponent', () => {
  let component: GrocerylistmovableComponent;
  let fixture: ComponentFixture<GrocerylistmovableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrocerylistmovableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrocerylistmovableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
