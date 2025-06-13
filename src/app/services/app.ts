import { inject, Injectable } from "@angular/core";
import { StoreService } from "../store/store";
import { DEFAULT_MAP_COORDINATES } from "../util/constants";
import { EventService } from "../store/event";

@Injectable({
    providedIn: 'root'
})

export class appService {
    private _store = inject(StoreService)
    private _eventService = inject(EventService)

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => this.handleGeolocationSuccess(position),
                () => this.handleGeolocationError()
            );
        }
    }

    handleGeolocationSuccess(position: GeolocationPosition) {
        const { latitude, longitude } = position.coords;
        this._store.updateCoordinates([latitude, longitude])

        this.dispatchLocationEvent()

    }

    handleGeolocationError() {
        this._store.updateCoordinates(DEFAULT_MAP_COORDINATES)
        this.dispatchLocationEvent()
    }

    dispatchLocationEvent() {
        this._eventService.events.update(update => {
            return {
                ...update,
                locationRequestComplete: 'COMPLETE'
            }
        })
    }
}