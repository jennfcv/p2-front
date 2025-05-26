import { WidgetFactory } from '../widgets.js';
export class ContainerWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        const child = this.node.children?.[0];
                return `Container(
          child: ${WidgetFactory.generate(child)},
        )`;
    }
}