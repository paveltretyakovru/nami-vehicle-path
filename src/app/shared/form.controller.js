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

  // ====================== PATH CONFIG INITIALIZERS ===========================
  _initPathMaxColor() {
    $(this.$pathMaxColor).spectrum({
      type: "color",
      color: PATH_MAX_COLOR,
      preferredFormat: 'hex',

      change: color => this.onChangePathMaxColor(color.toHexString())
    });
  }

  _initPathMinColor() {
    $(this.$pathMinColor).spectrum({
      type: "color",
      color: PATH_MIN_COLOR,
      preferredFormat: 'hex',

      change: color => this.onChangePathMinColor(color.toHexString())
    });
  }

  _initPathMeanColor() {
    $(this.$pathMeanColor).spectrum({
      type: "color",
      color: PATH_MEAN_COLOR,
      preferredFormat: 'hex',

      change: color => this.onChangePathMeanColor(color.toHexString())
    });
  }

  // ====================== DOT INITALIZERS ====================================
  _initDotRadiusSlider() {
    new SliderComponent({
      el: this.$dotRadiusSlider,
      data: {},
      value: 2,
      changed: this.onChangeDotRadius.bind(this.mapController),
    });
  }

  _initChangeDotStrokeWeight() {
    try {
      new SliderComponent({
        el: this.$dotStrokeWeightSlider,
        value: 2,
        changed: this.onChangeDotStrokeWeight.bind(this.mapController)
      });
    } catch (error) {
      console.error('FormController#_initDisplayDotsStroke()', error);
    }
  }

  _initDotFillOpacitySlider() {
    new SliderComponent({
      el: this.$dotFillOpacitySlider,
      data: {},
      value: 28,

      changed: (value) => {
        this.onChangeDotFillOpacity(value)
      }
    });
  }

  _initDotOpacitySlider() {
    new SliderComponent({
      el: this.$dotOpacitySlider,
      data: {},
      value: 28,

      changed: (value) => {
        this.onChangeDotOpacity(value)
      }
    });
  }

  _initDotsStrokeColorEventsListeners() {
    $(this.$dotStrokeColorPicker).spectrum({
      type: "color",
      color:  DEFAULT_DOT_STROKE_COLOR,
      preferredFormat: 'hex',

      change: color => this.onChangeDotStrokeColor(color.toHexString())
    });
  }

  _initDotsColorEventsListeners() {
    $(this.$dotColorPicker).spectrum({
      type: "color",
      color:  DEFAULT_DOT_COLOR,
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