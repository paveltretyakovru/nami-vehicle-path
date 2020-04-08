import * as $ from 'jquery';
import * as L from 'leaflet-hotline';
import { Layers } from './layers';

import { Dots } from './dots/dots';

import coordinates from './coordinates.json';
import {
  HOTLINE_LAYER_NAME, DOTS_LAYER_NAME, PATH_MIN_COLOR, PATH_MAX_COLOR,
  PATH_MAX_COLOR_INPUT_SELECTOR, PATH_MIN_COLOR_INPUT_SELECTOR, PATH_MEAN_COLOR_INPUT_SELECTOR, PATH_MEAN_COLOR, SELECTOR_DISPLAY_DOTS_CHECKBOX
} from '../constants';

// Initialize some constants
const longCoordinates = coordinates.long.map((coordinant) => {
  // Generate Z - coordinate
  coordinant.push(Math.random());

  // Generate heading parameter
  coordinant.push(Math.floor(Math.random() * 360));

  return {
    lat: coordinant[0],
    lng: coordinant[1],
    z: coordinant[2],
    heading: coordinant[3],
  }
}).filter(() => Math.random() > 0.8);

const tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

/**
 * Клас отвечающий за карту
 *
 * @export
 * @class Map
 */
export class Map {
  constructor({ $map }) {
    try {
      const { app } = window.global;
      const { rootScope } = app;
      this.configurationValues = rootScope.configurationValues;

      if (!$map) throw new Error('$map is not defined');
      this.$map = $map;

      const center = { lat: 56.34911535641025, lng: 37.3122657989881 }
      const map =  L
        .map(this.$map, { scrollWheelZoom: false, dragging: false, tap: false })
          .setView([center.lat, center.lng], 18);
      
      this.map = map;
      this.layers = new Layers({ map });

      this.layers.add({ name: 'tile', layer: L.tileLayer(tileServer) });

      this.initDots();
    } catch (error) {
      console.error('Map#initMap()', { error });
    }
  }

  // ==================================DOTS CONFIG =============================
  initDots() {
    try {
      this.dots = new  Dots({ coordinates: longCoordinates, map: this.map });
      const dotsLayers = this.dots.getDotLayers();

      this.layers.add({ name: DOTS_LAYER_NAME, layer: L.layerGroup(dotsLayers) });

      window.global.dot = this.dots.collection[0];
      window.global.dots = this.dots;
    } catch (error) {
      console.error('Map#drawDots', { error });
    }
  }

  switchDots(to = true) {
    if (to) {
      this.showDots();
      $(SELECTOR_DISPLAY_DOTS_CHECKBOX).prop('checked', true);
    } else {
      this.hideDots();
      $(SELECTOR_DISPLAY_DOTS_CHECKBOX).prop('checked', false);
    }
  }

  showDots() {
    try {
      const layer = this.layers.get(DOTS_LAYER_NAME);

      if (layer && layer.show) {
        layer.show(this.map);
      }
    } catch (error) {
      console.error('Map#hideDots()', { error });
    }
  }

  hideDots() {
    try {
      const layer = this.layers.get(DOTS_LAYER_NAME);
      
      if (layer && layer.hide) {
        layer.hide();
      }
    } catch (error) {
      console.error('Map#hideDots()', { error });
    }
  }

  updateDotsStyles(style) {
    this.dots.updateDotsStyles(style);
  }

  changeDotsRadius(value) {
    this.dots.changeDotsRadius(value);
    window.global.app.rootScope.configurationValues.dotRadius = value;
    window.global.app.updateConfigDisplay();
  }

  changeDotsOpacity(value) {
    this.dots.changeDotsOpacity(value);
    window.global.app.updateConfigDisplay();
  }

  changedDotFillOpacity(value) {
    this.dots.changeDotsFillOpacity(value);
    window.global.app.updateConfigDisplay();
  }

  changeDotsBgColor(color) {
    this.dots.changeDotsBgColor(color);
    window.global.app.updateConfigDisplay();
  }

  changeDotsStrokeColor(color) {
    this.dots.changeDotsStrokeColor(color);
    window.global.app.updateConfigDisplay();
  }

  changeDotsStrokeWeight(weight) {
    this.dots.changeDotsStrokeWeight(weight);
    window.global.app.rootScope.configurationValues.strokeWeight = weight;
    window.global.app.updateConfigDisplay();
  }
  // ================================== END DOTS CONFIG ========================

  // ================================== HOTLINE CONFIG =========================
  drawHotline() {
    try {
      if (!this.map) throw new Error('"map" property is not inicialized');
      if (!coordinates || !coordinates.long) throw new Error('no coordinates');

      let hotlineLayer = this.layers.get(HOTLINE_LAYER_NAME);
      if (!hotlineLayer) {
        hotlineLayer = this.layers.add({
          name: HOTLINE_LAYER_NAME,
          layer: L.hotline(longCoordinates.map(c => [ c.lat, c.lng, c.z ]), {
            palette: {
              0.0: PATH_MIN_COLOR,
              0.5: PATH_MEAN_COLOR,
              1.0: PATH_MAX_COLOR,
            }
          }),
        });
      }
    } catch (error) {
      console.error('Map#drawHotline()', { error });
    }
  }

  updateHotlinePalette() {
    const maxColor = document.getElementById(PATH_MAX_COLOR_INPUT_SELECTOR).value || PATH_MAX_COLOR;
    const minColor = document.getElementById(PATH_MIN_COLOR_INPUT_SELECTOR).value || PATH_MIN_COLOR;
    const normalColor = document.getElementById(PATH_MEAN_COLOR_INPUT_SELECTOR).value || PATH_MEAN_COLOR; 
    const hotlineLayer = this.layers.get(HOTLINE_LAYER_NAME);

    this.configurationValues.maxColor = maxColor;
    this.configurationValues.minColor =  minColor;
    this.configurationValues.normalColor =  normalColor;
    

    if (hotlineLayer) {
      hotlineLayer.layer.setStyle({
        'palette': {
            0.0: minColor,
            0.5: normalColor,
            1.0: maxColor,
				}
      }).redraw();
    }

    window.global.app.updateConfigDisplay(this.configurationValues);
  }
  
}