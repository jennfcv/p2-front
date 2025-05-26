import { WidgetFactory } from '../widgets.js';

export class InputRadioWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        const options = (this.node.opciones || []).map((o, i) => {
            return `RadioListTile(
  title: Text('${o}'),
  value: '${o}',
  groupValue: null,
  onChanged: (value) {},
),`;
        }).join('\n');
        return options;

    }
}