import * as L from 'leaflet-hotline';
import { DEFAULT_DOT_COLOR, DEFAULT_DOT_STROKE_COLOR } from '../../constants';

export class Dot {
  set radius(radius) {
    this.layer.setRadius(radius);
    return radius;
  }

  set weight(weight) {
    this.layer.setStyle({ weight });
    return weight;
  }

  set opacity(opacity) {
    this.layer.setStyle({ opacity });
    return opacity;
  }

  set fillOpacity(fillOpacity) {
    this.layer.setStyle({ fillOpacity });
    return fillOpacity;
  }

  set fillColor(color = DEFAULT_DOT_COLOR) {
    this.layer.setStyle({ fillColor: color, radius: 30 });
    return color;
  }


  set strokeColor(color = DEFAULT_DOT_STROKE_COLOR) {
    this.layer.setStyle({ color });
    return color;
  }

  constructor(options) {
    try {
      const { lat, lng, z } = options;

      this.z = z;
      this.lat = lat;
      this.lng = lng;
      this.layer = this._createLeafletLayer();
      this.strokeColor = DEFAULT_DOT_STROKE_COLOR;
      this.fillColor = DEFAULT_DOT_COLOR;

      this._createPopup();
    } catch (error) {
      console.error('Dot#constructor()', { error });
    }
  }

  _createPopup() {
    try {
      if (!this.layer) throw new Error('this.layer is not defined'); 
      this.layer.bindPopup("<b>Hello world!</b><br>I am a popup.");

      this.layer.on('mouseover', function (e) {
        this.openPopup();
      });
      this.layer.on('mouseout', function (e) {
          this.closePopup();
      });
    } catch (error) {
      console.error('Dot#_createPopup()', { error });
    }
  }

  _createLeafletLayer() {
    try {
      return L.circle(
        [ this.lat, this.lng ],
        {
          fillColor: this.fillColor,
          color: this.strokeColor,
          radius: 1.5,
          weight: 1,
          opacity: 28,
          fillOpacity: 1,
          // stroke: false,
        });
    } catch (error) {
      console.error('Dot#createLeafletLayer()', { error });
    }
  }

  
}