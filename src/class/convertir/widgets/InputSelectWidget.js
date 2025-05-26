import { WidgetFactory } from '../widgets.js';

export class InputSelectWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const items = (this.node.opciones || []).map(o => `'${o}'`).join(', ');
    return `DropdownButton<String>(
  value: null,
  hint: Text('${this.node.text ?? ''}'),
  onChanged: (String? newValue) {},
  items: [${items}].map<DropdownMenuItem<String>>((String value) {
    return DropdownMenuItem<String>(
      value: value,
      child: Text(value),
    );
  }).toList(),
),`;
  }
}
