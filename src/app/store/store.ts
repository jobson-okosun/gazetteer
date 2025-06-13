import { Injectable, signal } from "@angular/core";
import { Store } from "../model/store";

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private _store = signal<Store>({
        countries: null,
        selectedCountry: null,
        coordinates: null,
        loadingLocationAssetsStatus: false
    })

    readonly store = this._store.asReadonly()

    updateCountries(countries: any[] | null) {
        this._store.update(store => {
            return {
                ...store,
                countries
            }
        })
    }

    updateCoordinates(coordinates: number[] | null) {
        this._store.update(store => {
            return {
                ...store,
                coordinates
            }
        })
    }

    updateSelectedCountry(selectedCountry: any | null) {
        this._store.update(store => {
            return {
                ...store,
                selectedCountry
            }
        })
    }

    updateLoadingLocationAssetsStatus(status: boolean) {
        this._store.update(store => {
            return {
                ...store,
                loadingLocationAssetsStatus: status
            }
        })
    }
}
