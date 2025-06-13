import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    events = signal<any>({
        locationRequestComplete: null
    });
}