import * as go from "gojs";

export class DiagramManager {
    constructor(diagramContainer, onNodeSelectedCallback) {
        this.diagram = null;
        this.nodeTemplates = this.getNodeTemplates();
        this.initialize(diagramContainer);

        this.diagram.addDiagramListener("ChangedSelection", (e) => {
            const selectedNode = this.diagram.selection.first();
            if (selectedNode instanceof go.Node) {
                if (typeof onNodeSelectedCallback === 'function') {
                    onNodeSelectedCallback(selectedNode.data);
                }
            } else {
                if (typeof onNodeSelectedCallback === 'function') {
                    onNodeSelectedCallback(null);
                }
            }
        });

    }

    // Métodos privados
    getNodeTemplates() {
        return {
            default: new go.Node("Auto").add(
                new go.Shape("RoundedRectangle", { fill: "white" }),
                new go.TextBlock({ margin: 5 }, new go.Binding("text", "text"))
            ),

            // para texto
            text: new go.Node("Auto", {
                    layerName: "Foreground",
                    selectable: true,
                    resizable: true,
                    resizeObjectName: "TEXT"

                })
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.TextBlock({
                        margin: 5,
                        name: "TEXT",
                        font: "bold 12pt sans-serif",
                        editable: true
                    })
                    .bindTwoWay("text", "text")
                    .bind("font", "fontSize", (size) => `bold ${size || 12}pt sans-serif`)
                    .bind("stroke", "textColor")
                ),

            //custom
            custom: new go.Node('Spot', {
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape',
                    locationSpot: new go.Spot(0, 0, 30 / 1, 30 / 1)
                })
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape({
                        stroke: 'gray',
                        name: 'mainShape',
                        opacity: 0.7,
                        minSize: new go.Size(30, 30),
                        desiredSize: new go.Size(30, 30)
                    })
                    .bind('fill', 'color')
                    .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify),
                    new go.TextBlock({
                        font: 'italic 11pt Verdana'
                    }).bind('text', 'label')
                ),

            rectangleTextNode: new go.Node('Auto', {
                    locationSpot: go.Spot.Center,
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape'
                })
                .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape('Rectangle', {
                        name: 'mainShape',
                        fromLinkable: true,
                        toLinkable: true,
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides,
                        fill: "lightgreen"
                    })
                    .bind('fill', 'color')
                    .bindTwoWay("desiredSize", "size", go.Size.parse, go.Size.stringify),
                    new go.TextBlock({
                        margin: 12,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.Wrap.Fit,
                        editable: true
                    })
                    .bindTwoWay("text", "text")
                    .bind("font", "fontSize", (size) => `bold ${size || 24}pt sans-serif`)
                ),


            //componentes flutter
            layout: new go.Node('Spot', {
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape',
                    locationSpot: new go.Spot(0, 0, 30 / 1, 30 / 1)
                })
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape({
                        stroke: 'gray',
                        name: 'mainShape',
                        opacity: 0.7,
                        minSize: new go.Size(30, 30),
                        desiredSize: new go.Size(30, 30)
                    })
                    .bind('fill', 'color')
                    .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify),
                    new go.TextBlock({
                        font: 'italic 11pt Verdana'
                    }).bind('text', 'label')
                ),

            circle: new go.Node('Spot', {
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape',
                    locationSpot: new go.Spot(0, 0, 30, 30) // ajusta el anclaje si quieres centrar
                })
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape("Ellipse", {
                        stroke: 'gray',
                        name: 'mainShape',
                        fill: 'lightblue',
                        opacity: 0.7,
                        minSize: new go.Size(30, 30),
                        desiredSize: new go.Size(30, 30)
                    })
                    .bind('fill', 'color')
                    .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify),
                    new go.TextBlock({
                        font: 'italic 11pt Verdana',
                        stroke: '#222'
                    }).bind('text', 'label')
                )



        };
    }

    // Inicializa el diagrama
    initialize(diagramContainer) {
        const $ = go.GraphObject.make;
        this.diagram = $(go.Diagram, diagramContainer, {
            'animationManager.isEnabled': false,
            'undoManager.isEnabled': false,
            'draggingTool.gridSnapCellSpot': go.Spot.Center,
            'commandHandler.deletesTree': false,
            'commandHandler.canDeleteSelection': () => false,

        });


        this.diagram.nodeTemplateMap.add("default", this.nodeTemplates.default);
        this.diagram.nodeTemplateMap.add("custom", this.nodeTemplates.custom);
        this.diagram.nodeTemplateMap.add("text", this.nodeTemplates.text);
        this.diagram.nodeTemplateMap.add("rectangleTextNode", this.nodeTemplates.rectangleTextNode);
        this.diagram.nodeTemplateMap.add("layout", this.nodeTemplates.layout);
        this.diagram.nodeTemplateMap.add("circle", this.nodeTemplates.circle);

        this.diagram.model = new go.GraphLinksModel([], []);


    }

    addNodeToDiagram(type, color = 'lightskyblue', size = { x: 0, y: 0 }, position = { x: 0, y: 0 }, category = 'custom') {
        const model = this.diagram.model;
        model.startTransaction("add node");

        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: category,
            type: type,
            loc: `${position.x} ${position.y}`,
            color: color,
            size: `${size.x} ${size.y}`,
            label: ""
        };

        model.addNodeData(nodeData);

        model.commitTransaction("add node");
        return nodeData;

    }

    addLayout(type, size = { x: 0, y: 0 }, position = { x: 0, y: 0 }, color = 'aquamarine') {
        const model = this.diagram.model;
        model.startTransaction("add node");

        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: "layout",
            type: type,
            loc: `${position.x} ${position.y}`,
            color: color,
            size: `${size.x} ${size.y}`,
            label: "",
            child: null,
            margin: null
        };

        model.addNodeData(nodeData);

        model.commitTransaction("add node");
        return nodeData;

    }

    addTextNode(tipo, text = "Nuevo Texto", position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add text");

        const textNode = {
            key: model.nodeDataArray.length + 1,
            category: "text",
            loc: `${position.x} ${position.y}`,
            text: text,
            fontSize: 10,
            type: tipo
        };

        model.addNodeData(textNode);

        model.commitTransaction("add text");

        return textNode;
    }

    addRectangleTextNode(type, size = { x: 80, y: 30 }, text, position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add rectangle text node");
        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: "rectangleTextNode",
            loc: `${position.x} ${position.y}`,
            text: text,
            color: "lightgreen",
            size: `${size.x} ${size.y}`,
            type: type,
            field: 'text',
            opciones: [],
            validation: [],
        };

        model.addNodeData(nodeData);

        model.commitTransaction("add rectangle text node");
        return nodeData;
    }

    deleteSelectedNode() {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first();

        if (selectedNode instanceof go.Node) {
            model.startTransaction("delete node");
            model.removeNodeData(selectedNode.data);
            model.commitTransaction("delete node");
            return selectedNode
        } else {
            return null
        }

    }
    deleteNodesByIds(ids = []) {
        if (!Array.isArray(ids) || ids.length === 0) return;

        const model = this.diagram.model;
        model.startTransaction("delete multiple nodes");

        ids.forEach(id => {
            const node = this.diagram.findNodeForKey(id);
            if (node) {
                model.removeNodeData(node.data);
            }
        });

        model.commitTransaction("delete multiple nodes");
    }


    getSelectedNode() {
        const selectedNode = this.diagram.selection.first();
        if (selectedNode instanceof go.Node) {
            return selectedNode;
        } else {
            return null;
        }
    }

    clearDiagram() {
        this.diagram.model.nodeDataArray = [];
        this.diagram.model.linkDataArray = [];
    }

    saveDiagram() {
        const diagrama = this.diagram.model.toJson();
        return diagrama;
    }

    loadDiagram(json) {
        try {
            this.diagram.model = go.Model.fromJson(json);
        } catch (error) {
            console.log('error al cargar', error);
        }
    }


    setNodeMovedCallback(callback) {
        this.onDiagramChanged = callback;
        this._registerChangeListener();
    }

    _registerChangeListener() {
        let timeout = null;
        this.diagram.model.addChangedListener((e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const json = this.saveDiagram();
                this.onDiagramChanged(json);
            }, 200);
        });

    }

    loadDiagram(json) {
        this.diagram.model = go.Model.fromJson(json);

        this._registerChangeListener();
    }

    getDiagramImageData() {
        if (!this.diagram) return null;

        const imageData = this.diagram.makeImageData({
            background: "white",
            scale: 1,
            type: "image/png",
            imageFormat: "png"
        });

        return imageData;
    }

}