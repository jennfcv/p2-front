import { WidgetFactory } from '../widgets.js';

export class ExpandedWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        const child = this.node.children?.[0];
        return `Expanded(
  child: ${WidgetFactory.generate(child)},
)`;
    }
}