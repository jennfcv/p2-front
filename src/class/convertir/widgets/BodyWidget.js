import { WidgetFactory } from '../widgets.js';

export class BodyWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const child = this.node.children?.[0];
    return WidgetFactory.generate(child);
  }
}
