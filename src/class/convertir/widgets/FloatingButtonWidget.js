export class FloatingButtonWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        if (this.node.conection != null) {
            const destino = `Scaffold${this.node.conection}`;
            return `FloatingActionButton(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => ${destino}()),
    );
  },
  child: Icon(Icons.add),
),`;
        } else {
            return `FloatingActionButton(
  onPressed: () {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Botón presionado'),
        duration: Duration(seconds: 2), 
      ),
    );
  },
  child: Icon(Icons.add),
),`;
        }
    }
}