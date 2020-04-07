// Modules
import { Map } from './shared/map/map'; 
import { FormController } from './shared/form.controller';

// Assets
import './app.scss';
import bag_image_src from '../assets/images/bag.png';
import { FiltersController } from './shared/filters.controller';

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
            } else {
              this.mapController.hideDots();
            }
          } catch (error) {
            console.error('changeDispalyDotsHander', error);
          }
        },

        changeDotColor: (color = '#0000') => {
          this.mapController.changeDotsBgColor(color);
        },

        changeDotStrokeColor: (color) => {
          this.mapController.changeDotsStrokeColor(color);
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
        },

        changedDotFillOpacity: (value) => {
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

          this.mapController.changedDotFillOpacity(calc);
        },

        dotRadiusChanged: mapController.changeDotsRadius,
        changeDotStrokeWeight: mapController.changeDotsStrokeWeight,

        pathMaxColorChanged: mapController.updateHotlinePalette,
        pathMinColorChanged: mapController.updateHotlinePalette,
        pathMeanColorChanged: mapController.updateHotlinePalette,
      });

    } catch (error) {
      console.error('App#constructor()', error.message, { error });
    }
  }

  showLogo() {
    const $bag_image = new Image();
    const $bag_image_wrapper = document.getElementsByClassName('logo')[0];

    $bag_image.src = bag_image_src;
    $bag_image_wrapper.appendChild($bag_image);
  }
}
