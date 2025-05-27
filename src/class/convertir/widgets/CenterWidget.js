import { WidgetFactory } from '../widgets.js';

export class CenterWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const child = this.node.children?.[0];
    return `Center(
  child: ${WidgetFactory.generate(child)}
),`;
  }
}
