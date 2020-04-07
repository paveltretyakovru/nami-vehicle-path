export class Component {
  constructor({ el, data, state, template, changed }) {
    this.el = el;
    this.data = data || {};
    this.state = state || {};
    this.template = template || '';
    this.changed = changed;

    this.render(this.template);
  }

  get(path, obj, fb = `$\{${path}}`) {
    return path.split('.').reduce((res, key) => {
      if (res[key] === 0) {
        res[key] = "0"
      }

      return res[key] || fb;
    }, obj);
  }
  
  templater(template, map, fallback) {
    return template.replace(/\$\{.+?}/g, (match) => {
      const path = match.substr(2, match.length - 3).trim();
      return this.get(path, map, fallback);
    });
  }

  setState(state) {
    this.state = { ...state };
    this.render(this.template);
  }

  render(template) {
    const getAttributesContext = () => {
      const result = {};

      for (var attribute of this.el.attributes) {
        result[attribute.name] = attribute.value;
      }

      return result;
    }

    let rendered = this.templater(template, this.data);
    rendered = this.templater(rendered, getAttributesContext());
    rendered = this.templater(rendered, this.state || {});
    this.onAfterRendered(rendered)
  }

  onAfterRendered(template) {
    try {
      if (!this.el) {
        throw new Error('this.el must exists!');
      }

      this.el.innerHTML = template;

      this.onAfterAppended();
    } catch (error) {
      console.error('Component#appendView()', error);
    }
  }

  onAfterAppended() {}
}