<template>
    drawer elementos
    <button @click="handleAddheader">Drawer header</button> 
    <button @click="handleAddNode">item</button> 

</template>

<script setup >
import { useDiagram } from '@/composables/useDiagram.js';
import { useTree } from '@/composables/useTree.js';


const { selectedNode, updateNodeProp, addNodeCustom,addNode, addNodeText } = useDiagram();
const { arbolJerarquico, agregarNuevoNodo, buscarNodoPorId, obtenerIdsRecursivos, eliminarNodoDelArbol } = useTree(selectedNode);


function handleAddNode() {
  const newNodeData =  addNodeCustom('drawerItem','lightskyblue', { x: 180, y: 25 },{ x: -195, y: 25 });
  agregarNodoJson('itemDrawer', newNodeData);
}

function handleAddheader() {
  const newNodeData = addNodeCustom('drawerHeader', 'lightskyblue', { x: 180, y: 115 }, { x: 10, y: 60 });
  agregarNodoJson('drawerHeader', newNodeData);
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