import template from './slider.component.html';
import { Component } from '../component';

export class SliderComponent extends Component {
  /**
   * Creates an instance of SliderComponent.
   * @param {Object} options to construct slider component
   *  @param {Object} options.el component element
   *  @param {Number} options.value value of slider
   * @memberof SliderComponent
   */
  constructor(options) {
    const state = { value: options.value };
    super({ ...options, template, state });

    this.name = options && options.name || '';
  }

  onAfterAppended() {
    try {
      const $input = this.el.querySelector('input');
      if (!$input) throw new Error('input not founded!');

      $input.addEventListener('change', this.handleChange.bind(this));
    } catch (error) {
      console.error('SliderComponent#onAfterAppended()', error);
    }
  }

  changeValue(value) {
    let result = value;
    if (result < 1) {
      result *= 100;
    }

    const $rangeInput = this.el.querySelector('input[type=range]');
    if ($rangeInput) {
      $rangeInput.value = result;
      this.setState({ ...this.state, value: result });
    }
  }

  handleChange(event) {
    const value = +event.target.value;
    this.setState({ ...this.state, value });

    this.changed(value);
  }
}