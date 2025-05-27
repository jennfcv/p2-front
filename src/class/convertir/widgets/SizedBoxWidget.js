export class SizedBoxWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    let width = 50;
  let height = 50;

  if (this.node.size && typeof this.node.size === "string") {
    const parts = this.node.size.split(" ");
    if (parts.length === 2) {
      const w = Number(parts[0]);
      const h = Number(parts[1]);
      if (!isNaN(w)) width = w;
      if (!isNaN(h)) height = h;
    }
  }

  return `SizedBox(
  width: ${width},
  height: ${height},
),`;
  }
}
