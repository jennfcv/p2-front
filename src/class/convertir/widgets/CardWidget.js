import { WidgetFactory } from '../widgets.js';
export class CardWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
    const childNode = this.node.children?.[0];
    const child = childNode
      ? WidgetFactory.generate(childNode)
      : `Text('contenido default')`;

    return `Card(
      elevation: ${this.node.elevation || 1},
      margin: EdgeInsets.all(${this.node.margin || 12}),
  child: ${child}
),`;
    }
}