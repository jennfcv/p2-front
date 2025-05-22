<template>
    container elementos
    <Padding :node="selectedNode" :update-node-prop="updateNodeProp" />
    <WH :node="selectedNode" :update-node-prop="updateNodeProp" />
    <Margin :node="selectedNode" :update-node-prop="updateNodeProp" /> 
</template>

<script setup >
import Margin from '@/components/atributos/Margin.vue';
import Padding from '@/components/atributos/Padding.vue';
import WH from '@/components/atributos/WH.vue';



import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>