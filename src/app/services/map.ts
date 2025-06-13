import { inject, Injectable, signal } from '@angular/core'
import * as L from 'leaflet';
import { environment } from '../../environments/environment.development';
import { DataService } from './data';
import { appService } from './app';
import { StoreService } from '../store/store';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class mapService {
    private _dataService = inject(DataService)
    private _appService = inject(appService)
    private _store = inject(StoreService)

    private config = environment
    private map: L.Map;
    private selectedLocationBorder: any
    private geoLocationBorders: any = {}
    private currentLocationCountryCode = signal('')
    private currentLocationBorder = signal(null)
    private zoomLevel = signal(7)
    private activeTileLayer: L.TileLayer;


    private defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    // --- Helper for creating other map layers ---
    private createMapboxLayer(style: string): L.TileLayer {
        return L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/{z}/{x}/{y}?access_token=${this.config.mapBoxToken}`, {
            attribution: 'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            tileSize: 512,
            zoomOffset: -1
        });
    }

    private streetMap = this.createMapboxLayer('streets-v11');
    private satelliteMap = this.createMapboxLayer('satellite-v9');
    private outdoorsMap = this.createMapboxLayer('outdoors-v11');
    private darkMap = this.createMapboxLayer('dark-v10');

    constructor() {
        this.setInitialZoomLevel();
    }

    private setInitialZoomLevel(): void {
        if (window.matchMedia('(max-width: 800px)').matches) {
            this.zoomLevel.set(5);
        } else if (window.matchMedia('(max-width: 1400px)').matches) {
            this.zoomLevel.set(6);
        }
    }


    initializeUsageDependencies() {
        this._appService.getUserLocation()
        this._dataService.getCountries()
    }

    async initializeMap(): Promise<void> {
        if (this.map) {
            return;
        }

        this.map = L.map('map', {
            center: [54.0, -2.0],
            zoom: this.zoomLevel(),
            layers: [this.defaultMap],
            zoomControl: false
        });

        // Set the initial active layer
        this.activeTileLayer = this.defaultMap;

        await this.loadLocationResource();
    }

    changeMapLayer(layerName: 'street' | 'satellite' | 'outdoors' | 'dark' | 'default'): void {
        if (!this.map) {
            return;
        }
        
        if (this.activeTileLayer) {
            this.map.removeLayer(this.activeTileLayer);
        }

        let newLayer: L.TileLayer;
        
        // Select the new layer
        switch (layerName) {
            case 'street':
                newLayer = this.streetMap;
                break;
            case 'satellite':
                newLayer = this.satelliteMap;
                break;
            case 'outdoors':
                newLayer = this.outdoorsMap;
                break;
            case 'dark':
                newLayer = this.darkMap;
                break;
            default:
                newLayer = this.defaultMap;
                break;
        }

        this.activeTileLayer = newLayer;
        this.activeTileLayer.addTo(this.map);
    }

    async loadLocationResource() {
        this._store.updateLoadingLocationAssetsStatus(true);
        const coordinates = this._store.store().coordinates;

        if (!coordinates) {
            this._store.updateLoadingLocationAssetsStatus(false);
            return;
        }

        try {
            const borders = await firstValueFrom(this._dataService.getLocationBoundary(coordinates!));
            this.currentLocationBorder.set(borders);
            const countryCode = borders.features[0]?.properties.country_code;

            if (countryCode) {
                this.currentLocationCountryCode.set(countryCode);
                await this.getSelectedCountry();
            } else {
                this._store.updateLoadingLocationAssetsStatus(false);
            }

        } catch (error) {
            this._store.updateLoadingLocationAssetsStatus(false);
        }
    }

    async getSelectedCountry() {
        try {
            await this._dataService.getCountry(this.currentLocationCountryCode());
            
            this.mountMap(this.currentLocationBorder());
        } catch (error) {
            this._store.updateLoadingLocationAssetsStatus(false);
        }
    }

    mountMap(borders: any) {
        if (!(borders?.features?.length > 0)) {
            this._store.updateLoadingLocationAssetsStatus(false);
            return;
        }

        if (this.selectedLocationBorder) {
            this.map.removeLayer(this.selectedLocationBorder);
        }

        this.selectedLocationBorder = L.geoJson(borders, {
            onEachFeature: (feature, layer) => {
                this.geoLocationBorders[feature.properties.country_code] = layer;
            },
            style: {
                color: "#ff7800",
                weight: 1,
                opacity: 0.65
            }
        });

        this.selectedLocationBorder.addTo(this.map);
        this.map.fitBounds(this.selectedLocationBorder.getBounds());
        this._store.updateLoadingLocationAssetsStatus(false);
    }
}