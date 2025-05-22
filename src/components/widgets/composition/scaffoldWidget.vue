<template>
  scaffold elementos
  <button @click="handleAddBar">AppBar</button>
  <button @click="handleAddBody">Body</button>
  <button @click="handleAddDrawer">Drawer</button>
  <button @click="handleAddCircle">floating Button</button>



</template>

<script setup>
import { useDiagram } from '@/composables/useDiagram.js';
import { useTree } from '@/composables/useTree.js';


const { selectedNode, updateNodeProp, addNodeCustom, addNodeText } = useDiagram();
const { arbolJerarquico, agregarNuevoNodo, buscarNodoPorId, obtenerIdsRecursivos, eliminarNodoDelArbol } = useTree(selectedNode);

function handleAddCircle() {
  const newNodeData = addNodeCustom('circle', 'powderblue', { x: 70, y: 70 }, { x: 70, y: 70 }, "circle");
    agregarNodoJson('circle', newNodeData);

}
function handleAddBar() {
  const newNodeData = addNodeText('appbar', { x: 360, y: 30 }, 'texto');
  agregarNodoJson('appbar', newNodeData);
  console.log(newNodeData);

}
function handleAddDrawer() {
  const newNodeData = addNodeCustom('drawer', 'salmon', { x: 200, y: 620 });
  agregarNodoJson('drawer', newNodeData);
  console.log(newNodeData);

}
function handleAddBody() {
  const newNodeData = addNodeCustom('body', 'lightskyblue', { x: 340, y: 540 }, { x: 10, y: 60 });
  agregarNodoJson('body', newNodeData);
  console.log(newNodeData);

}

const agregarNodoJson = (type, nodo) => {
    const nuevoNodo = {
        id: nodo.key,
        tipo: type,
        children: []
    };
    agregarNuevoNodo(nuevoNodo);
}



</script>