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

        // Si tiene hijos en la jerarquía, construirlos recursivamente
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


const data = ["{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [\n{\"key\":1,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"0 0\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":2,\"category\":\"rectangleTextNode\",\"loc\":\"156 -7.500175697519154\",\"text\":\"texto\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"opciones\":[],\"validation\":[]},\n{\"key\":3,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"14.5 43.499613465457884\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":4,\"category\":\"circle\",\"type\":\"circle\",\"loc\":\"271 542.5110689437065\",\"color\":\"powderblue\",\"size\":\"70 70\",\"label\":\"\"},\n{\"key\":5,\"category\":\"layout\",\"type\":\"container\",\"loc\":\"25.5 54.001265022137886\",\"color\":\"#a6e482\",\"size\":\"318 519\",\"label\":\"\",\"child\":null,\"margin\":5,\"padding\":10},\n{\"key\":6,\"category\":\"layout\",\"type\":\"column\",\"loc\":\"36 69.00161641717618\",\"color\":\"#ff9c00\",\"size\":\"296 495\",\"label\":\"\",\"child\":null,\"margin\":null,\"axis\":\"spaceEvenly\",\"cross\":\"center\"},\n{\"key\":7,\"category\":\"layout\",\"type\":\"padding\",\"loc\":\"48 78.00182725419917\",\"color\":\"#ead1dc\",\"size\":\"272 62\",\"label\":\"\",\"child\":null,\"margin\":null,\"padding\":15},\n{\"key\":8,\"category\":\"layout\",\"type\":\"padding\",\"loc\":\"57 157.50368964790215\",\"color\":\"#ead1dc\",\"size\":\"253 56\",\"label\":\"\",\"child\":null,\"margin\":null,\"padding\":15},\n{\"key\":9,\"category\":\"layout\",\"type\":\"padding\",\"loc\":\"58.5 225.0052709255745\",\"color\":\"#ead1dc\",\"size\":\"256 87\",\"label\":\"\",\"child\":null,\"margin\":null,\"padding\":15},\n{\"key\":10,\"category\":\"layout\",\"type\":\"padding\",\"loc\":\"57 334.50783610935406\",\"color\":\"#ead1dc\",\"size\":\"254 71\",\"label\":\"\",\"child\":null,\"margin\":null,\"padding\":15},\n{\"key\":11,\"category\":\"layout\",\"type\":\"center\",\"loc\":\"67.5 429.01004989809536\",\"color\":\"#8ebbda\",\"size\":\"244 113\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":12,\"category\":\"text\",\"loc\":\"120 447.01047157214134\",\"text\":\"texto centro\",\"fontSize\":10,\"type\":\"texto\"},\n{\"key\":13,\"category\":\"rectangleTextNode\",\"loc\":\"141 84.00196781221449\",\"text\":\"nombre\",\"color\":\"lightgreen\",\"size\":\"130 35\",\"type\":\"input\",\"field\":\"text\",\"opciones\":[],\"validation\":[]},\n{\"key\":14,\"category\":\"rectangleTextNode\",\"loc\":\"138 157.50368964790215\",\"text\":\"acepto los terminos\",\"color\":\"lightgreen\",\"size\":\"130 35\",\"type\":\"input\",\"field\":\"check\",\"opciones\":[],\"validation\":[]},\n{\"key\":15,\"category\":\"layout\",\"type\":\"row\",\"loc\":\"69 229.50537634408602\",\"color\":\"#f49d9d\",\"size\":\"245 77\",\"label\":\"\",\"child\":null,\"margin\":null,\"axis\":\"spaceEvenly\"},\n{\"key\":16,\"category\":\"rectangleTextNode\",\"loc\":\"148.5 243.00569259962046\",\"text\":\"sabe o no\",\"color\":\"lightgreen\",\"size\":\"130 35\",\"type\":\"input\",\"field\":\"radio\",\"opciones\":[\"si\",\"no\",\"no sabe\"],\"validation\":[]},\n{\"key\":17,\"category\":\"rectangleTextNode\",\"loc\":\"150 340.5079766673694\",\"text\":\"continente\",\"color\":\"lightgreen\",\"size\":\"130 35\",\"type\":\"input\",\"field\":\"select\",\"opciones\":[\"america\",\"europa\",\"africa\",\"asia\"],\"validation\":[]}\n],\n  \"linkDataArray\": []}", { "id": 0, "tipo": "root", "children": [{ "id": 1, "tipo": "scaffold", "children": [{ "id": 2, "tipo": "appbar", "children": [] }, { "id": 3, "tipo": "body", "children": [{ "id": 5, "tipo": "container", "children": [{ "id": 6, "tipo": "column", "children": [{ "id": 7, "tipo": "padding", "children": [{ "id": 13, "tipo": "input", "children": [] }] }, { "id": 8, "tipo": "padding", "children": [{ "id": 14, "tipo": "input", "children": [] }] }, { "id": 9, "tipo": "padding", "children": [{ "id": 15, "tipo": "row", "children": [{ "id": 16, "tipo": "input", "children": [] }] }] }, { "id": 10, "tipo": "padding", "children": [{ "id": 17, "tipo": "input", "children": [] }] }, { "id": 11, "tipo": "center", "children": [{ "id": 12, "tipo": "texto", "children": [] }] }] }] }] }, { "id": 4, "tipo": "circle", "children": [] }] }] }]

const nombre = 'exampleNuevo';

const rawDiagramString = data[0];
const raw = JSON.parse(rawDiagramString);
const treeStructure = data[1];
const nodosOrdenados = armarArbolConDatos(raw.nodeDataArray, treeStructure);

console.log(JSON.stringify(treeStructure, null, 2));
console.log('--------------------------');
console.log(JSON.stringify(raw, null, 2));


const flutterCode = WidgetFactory.generateAll(nodosOrdenados);
console.log(flutterCode);