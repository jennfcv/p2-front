import { WidgetFactory } from '../widgets.js';
export class DrawerHeaderWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        const child = this.node.children?.[0];
        return `DrawerHeader(
  child: ${WidgetFactory.generate(child)},
)`;
    }
}