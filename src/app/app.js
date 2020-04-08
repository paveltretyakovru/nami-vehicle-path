import * as $ from 'jquery';
import * as ClipboardJS  from 'clipboard';
import prettyPrintJson from'pretty-print-json';

// Modules
import { Map } from './shared/map/map'; 
import { FormController } from './shared/form.controller';

// Assets
import './app.scss';
import bag_image_src from '../assets/images/bag.png';
import { FiltersController } from './shared/filters.controller';
import {
  PATH_MAX_COLOR, DEFAULT_DOT_STROKE_COLOR, DEFAULT_DOT_COLOR, PATH_MEAN_COLOR,
  DEAFULT_DOT_DISPLAY, PATH_MIN_COLOR, DEFAULT_STROKE_WEIGHT, DEFAULT_DOT_RADIUS,
  DEFAULT_STROKE_OPACITY, DEFAULT_FILL_OPACITY, DEFAULT_MIN_HEADING,
  DEFAULT_MAX_HEADING, CLIPBOARD_BUTTON_SELECTOR, SELECTOR_CONFIG_DISPLAY, SELECTOR_BUTTON_APPLY, SELECTOR_TEXTAREA_APPLY
} from './shared/constants';

/**
 * Весь этот хаос был написан за ночь, ради интереса на нативном JS
 * Советую не пытаться понять логику. Мозг сломается. 
 */

export class App {
  constructor() {
    try {
      console.clear();

      // Initialize global vars
      window.global = {};
      window.global.app = this;

      this.rootScope = {
        configurationValues: {
          displayDots: DEAFULT_DOT_DISPLAY,
          fillColor: DEFAULT_DOT_COLOR,
          strokeColor: DEFAULT_DOT_STROKE_COLOR,
          fillOpacity: DEFAULT_FILL_OPACITY,
          strokeOpacity: DEFAULT_STROKE_OPACITY,
          dotRadius: DEFAULT_DOT_RADIUS,
          strokeWeight: DEFAULT_STROKE_WEIGHT,
          maxColor: PATH_MAX_COLOR,
          normalColor: PATH_MEAN_COLOR,
          minColor: PATH_MIN_COLOR,
          minHeading: DEFAULT_MIN_HEADING,
          maxHeading: DEFAULT_MAX_HEADING,
        },
      };

      this.configurationValues = this.rootScope.configurationValues;

      // Preapre Map Controller
      const $map = document.getElementsByClassName('app__map')[0];
      this.mapController = new Map({ $map });
      this.filtersControler = new FiltersController({
        mapController: this.mapController,
      });

      this.mapController.drawHotline();
      const { mapController } = this;

      // Prepare Form Controller
      this.formController = new FormController({
        mapController,

        changeDisplayDots: (enabled = true) => {
          try {
            if (enabled) {
              this.mapController.showDots();
              this.configurationValues.displayDots = true;
            } else {
              this.mapController.hideDots();
              this.configurationValues.displayDots = false;
            }

            this.updateConfigDisplay();
          } catch (error) {
            console.error('changeDispalyDotsHander', error);
          }
        },

        changeDotColor: (color = '#0000') => {
          this.mapController.changeDotsBgColor(color);
          this.configurationValues.fillColor = color;
          this.updateConfigDisplay();
        },

        changeDotStrokeColor: (color) => {
          this.mapController.changeDotsStrokeColor(color);
          this.configurationValues.strokeColor = color;
          this.updateConfigDisplay();
        },

        changedDotOpacity: (value) => {
          let calc = +value;

          if (calc === 100) {
            calc = 1;
          } else if (calc === 1) {
            calc = 0;
          } else if (calc > 1 && calc > 50) {
            calc = Number(`0.${calc}`);
          } else if (calc > 1 && calc < 50) {
            calc = Number(`0.0${calc}`);
          }

          this.mapController.changeDotsOpacity(calc);
          this.configurationValues.strokeOpacity = calc;
          this.updateConfigDisplay();
        },

        changedDotFillOpacity: (value) => {
          let calc = +value;

          if (calc === 100) {
            calc = 1;
          } else if (calc === 1) {
            calc = 0;
          } else {
            calc /= 100;
          }

          this.mapController.changedDotFillOpacity(calc);
          this.configurationValues.fillOpacity = calc;
          this.updateConfigDisplay();
        },

        dotRadiusChanged: mapController.changeDotsRadius.bind(mapController),
        changeDotStrokeWeight: mapController.changeDotsStrokeWeight.bind(mapController),

        pathMaxColorChanged: mapController.updateHotlinePalette.bind(mapController),
        pathMinColorChanged: mapController.updateHotlinePalette.bind(mapController),
        pathMeanColorChanged: mapController.updateHotlinePalette.bind(mapController),
      });

      this.updateConfigDisplay();
      this.initClipboardButton();
      this.initApplyConfigButton();
    } catch (error) {
      console.error('App#constructor()', error.message, { error });
    }
  }

  initClipboardButton() {
    new ClipboardJS(CLIPBOARD_BUTTON_SELECTOR);
  }

  initApplyConfigButton() {
    const $applyConfigTextarea = $(SELECTOR_TEXTAREA_APPLY);
    const $applyConfigButton = $(SELECTOR_BUTTON_APPLY);

    $applyConfigButton.click(() => {
      const config = Function(`return ${$applyConfigTextarea.val()}`)();
      console.log('Click :)', config);

      Object.assign(window.global.app.rootScope.configurationValues, config);

      this.mapController.updateDotsStyles(config);
      this.mapController.switchDots(config.displayDots);

      this.formController.switchSliders(config);
      this.formController.switchColorPickers(config);
    });
  }

  updateConfigDisplay(config) {    
    const $display = $(SELECTOR_CONFIG_DISPLAY);

    if ($display) {
      $display.html(
        prettyPrintJson.toHtml(config ? config : this.configurationValues)
      );
    }
  }

  showLogo() {
    const $bag_image = new Image();
    const $bag_image_wrapper = document.getElementsByClassName('logo')[0];

    $bag_image.src = bag_image_src;
    $bag_image_wrapper.appendChild($bag_image);
  }
}
