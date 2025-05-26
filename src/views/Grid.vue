<template>
    <div>
        <p v-if="selectedNode">Nodo seleccionado: {{ selectedNode.type }}{{ selectedNode.key }}</p>
        <div class="col-md-6">
            <label for="jsonTextarea">Pega tu JSON aquí:</label>
            <textarea id="jsonTextarea" v-model="jsonInput"></textarea>
            <button class="btn btn-primary" @click="cargarDiagrama">Cargar diagrama</button>
            <textarea id="jsonTextarea" v-model="jsonoutut"></textarea>
            <button class="btn btn-primary" @click="recuperar">recuperar diagrama</button>
        </div>
        <div class="container">

            <div ref="diagramRef" class="diagram"></div>

        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { DiagramManager } from "../class/DiagramManagerNew.js";

const jsonInput = ref('')
const jsonoutut = ref('')

const selectedNode = ref(null);
let diagramManager = null;

const diagramRef = ref(null);


onMounted(() => {
    if (diagramRef.value) {
        diagramManager = new DiagramManager(diagramRef.value, (nodeData) => {
                    selectedNode.value = nodeData
                    console.log(selectedNode.value); 
                });
    }
});

function cargarDiagrama() {
  diagramManager.loadDiagram(jsonInput.value)
}
function recuperar() {
  
    jsonoutut.value = diagramManager.saveDiagram();
}

</script>
