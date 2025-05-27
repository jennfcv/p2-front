// src/composables/useDiagram.js
import { ref } from 'vue';

const selectedNode = ref(null);
let diagramManager = null;
let emitirFn = null;


function setDiagramManager(manager) {
    diagramManager = manager;
}

function setEmitir(fn) {
    emitirFn = fn;
}

function setSelectedNode(node) {
    selectedNode.value = node;
}

function updateNodeProp(prop, value) {
    if (!selectedNode.value || !diagramManager) return;

    diagramManager.diagram.model.startTransaction('update node');
    diagramManager.diagram.model.setDataProperty(selectedNode.value, prop, value);
    diagramManager.diagram.model.commitTransaction('update node');
    diagramManager.diagram.findNodeForKey(selectedNode.value.key)?.updateTargetBindings();
    diagramManager.diagram.requestUpdate();
    diagramManager.diagram.layout?.invalidateLayout();
    console.log("actualizado", selectedNode.value);
}

function addNode(type = 'column', location = { x: 100, y: 100 }) {
    if (!diagramManager) return;
    emitirFn?.(diagramManager.saveDiagram());
    return diagramManager.addLayout(type, location);
}

function addNodeText(valor = "text", size = { x: 80, y: 30 }, text = "input", pos = { x: 0, y: 0 }) {
    if (!diagramManager) return;
    emitirFn?.(diagramManager.saveDiagram());
    return diagramManager.addRectangleTextNode(valor, size, text, pos);
}
function addNodeCustom(type,color, size = { x: 0, y: 0 }, position = { x: 0, y: 0 }, category = 'custom') {    
    if (!diagramManager) return;    
    emitirFn?.(diagramManager.saveDiagram());
    return diagramManager.addNodeToDiagram(type,color, size, position,category);
}

function linkNodes(fromKey, toKey) {
  if (!diagramManager || !fromKey || !toKey) return;

  const diagram = diagramManager.diagram;
  const model = diagram.model;

  diagram.startTransaction("link exclusivo");

  const linksToRemove = diagram.findLinksByExample({ from: fromKey });
  linksToRemove.each(link => model.removeLinkData(link.data));

  model.addLinkData({ from: fromKey, to: toKey });

  diagram.commitTransaction("link exclusivo");

  diagram.requestUpdate();
}   

function removeOutgoingLinks(fromKey) {
  if (!diagramManager || !fromKey) return;

  const diagram = diagramManager.diagram;
  const model = diagram.model;

  diagram.startTransaction("eliminar enlaces salientes");

  const linksToRemove = diagram.findLinksByExample({ from: fromKey });
  linksToRemove.each(link => model.removeLinkData(link.data));

  diagram.commitTransaction("eliminar enlaces salientes");

  diagram.requestUpdate();
}




export function useDiagram() {
    return {
        selectedNode,
        setSelectedNode,
        setDiagramManager,
        updateNodeProp,
        addNode,
        setEmitir,
        addNodeText,
        addNodeCustom,
        linkNodes,
        removeOutgoingLinks,
        
    };
}