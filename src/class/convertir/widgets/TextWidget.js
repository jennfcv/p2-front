export class TextWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    return `Text('${this.node.text ?? ''}')`;
  }
}
