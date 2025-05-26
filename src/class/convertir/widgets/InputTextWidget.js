import { WidgetFactory } from '../widgets.js';

export class InputTextWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        return `TextField(
  decoration: InputDecoration(
    hintText: '${this.node.text ?? ''}',
  ),
),`;
    }
}