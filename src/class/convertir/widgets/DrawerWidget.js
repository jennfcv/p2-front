import { WidgetFactory } from '../widgets.js';

export class DrawerWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const childrenCode = (this.node.children || [])
      .map(child => WidgetFactory.generate(child))
      .join(',\n      ');

    return `Drawer(
  child: ListView(
    padding: EdgeInsets.zero,
    children: <Widget>[
      ${childrenCode}
    ],
  ),
)`;
  }
}
