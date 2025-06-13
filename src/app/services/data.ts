import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { StoreService } from "../store/store";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _http = inject(HttpClient);
    private _store = inject(StoreService)
    private _config = environment

    async getCountries(): Promise<void> {
        try {
            const request = await firstValueFrom(this._http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags,independent,status,capitalInfo'));
            const sortedCountries = request
            .filter((item: any) => item.independent === true && item.status === 'officially-assigned')
            .sort((a: any, b: any) => a.name.common.localeCompare(b.name.common))

            this._store.updateCountries(sortedCountries);
        } catch (error) {
            this._store.updateCountries(null);
        }
    }

    async getCountry(countryCode: string): Promise<any> {
        try {
            const request = await firstValueFrom(this._http.get<any>(`https://restcountries.com/v3.1/alpha/${countryCode}`))
            this._store.updateSelectedCountry(request[0]);
        } catch (error) {
            this._store.updateCountries(null);
        }
    }

    getLocationBoundary(coordinates: number[]):Observable<any> {
        const [lat, lon] = coordinates

        return this._http.get(`https://api.geoapify.com/v1/boundaries/part-of?lon=${lon}&lat=${lat}&geometry=geometry_1000&apiKey=${this._config.geoApiKey}`)
    }

    getCountryCode(coordinates: number[]): Observable<any> {
        const [lat, lon] = coordinates;
        const reverseGeocodeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${this._config.geoApiKey}`;
        return this._http.get(reverseGeocodeUrl);
    }

    getAllCountryBorders(): Observable<any> {
        const allCountriesUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        return this._http.get(allCountriesUrl);
    }
}