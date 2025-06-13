import { AfterViewInit, Component, computed, ElementRef, inject, linkedSignal, viewChild } from '@angular/core';
import { StoreService } from '../../store/store';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { mapService } from '../../services/map';

@Component({
  selector: 'country-picker',
  imports: [CdkDrag],
  templateUrl: './country-picker.html',
  styleUrl: './country-picker.css',
})
export class CountryPicker implements AfterViewInit {
  private _storeService = inject(StoreService)
  private _mapService = inject(mapService)

  selectElement = viewChild<ElementRef>('country')
  countries = computed(() => this._storeService.store().countries)
  selectedCountry = linkedSignal(() => this._storeService.store().selectedCountry)
  isLoading = computed(() => this._storeService.store().loadingLocationAssetsStatus)

  ngAfterViewInit() {
    this.selectElement()!.nativeElement.value = this.selectedCountry()?.name.common
  }

  onCountryChange() {
    const selectedCountry = this.countries()!.find((country:any) => country.name.common ===  this.selectElement()!.nativeElement.value)

    this._storeService.updateSelectedCountry(selectedCountry)
    this._storeService.updateCoordinates(selectedCountry.capitalInfo.latlng)
    this._mapService.loadLocationResource()
  }
}
