export class Layer {
  constructor({ name, layer }) {
    try {
      if (!name) throw new Error('name is not defined');
      if (!layer) throw new Error('layer is not defined');

      this.name = name;
      this.layer = layer;
    } catch (error) {
      console.error('Layer#constructor()', { error });
    }
  }

  show(map) {
    this.layer.addTo(map);
  }

  hide() {
    this.layer.remove();
  }
}