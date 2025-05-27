import { WidgetFactory } from '../widgets.js';
export class PaddingWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        const child = this.node.children?.[0];
        return `Padding(
  padding: EdgeInsets.all(8.0),
  child: ${WidgetFactory.generate(child)}
),`;
    }
}