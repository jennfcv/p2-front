export class SizedBoxWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    return `SizedBox(
  width: ${this.node.width ?? 0},
  height: ${this.node.height ?? 0},
)`;
  }
}
