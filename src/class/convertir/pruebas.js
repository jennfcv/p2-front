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


const data = ["{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [\n{\"key\":1,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"-513.8393912830823 -2.357102778649846\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":2,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"-504.06387332383497 43.05130859161308\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":3,\"category\":\"rectangleTextNode\",\"loc\":\"-360.6303984693192 -14.142616671899013\",\"text\":\"inicio\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"opciones\":[],\"validation\":[]},\n{\"key\":4,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"646.5082773679673 -42.65233599461609\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":5,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"656.5082773679673 10.61308463781296\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":6,\"category\":\"rectangleTextNode\",\"loc\":\"799.1560650798484 -49.38691536218705\",\"text\":\"pantallaB\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"opciones\":[],\"validation\":[]},\n{\"key\":7,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"-493.86055509532576 702.6761899507763\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":8,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"-480.70609572025893 748.2200532846514\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"},\n{\"key\":9,\"category\":\"rectangleTextNode\",\"loc\":\"-344.1051044677333 694.3285152960535\",\"text\":\"pantallaC\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"opciones\":[],\"validation\":[]},\n{\"key\":10,\"category\":\"layout\",\"type\":\"scaffold\",\"loc\":\"42.75862244865313 18.357200940516066\",\"color\":\"aquamarine\",\"size\":\"360 620\",\"label\":\"\",\"child\":null,\"margin\":null},\n{\"key\":11,\"category\":\"rectangleTextNode\",\"loc\":\"193.43186345819322 14.253078026605209\",\"text\":\"pantallaA\",\"color\":\"lightgreen\",\"size\":\"360 30\",\"type\":\"appbar\",\"opciones\":[],\"validation\":[]},\n{\"key\":12,\"category\":\"custom\",\"type\":\"body\",\"loc\":\"56.83087220566776 70.18077001900372\",\"color\":\"lightskyblue\",\"size\":\"340 540\",\"label\":\"\"}\n],\n  \"linkDataArray\": []}", { "id": 0, "tipo": "root", "children": [{ "id": 1, "tipo": "scaffold", "children": [{ "id": 2, "tipo": "body", "children": [] }, { "id": 3, "tipo": "appbar", "children": [] }] }, { "id": 4, "tipo": "scaffold", "children": [{ "id": 5, "tipo": "body", "children": [] }, { "id": 6, "tipo": "appbar", "children": [] }] }, { "id": 7, "tipo": "scaffold", "children": [{ "id": 8, "tipo": "body", "children": [] }, { "id": 9, "tipo": "appbar", "children": [] }] }, { "id": 10, "tipo": "scaffold", "children": [{ "id": 11, "tipo": "appbar", "children": [] }, { "id": 12, "tipo": "body", "children": [] }] }] }]

const nombre = 'exampleNuevo';

const rawDiagramString = data[0];
const raw = JSON.parse(rawDiagramString);
const treeStructure = data[1];
const nodosOrdenados = armarArbolConDatos(raw.nodeDataArray, treeStructure);

// console.log(JSON.stringify(nodosOrdenados, null, 2));

const flutterCode = WidgetFactory.generateAll(nodosOrdenados);
console.log(flutterCode);