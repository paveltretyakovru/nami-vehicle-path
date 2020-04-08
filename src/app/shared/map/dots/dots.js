import { Dot} from './dot';
import { DEFAULT_DOT_COLOR, DEFAULT_DOT_STROKE_COLOR } from '../../constants';

export class Dots {
  constructor({ coordinates, map }) {
    try {
      this.map = map;
      this.collection = [];
      coordinates.forEach((coord) => {
        this.collection.push(new Dot({
          ...coord,
          map,
        }));
      });
    } catch (error) {
      console.error('Dots#constructor()', { error });
    }
  }

  updateDotsStyles(styleConfig) {
    this.collection.forEach(dot => dot.updateStyle({
      ...styleConfig,
      weight: styleConfig.strokeWeight,
      opacity: styleConfig.strokeOpacity,
      radius: styleConfig.dotRadius,
    }));
  }

  filterDotsByHeading(heading, less = true) {
    this.collection.forEach((dot) => {
      if (
        ((less && dot.heading > heading))
        || (!less && (dot.heading < heading))
      ) {
        dot.show();
      }  else {
        dot.hide();
      }
    });
  }

  getDotLayers() {
    return this.collection.map(dot => dot.layer);
  }

  changeDotsRadius(radius) {
    this.collection.forEach(dot => dot.radius = radius);
  }

  changeDotsOpacity(opacity) {
    this.collection.forEach(dot => dot.opacity = opacity);
  }

  changeDotsFillOpacity(opacity) {
    this.collection.forEach(dot => dot.fillOpacity = opacity);
  }

  changeDotsBgColor(color = DEFAULT_DOT_COLOR) {
    this.collection.forEach(dot => dot.fillColor = color);
  }

  changeDotsStrokeColor(color = DEFAULT_DOT_STROKE_COLOR) {
    this.collection.forEach(dot => dot.strokeColor = color);
  }

  changeDotsStrokeWeight(value) {
    this.collection.forEach(dot => dot.weight = value);
  }
}