import * as $ from 'jquery';
import  '../../../node_modules/spectrum-colorpicker2/src/spectrum';
import { DEFAULT_DOT_COLOR, DEFAULT_DOT_STROKE_COLOR, PATH_MAX_COLOR_INPUT_SELECTOR, PATH_MIN_COLOR_INPUT_SELECTOR, PATH_MAX_COLOR, PATH_MIN_COLOR, PATH_MEAN_COLOR, PATH_MEAN_COLOR_INPUT_SELECTOR } from './constants';

import { SliderComponent } from './slider/slider.component';

export class FormController {
  constructor({
    changeDisplayDots, changeDotColor, changeDotStrokeColor,
    changedDotOpacity, dotRadiusChanged, changeDotStrokeWeight,
    changedDotFillOpacity, pathMaxColorChanged, pathMinColorChanged,
    pathMeanColorChanged, mapController,
  }) {
    const { app } = window.global;
    this.rootScope = app.rootScope;
    this.configurationValues = this.rootScope.configurationValues;

    this.sliders = [];
    this.spectrums = [];
    this.mapController = mapController;

    // Инициализация фукнций событий
    // DOTS config events
    this.onChangeDotColor = changeDotColor;
    this.onChangeDotRadius = dotRadiusChanged;
    this.onChangeDotOpacity = changedDotOpacity;
    this.onChangeDisplayDots = changeDisplayDots;
    this.onChangeDotFillOpacity = changedDotFillOpacity;
    this.onChangeDotStrokeColor = changeDotStrokeColor;
    this.onChangeDotStrokeWeight = changeDotStrokeWeight;

    // PATH config events
    this.onChangePathMaxColor = pathMaxColorChanged;
    this.onChangePathMinColor = pathMinColorChanged;
    this.onChangePathMeanColor = pathMeanColorChanged;

    // Инициализация селекторов
    this._initSelectors();
  }

  _initSelectors() {
    try {
      // Dot settings
      this.$dotColorPicker = document.getElementById('dot-color-picker');
      this.$dotRadiusSlider = document.getElementById('dot-radius-slider');
      this.$dotOpacitySlider = document.getElementById('dot-opacity-slider');
      this.$displayDotsInput = document.getElementById('display-dots-input');
      this.$dotStrokeColorPicker = document.getElementById('dot-stroke-color-picker');
      this.$dotStrokeWeightSlider = document.getElementById('dot-weight-slider');
      this.$dotFillOpacitySlider = document.getElementById('dot-fill-opacity-slider');

      // Path settings
      this.$pathMaxColor = document.getElementById(PATH_MAX_COLOR_INPUT_SELECTOR);
      this.$pathMinColor = document.getElementById(PATH_MIN_COLOR_INPUT_SELECTOR);
      this.$pathMeanColor = document.getElementById(PATH_MEAN_COLOR_INPUT_SELECTOR);

      this._initEventListeners();
    } catch (error) {
      console.error({ error });
    }
  }

  _initEventListeners() {
    try {
      // Dots settings
      this._initDisplayDotsEventsListeners();
      this._initDotsColorEventsListeners();
      this._initDotsStrokeColorEventsListeners();
      this._initDotRadiusSlider();
      this._initChangeDotStrokeWeight();
      this._initDotOpacitySlider();
      this._initDotFillOpacitySlider();

      // Path settings
      this._initPathMaxColor();
      this._initPathMinColor();
      this._initPathMeanColor();
      
    } catch (error) {
      console.error('FormController#_initEventListeners()', { error });
    }
  }

  switchColorPickers(configs = {}) {
    this.spectrums.forEach((spectrum) => {
      if (configs[spectrum.name]) {
        $(spectrum.selector).spectrum('set', configs[spectrum.name]);
      }
    });
  }

  switchSliders(configs = {}) {
    this.sliders.forEach((slider) => {
      if (configs[slider.name]) {
        slider.changeValue(configs[slider.name]);
      }
    });
  }

  // ====================== PATH CONFIG INITIALIZERS ===========================
  _initPathMaxColor() {
    const { configurationValues, $pathMaxColor } = this;

    this.spectrums.push({
      name: 'maxColor',
      selector: $pathMaxColor,
      constructor: $($pathMaxColor).spectrum({
        type: "color",
        color: configurationValues.maxColor,
        preferredFormat: 'hex',
  
        change: color => this.onChangePathMaxColor(color.toHexString())
      }),
    });
  }

  _initPathMinColor() {
    const { configurationValues, $pathMinColor } = this;

    this.spectrums.push({
      name: 'minColor',
      selector: $pathMinColor,
      constructor: $(this.$pathMinColor).spectrum({
        type: "color",
        color: configurationValues.minColor,
        preferredFormat: 'hex',
  
        change: color => this.onChangePathMinColor(color.toHexString())
      }),
    });
  }

  _initPathMeanColor() {
    const { configurationValues, $pathMeanColor } = this;

    this.spectrums.push({
      name: 'normalColor',
      selector: $pathMeanColor,
      constructor: $($pathMeanColor).spectrum({
        type: "color",
        color: configurationValues.normalColor,
        preferredFormat: 'hex',
  
        change: color => this.onChangePathMeanColor(color.toHexString())
      }),
    });
  }

  // ====================== DOT INITALIZERS ====================================
  _initDotRadiusSlider() {
    const { configurationValues } = this;

    this.sliders.push(new SliderComponent({
      el: this.$dotRadiusSlider,
      name: 'dotRadius',
      data: {},
      value: configurationValues.dotRadius,
      changed: this.onChangeDotRadius.bind(this.mapController),
    }));
  }

  _initChangeDotStrokeWeight() {
    const { configurationValues } = this;

    try {
      this.sliders.push(new SliderComponent({
        el: this.$dotStrokeWeightSlider,
        name: 'strokeWeight',
        value: configurationValues.strokeWeight,
        changed: this.onChangeDotStrokeWeight.bind(this.mapController)
      }));
    } catch (error) {
      console.error('FormController#_initDisplayDotsStroke()', error);
    }
  }

  _initDotFillOpacitySlider() {
    const { configurationValues } = this;

    this.sliders.push(new SliderComponent({
      el: this.$dotFillOpacitySlider,
      data: {},
      name: 'fillOpacity',
      value: configurationValues.fillOpacity,

      changed: (value) => {
        this.onChangeDotFillOpacity(value)
      }
    }));
  }

  _initDotOpacitySlider() {
    const { configurationValues } = this;
    
    this.sliders.push(new SliderComponent({
      el: this.$dotOpacitySlider,
      data: {},
      name: 'strokeOpacity',
      value: configurationValues.strokeOpacity,

      changed: (value) => {
        this.onChangeDotOpacity(value)
      }
    }));
  }

  _initDotsStrokeColorEventsListeners() {
    const { configurationValues } = this;

    $(this.$dotStrokeColorPicker).spectrum({
      type: "color",
      color:  configurationValues.strokeColor,
      preferredFormat: 'hex',

      change: color => this.onChangeDotStrokeColor(color.toHexString())
    });
  }

  _initDotsColorEventsListeners() {
    const { configurationValues } = this;

    $(this.$dotColorPicker).spectrum({
      type: "color",
      color:  configurationValues.fillColor,
      preferredFormat: 'hex',

      change: color => this.onChangeDotColor(color.toHexString())
    });
  }
  
  // Событие изменения чекбокса для отображения точек маршрута
  _initDisplayDotsEventsListeners() {
    this.$displayDotsInput.addEventListener('change', () => {
      if (this.onChangeDisplayDots) {
        this.onChangeDisplayDots(this.$displayDotsInput.checked);
      }
    })
  }
}