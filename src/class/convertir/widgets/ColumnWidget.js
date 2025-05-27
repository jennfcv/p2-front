import { WidgetFactory } from '../widgets.js';

export class ColumnWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const children = this.node.children?.map(child => WidgetFactory.generate(child)).join('\n    ') ?? '';
    return `Column(
          mainAxisAlignment: MainAxisAlignment.${this.node.axis || 'spaceEvenly'},
     crossAxisAlignment: CrossAxisAlignment.${this.node.cross || 'center'},
  children: [
    ${children}
  ],
),`;
  }
}
