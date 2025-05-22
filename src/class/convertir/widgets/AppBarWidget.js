export class AppBarWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        return `AppBar(
  title: Text('${this.node.text ?? ''}'),
)`;
    }
}