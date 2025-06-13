import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerPicker } from './layer-picker';

describe('LayerPicker', () => {
  let component: LayerPicker;
  let fixture: ComponentFixture<LayerPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
