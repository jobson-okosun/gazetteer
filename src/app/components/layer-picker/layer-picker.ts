import { Component, inject } from '@angular/core';
import { mapService } from '../../services/map';

@Component({
  selector: 'layer-picker',
  imports: [],
  templateUrl: './layer-picker.html',
  styleUrl: './layer-picker.css'
})
export class LayerPicker {
  private _mapService = inject(mapService)

  switchLayer(layerName: 'street' | 'satellite' | 'outdoors' | 'dark' | 'default'): void {
    this._mapService.changeMapLayer(layerName);
  }
}
