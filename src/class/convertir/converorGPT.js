const TYPE_CONFIG = {
    scaffold: {
        category: "layout",
        color: "aquamarine",
        size: "360 620",
        loc: "0 0",
        extra: { label: "", child: null, margin: null },
    },
    appbar: {
        category: "rectangleTextNode",
        color: "lightgreen",
        size: "360 30",
        loc: "148 -10",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    body: {
        category: "custom",
        color: "lightskyblue",
        size: "340 540",
        loc: "13 40",
        extra: { label: "" },
    },
    circle: {
        category: "circle",
        color: "powderblue",
        size: "70 70",
        loc: "270 538",
        extra: { label: "" },
    },
    container: {
        category: "layout",
        color: "lightgreen",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    column: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    texto: {
        category: "text",
        color: "lightgreen",
        size: "360 30",
        loc: "148 -10",
        extra: { text: "texto default", fontSize: 10, opciones: [], validation: [] },
    },
    card: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    row: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    center: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    padding: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    center: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    sizedBox: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    flexible: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    expanded: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },
    listview: {
        category: "layout",
        color: "aquamarine",
        size: "360 30",
        loc: "0 0",
        extra: { text: "appbar", opciones: [], validation: [] },
    },

};

function convertTreeToGraphLinksModel(tree) {
    const nodeDataArray = [];

    function traverse(node) {
        const { id, tipo, pos = "0 0", size = "100 100", children = [], ...rest } = node;

        const config = TYPE_CONFIG[tipo] || {
            category: "default",
            color: "gray",
            extra: {},
        };

        const nodeData = {
            key: id,
            type: tipo,
            category: config.category,
            color: config.color,
            size,
            loc: pos,
            ...config.extra,
            ...rest, // para incluir propiedades como text u otras
        };

        nodeDataArray.push(nodeData);

        children.forEach(child => traverse(child));
    }

    traverse(tree);

    return {
        class: "GraphLinksModel",
        nodeDataArray,
        linkDataArray: [],
    };
}






const tree = {
    "id": 1,
    "tipo": "scaffold",
    "pos": "0 0",
    "size": "360 620",
    "children": [{
            "id": 2,
            "tipo": "appbar",
            "pos": "0 0",
            "size": "360 56",
            "children": []
        },
        {
            "id": 3,
            "tipo": "body",
            "pos": "0 56",
            "size": "360 508",
            "children": [{
                "id": 4,
                "tipo": "column",
                "pos": "0 0",
                "size": "360 508",
                "children": [{
                        "id": 5,
                        "tipo": "card",
                        "pos": "16 16",
                        "size": "328 80",
                        "children": [{
                            "id": 6,
                            "tipo": "center",
                            "pos": "0 0",
                            "size": "328 80",
                            "children": [{
                                "id": 7,
                                "tipo": "texto",
                                "pos": "0 0",
                                "size": "200 24",
                                "text": "Bienvenido a los comentarios"
                            }]
                        }]
                    },
                    {
                        "id": 8,
                        "tipo": "expanded",
                        "pos": "0 112",
                        "size": "360 396",
                        "children": [{
                            "id": 9,
                            "tipo": "listview",
                            "pos": "0 0",
                            "size": "360 396",
                            "children": [{
                                    "id": 10,
                                    "tipo": "padding",
                                    "pos": "0 0",
                                    "size": "360 70",
                                    "children": [{
                                        "id": 11,
                                        "tipo": "card",
                                        "pos": "16 0",
                                        "size": "328 70",
                                        "children": [{
                                            "id": 12,
                                            "tipo": "texto",
                                            "pos": "16 16",
                                            "size": "296 38",
                                            "text": "Comentario 1: ¡Buen trabajo!"
                                        }]
                                    }]
                                },
                                {
                                    "id": 13,
                                    "tipo": "padding",
                                    "pos": "0 80",
                                    "size": "360 70",
                                    "children": [{
                                        "id": 14,
                                        "tipo": "card",
                                        "pos": "16 0",
                                        "size": "328 70",
                                        "children": [{
                                            "id": 15,
                                            "tipo": "texto",
                                            "pos": "16 16",
                                            "size": "296 38",
                                            "text": "Comentario 2: Muy útil esta app."
                                        }]
                                    }]
                                }
                            ]
                        }]
                    }
                ]
            }]
        },
        {
            "id": 16,
            "tipo": "circle",
            "pos": "288 552",
            "size": "56 56",
            "children": []
        }
    ]
};

console.log(JSON.stringify(tree, null, 2));
console.log('-----------------');
const graphModel = convertTreeToGraphLinksModel(tree);
console.log(JSON.stringify(graphModel, null, 2));