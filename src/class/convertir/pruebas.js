import { WidgetFactory } from './widgets.js';




function armarArbolConDatos(nodos, jerarquia) {
    const nodosPorKey = new Map(nodos.map(n => [n.key, n]));

    function construirNodoConHijos(nodoJerarquia) {
        const nodoBase = nodosPorKey.get(nodoJerarquia.id);
        let nodoReal;

        if (nodoBase) {
            // Si se encuentra en nodeDataArray, clonar sus propiedades
            nodoReal = {...nodoBase };
        } else {
            // Si no se encuentra (por ejemplo, el nodo raíz), construir manualmente con lo mínimo
            nodoReal = {
                key: nodoJerarquia.id,
                type: nodoJerarquia.tipo,
                children: []
            };
            // console.warn(`No se encontró nodo con key/id: ${nodoJerarquia.id}`);
        }

        // Si el nodo es tipo select con opciones, incluirlas como hijos
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


const data = ["{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [\n{\"key\":1,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"0.26036924342866996 -3.414502331154722\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":2,\"category\":\"rectangleTextNode\",\"loc\":\"153 -16.500386534542137\",\"text\":\"drawer test\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"field\":\"text\",\"opciones\":[],\"validation\":[]},\n{\"key\":3,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"11.5 47.999718883969365\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":4,\"category\":\"layout\",\"type\":\"center\",\"loc\":\"27 57.001335301145545\",\"color\":\"#8ebbda\",\"size\":\"309 509\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":5,\"category\":\"text\",\"loc\":\"123 241.50565746011665\",\"text\":\"1ra pantalla\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":6,\"category\":\"circle\",\"type\":\"circle\",\"loc\":\"274 538.5266625502918\",\"color\":\"powderblue\",\"size\":\"70 70\",\"label\":\"\",\"conection\":17},\n{\"key\":7,\"category\":\"custom\",\"type\":\"drawer\",\"loc\":\"-229.500025503698 2.0156722187082323\",\"color\":\"salmon\",\"size\":\"200 620\",\"label\":\"\"},\n{\"key\":8,\"category\":\"custom\",\"type\":\"drawerHeader\",\"loc\":\"-216.5 7.498770117365957\",\"color\":\"lightskyblue\",\"size\":\"180 115\",\"label\":\"\"},\n{\"key\":11,\"category\":\"custom\",\"type\":\"drawerItem\",\"loc\":\"-214.5 143.50277602080257\",\"color\":\"lightskyblue\",\"size\":\"180 25\",\"label\":\"\"},\n{\"key\":12,\"category\":\"custom\",\"type\":\"drawerItem\",\"loc\":\"-213 199.00407618244427\",\"color\":\"lightskyblue\",\"size\":\"180 25\",\"label\":\"\"},\n{\"key\":13,\"category\":\"custom\",\"type\":\"drawerItem\",\"loc\":\"-217.5 254.50537634408596\",\"color\":\"lightskyblue\",\"size\":\"180 25\",\"label\":\"\"},\n{\"key\":14,\"category\":\"text\",\"loc\":\"-189 117.00274088129873\",\"text\":\"inicio\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":-14,\"category\":\"text\",\"loc\":\"-188.21428571428572 169.5039707639328\",\"text\":\"setting\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":15,\"category\":\"text\",\"loc\":\"-176.78571428571428 226.50530606507834\",\"text\":\"info\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":-15,\"category\":\"layout\",\"type\":\"center\",\"loc\":\"-211.42857142857142 10.000234263358863\",\"color\":\"#8ebbda\",\"size\":\"174 112\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":16,\"category\":\"text\",\"loc\":\"-170.00000000000003 26.777366143590047\",\"text\":\"menu\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":17,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"657.2589819046981 3.283317646398473\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":18,\"category\":\"rectangleTextNode\",\"loc\":\"808.7461821950001 -4.886798357430278\",\"text\":\"secundario\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"field\":\"text\",\"opciones\":[],\"validation\":[]},\n{\"key\":19,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"669.7023238448639 45.33960492770916\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":20,\"category\":\"circle\",\"type\":\"circle\",\"loc\":\"929.0103338055849 543.2221945214324\",\"color\":\"powderblue\",\"size\":\"70 70\",\"label\":\"\",\"conection\":23},\n{\"key\":21,\"category\":\"layout\",\"type\":\"center\",\"loc\":\"679.0799884999155 50.584733491351685\",\"color\":\"#8ebbda\",\"size\":\"317 498\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":22,\"category\":\"text\",\"loc\":\"777.726337117991 244.2973495491059\",\"text\":\"2da pantalla\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":23,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"359.9123888095823 754.9581716075668\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":24,\"category\":\"rectangleTextNode\",\"loc\":\"511.1562625579895 754.3000735104365\",\"text\":\"texto\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"field\":\"text\",\"opciones\":[],\"validation\":[]},\n{\"key\":25,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"371.82971394554323 829.6158110436432\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":26,\"category\":\"layout\",\"type\":\"center\",\"loc\":\"392.46080084040386 865.3391706261862\",\"color\":\"#8ebbda\",\"size\":\"310 400\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":27,\"category\":\"layout\",\"type\":\"row\",\"loc\":\"400.11857256411906 1007.0097428083496\",\"color\":\"#f49d9d\",\"size\":\"297 96\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":28,\"category\":\"text\",\"loc\":\"390.5463579094753 1014.667611574953\",\"text\":\"izquierdo\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":29,\"category\":\"text\",\"loc\":\"555.188449969352 1018.4965459582544\",\"text\":\"derecho\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":30,\"category\":\"circle\",\"type\":\"circle\",\"loc\":\"630.3984787023529 1283.652130032067\",\"color\":\"powderblue\",\"size\":\"70 70\",\"label\":\"\",\"conection\":1}\n],\n  \"linkDataArray\": [\n{\"from\":6,\"to\":17},\n{\"from\":20,\"to\":23},\n{\"from\":30,\"to\":1}\n]}", { "id": 0, "tipo": "root", "children": [{ "id": 1, "tipo": "scaffold", "children": [{ "id": 2, "tipo": "appbar", "children": [] }, { "id": 3, "tipo": "body", "children": [{ "id": 4, "tipo": "center", "children": [{ "id": 5, "tipo": "texto", "children": [] }] }] }, { "id": 6, "tipo": "circle", "children": [] }, { "id": 7, "tipo": "drawer", "children": [{ "id": 8, "tipo": "drawerHeader", "children": [{ "id": -15, "tipo": "center", "children": [{ "id": 16, "tipo": "texto", "children": [] }] }] }, { "id": 11, "tipo": "itemDrawer", "children": [{ "id": 14, "tipo": "texto", "children": [] }] }, { "id": 12, "tipo": "itemDrawer", "children": [{ "id": -14, "tipo": "texto", "children": [] }] }, { "id": 13, "tipo": "itemDrawer", "children": [{ "id": 15, "tipo": "texto", "children": [] }] }] }] }, { "id": 17, "tipo": "scaffold", "children": [{ "id": 18, "tipo": "appbar", "children": [] }, { "id": 19, "tipo": "body", "children": [{ "id": 21, "tipo": "center", "children": [{ "id": 22, "tipo": "texto", "children": [] }] }] }, { "id": 20, "tipo": "circle", "children": [] }] }, { "id": 23, "tipo": "scaffold", "children": [{ "id": 24, "tipo": "appbar", "children": [] }, { "id": 25, "tipo": "body", "children": [{ "id": 26, "tipo": "center", "children": [{ "id": 27, "tipo": "row", "children": [{ "id": 28, "tipo": "texto", "children": [] }, { "id": 29, "tipo": "texto", "children": [] }] }] }] }, { "id": 30, "tipo": "circle", "children": [] }] }] }]

const nombre = 'exampleNuevo';

const rawDiagramString = data[0];
const raw = JSON.parse(rawDiagramString);
const treeStructure = data[1];
const nodosOrdenados = armarArbolConDatos(raw.nodeDataArray, treeStructure);

// console.log(JSON.stringify(treeStructure, null, 2));
// console.log(JSON.stringify(nodosOrdenados, null, 2));
console.log(nodosOrdenados);
console.log('--------------------------');


const code = WidgetFactory.generateAll(nodosOrdenados);
console.log(code);


function generarScaffoldWidgets(arbol) {
    let widget = `//import 'package:flutter/material.dart';\n\n`;

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



console.log('------------widget------------');

const flutterCode = generarScaffoldWidgets(nodosOrdenados);
console.log(flutterCode);




// console.log(flutterCode);