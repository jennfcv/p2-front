<template>
    floatting elementos
     <div v-if="scaffolds.length > 1">
    <label for="scaffold-select">Selecciona un Scaffold</label>
    <select v-model="scaffoldSeleccionado" class="form-control" id="scaffold-select" @change="conectarConScaffold">
      <option v-for="s in scaffolds" :key="s.id" :value="s.id">
        {{ s.nombre }}
      </option>
    </select>
    <button @click="deleteConection()">Eliminar conexion</button>
    
  </div>
</template>

<script setup >
import { ref, onMounted } from 'vue';
const scaffoldSeleccionado = ref(null);
const scaffolds = ref([]);

import { useDiagram } from '@/composables/useDiagram.js';
import { useTree } from '@/composables/useTree.js';


const { selectedNode, linkNodes, updateNodeProp, removeOutgoingLinks } = useDiagram();
const { arbolJerarquico, obtenerScaffoldIdsYTextos } = useTree(selectedNode)
onMounted(() => {
  const lista = obtenerScaffoldIdsYTextos();
  if (lista.length > 1) {
    scaffolds.value = lista;
    scaffoldSeleccionado.value = lista[0].id; 
  }
});

function conectarConScaffold() {
   if (!selectedNode.value || !scaffoldSeleccionado.value) return;

  const fromKey = selectedNode.value.key;
  const toKey = scaffoldSeleccionado.value;

  if (fromKey === toKey) return;

  removeOutgoingLinks(fromKey);
  linkNodes(fromKey, toKey);
  updateNodeProp('conection', toKey);
}

function deleteConection() {
    removeOutgoingLinks(selectedNode.value.key);
}




</script>