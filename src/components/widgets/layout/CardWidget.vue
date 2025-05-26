<template>
    card elementos
    <Elevation :node="selectedNode" :update-node-prop="updateNodeProp" /> 
    <Margin :node="selectedNode" :update-node-prop="updateNodeProp" /> 
</template>

<script setup >
import Margin from '@/components/atributos/Margin.vue';
import Elevation from '@/components/atributos/Elevation.vue';



import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>