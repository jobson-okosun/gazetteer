import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryPicker } from './country-picker';

describe('CountryPicker', () => {
  let component: CountryPicker;
  let fixture: ComponentFixture<CountryPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
