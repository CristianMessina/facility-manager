import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureListComponent } from './structure-list.component';

describe('StructureListComponent', () => {
  let component: StructureListComponent;
  let fixture: ComponentFixture<StructureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
