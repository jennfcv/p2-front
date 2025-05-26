import { WidgetFactory } from '../widgets.js';

export class RowWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const children = this.node.children?.map(child => WidgetFactory.generate(child)).join(',\n    ') ?? '';
    return `GridView.count(
  crossAxisCount: ${this.node.crossc || 4},
  padding: EdgeInsets.all(10),
  children: [
      ${children}
      ],
)`;
  }
}
