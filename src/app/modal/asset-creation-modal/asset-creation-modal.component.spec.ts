import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCreationModalComponent } from './asset-creation-modal.component';

describe('AssetCreationModalComponent', () => {
  let component: AssetCreationModalComponent;
  let fixture: ComponentFixture<AssetCreationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCreationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
