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
    this.layer.setStyle({ fillColor: color });
    return color;
  }

  set strokeColor(color = DEFAULT_DOT_STROKE_COLOR) {
    this.layer.setStyle({ color });
    return color;
  }

  updateStyle({
    weight, opacity, fillOpacity, fillColor, strokeColor, radius
  }) {
    this.layer.setStyle({
      weight,
      fillColor,
      strokeColor,

      opacity: (opacity > 1) ? opacity / 100 : opacity,
      fillOpacity: (fillOpacity > 1) ? fillOpacity / 100 : fillOpacity,
    });

    this.layer.setRadius(radius);
  }

  constructor(options) {
    try {
      const { lat, lng, z, heading, map } = options;

      this.z = z;
      this.lat = lat;
      this.lng = lng;
      this.map = map;
      this.layer = this._createLeafletLayer();
      this.heading = heading;
      this.fillColor = DEFAULT_DOT_COLOR;
      this.strokeColor = DEFAULT_DOT_STROKE_COLOR;

      this._createPopup();
    } catch (error) {
      console.error('Dot#constructor()', { error });
    }
  }

  hide() {
    this.layer.remove();
  }

  show() {
    this.layer.addTo(this.map);
  }

  _createPopup() {
    try {
      if (!this.layer) throw new Error('this.layer is not defined'); 
      this.layer.bindPopup(`
        <div class="dot__popup">
          Heading: ${this.heading}
        </div>
      `);

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
      const config = window.global.app.rootScope.configurationValues;

      return L.circle(
        [ this.lat, this.lng ],
        {
          color: config.strokeColor,
          radius: config.dotRadius,
          weight: config.strokeWeight,
          opacity: config.strokeOpacity / 100,
          fillColor: config.fillColor,
          fillOpacity: config.fillOpacity / 100,
          // stroke: false,
        });
    } catch (error) {
      console.error('Dot#createLeafletLayer()', { error });
    }
  }

  
}