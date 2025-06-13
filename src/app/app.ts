import { AfterViewInit, Component, computed, effect, inject } from '@angular/core';
import { CountryPicker } from "./components/country-picker/country-picker";
import { mapService } from './services/map';
import { EventService } from './store/event';
import { StoreService } from './store/store';
import { LayerPicker } from './components/layer-picker/layer-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [CountryPicker, LayerPicker]
})
export class App implements AfterViewInit { 
  private mapService = inject(mapService)
  private _eventService = inject(EventService)
  private _store = inject(StoreService)

  appResourceAndDataLoaded = computed(() => {
     const checkUserGeoLocation = this._store.store().coordinates
     const checkDetectedOrDefaultCountry = this._store.store().selectedCountry

     return checkUserGeoLocation && checkDetectedOrDefaultCountry
  })

  locationDependencyInitialized = computed(() => this._eventService.events().locationRequestComplete === 'COMPLETE')

  constructor() {
    effect(() => {
      if(this.locationDependencyInitialized()) {   
        this.mapService.initializeMap()

        console.log('Location services completed | Map successfully initialized')
      }
    })
  }

  ngAfterViewInit(): void {
     this.mapService.initializeUsageDependencies()
  }
}
