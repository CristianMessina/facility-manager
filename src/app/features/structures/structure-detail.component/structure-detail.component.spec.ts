import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureDetailComponent } from './structure-detail.component';

describe('StructureDetailComponent', () => {
  let component: StructureDetailComponent;
  let fixture: ComponentFixture<StructureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
