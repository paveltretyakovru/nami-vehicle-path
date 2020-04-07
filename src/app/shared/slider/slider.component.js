import template from './slider.component.html';
import { Component } from '../component';

export class SliderComponent extends Component {
  /**
   * Creates an instance of SliderComponent.
   * @param {Object} options to construct slider component
   *  @param {Number} options.value value of slider
   * @memberof SliderComponent
   */
  constructor(options) {
    const state = { value: options.value };
    super({ ...options, template, state });
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

  handleChange(event) {
    const value = +event.target.value;
    this.setState({ ...this.state, value });

    this.changed(value);
  }
}