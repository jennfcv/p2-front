export class FloatingButtonWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        return `FloatingActionButton(
  onPressed: () {
    // TODO: Implement onPressed
  },
  child: Icon(Icons.add),
)`;
    }
}