import { Layer } from './layer';

export class Layers {
  constructor({ map }) {
    try {
      if (!map) throw new Error('map is not defined');

      this.map = map;
      this.layers = [];
    } catch (error) {
      console.error('Layer#constructor()', { error });
    }
  }

  get(layerName = '') {
    return this.layers.find(l => l.name === layerName);
  }

  add({ layer, name }) {
    try {
      const search = this.get(name);

      if (search) {
        return search;
      } else {
        const layerController = new Layer({ name, layer });

        this.layers.push(layerController);
        layerController.layer.addTo(this.map);
      }
    } catch (error) {
      console.error('Layers#add()', { error });
    }
  }
}