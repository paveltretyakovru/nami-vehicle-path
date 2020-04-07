import * as $ from 'jquery';
import { DOTS_HEADING_FILTER_SLIDER_SELECTOR } from "./constants";
import { SliderComponent } from './slider/slider.component';

const filtersList = [
  {
    name: 'heading-start',
    type: 'slider',
    selector: DOTS_HEADING_FILTER_SLIDER_SELECTOR,

    constructor() {
      const self = this;

      this.el = document.querySelector(this.selector), 
      this.$el = $(this.selector);

      this.options = {
        el: self.el,
        value: 2,
        data: {
          min: 1,
          max: 360,
        },
      };
      
      return this;
    }
  }
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
          return new SliderComponent({ 
            ...filter.options,

            changed: (value) => {
              console.log('Slider changed', value, this);
            },
          });
        }
      }
    } catch (error) {
      console.error('FiltersController#_filterFactory(filter)', error);
    }
  }
}