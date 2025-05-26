import { WidgetFactory } from '../widgets.js';

export class InputCheckWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        return `CheckboxListTile(
  title: Text('${this.node.text ?? ''}'),
  value: false,
  onChanged: (bool? value) {},
),`;
    }
}