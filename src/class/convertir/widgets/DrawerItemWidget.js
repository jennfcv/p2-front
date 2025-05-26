import { WidgetFactory } from '../widgets.js';

export class DrawerItemWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const childWidgets = (this.node.children || [])
      .map(child => WidgetFactory.generate(child))
      .join(',\n    ');

    const content = childWidgets || `Text('${this.node.text ?? ''}')`;

    return `ListTile(
  title: ${content},    
  onTap: () {
    // TODO: Handle tap
  },
)`;
  }
}
