import { WidgetFactory } from '../widgets.js';

export class RowWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const children = this.node.children?.map(child => WidgetFactory.generate(child)).join(',\n    ') ?? '';
    return `Row(
  children: [
    ${children}
  ],
)`;
  }
}
