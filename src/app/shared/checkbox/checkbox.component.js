import { Component } from '../component';

import template from './checkbox.component.html';

export class CheckboxComponent extends Component {
  constructor(options) {
    const state = { enabled: true }
    super({ ...options, template, state });
  }

  onAfterAppended() {

  }
}