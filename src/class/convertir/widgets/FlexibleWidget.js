import { WidgetFactory } from '../widgets.js';
export class FlexibleWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        const child = this.node.children?.[0];
        return `Flexible(
child: ${WidgetFactory.generate(child)},
),`;
    }
}