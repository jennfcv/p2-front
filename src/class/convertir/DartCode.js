import { WidgetFactory } from './widgets.js';

export function generarScaffoldWidgets(arbol) {
    let widget = `import 'package:flutter/material.dart';\n\n`;

    if (!arbol || !Array.isArray(arbol.children)) {
        console.error('Formato de árbol inválido');
        return '';
    }

    for (const nodo of arbol.children) {
        if (nodo.type === 'scaffold') {
            const nombreClase = `Scaffold${nodo.key}`;
            const scaffoldCode = WidgetFactory.generate(nodo);

            const clase = `
class ${nombreClase} extends StatefulWidget {
  const ${nombreClase}({super.key});

  @override
  State<${nombreClase}> createState() => _${nombreClase}State();
}

class _${nombreClase}State extends State<${nombreClase}> {
  @override
  Widget build(BuildContext context) {
    return ${scaffoldCode};
  }
}
            `.trim();

            widget += '\n\n' + clase;
        }
    }

    return widget;
}


export function armarArbolConDatos(nodos, jerarquia) {
    const nodosPorKey = new Map(nodos.map(n => [n.key, n]));

    function construirNodoConHijos(nodoJerarquia) {
        const nodoBase = nodosPorKey.get(nodoJerarquia.id);
        let nodoReal;

        if (nodoBase) {
            nodoReal = {...nodoBase };
        } else {
            nodoReal = {
                key: nodoJerarquia.id,
                type: nodoJerarquia.tipo,
                children: []
            };
        }

        if (nodoReal.type === "select" && Array.isArray(nodoReal.opciones)) {
            nodoReal.children = nodoReal.opciones.map(opcion => ({
                key: opcion,
                type: "opcion",
                text: opcion
            }));
        }

        if (nodoJerarquia.children && nodoJerarquia.children.length > 0) {
            if (!nodoReal.children) nodoReal.children = [];

            nodoReal.children.push(
                ...nodoJerarquia.children.map(child => construirNodoConHijos(child))
            );
        }

        return nodoReal;
    }

    return construirNodoConHijos(jerarquia);
}