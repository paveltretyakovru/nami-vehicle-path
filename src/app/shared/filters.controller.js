import * as $ from 'jquery';
import { DOTS_MIN_HEADING_FILTER_SLIDER_SELECTOR, DOTS_MAX_HEADING_FILTER_SLIDER_SELECTOR } from "./constants";
import { SliderComponent } from './slider/slider.component';

function sliderConstructor() {
  const self = this;

  this.el = document.querySelector(this.selector), 
  this.$el = $(this.selector);

  this.options = {
    el: self.el,
    value: 180,
    data: {
      min: 1,
      max: 360,
    },
  };
  
  return this;
}

const filtersList = [
  {
    name: 'heading-min',
    type: 'slider',
    selector: DOTS_MIN_HEADING_FILTER_SLIDER_SELECTOR,

    constructor() {
      sliderConstructor.call(this);
    },

    onChange(value) {
      console.log('onChange', value);
      window.global.dots.filterDotsByHeading(value);
    }
  },

  {
    name: 'heading-max',
    type: 'slider',
    selector: DOTS_MAX_HEADING_FILTER_SLIDER_SELECTOR,

    constructor() {
      sliderConstructor.call(this);
    },

    onChange(value) {
      console.log('onChange', value);
      window.global.dots.filterDotsByHeading(value, false);
    }
  },
];

export class FiltersController {
  constructor({ mapController }) {
    this.filters = [];
    this.mapController = mapController;

    this._initFilters();
  }

  _initFilters() {
    try {
      filtersList.forEach((filter) => {
        this.filters.push(filter.constructor(filter));
        this._filterFactory(filter);
      });
    } catch (error) {
      console.error('FiltersController#_initFilters()', error);
    }
  }

  _filterFactory(filter) {
    try {
      switch (filter.type) {
        case 'slider': {
          const { options, onChange } = filter;
          return new SliderComponent({ ...options, changed: onChange });
        }
      }
    } catch (error) {
      console.error('FiltersController#_filterFactory(filter)', error);
    }
  }
}