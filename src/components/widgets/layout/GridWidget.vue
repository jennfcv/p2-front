<template>
    Grid elementos
    <Cross :node="selectedNode" :update-node-prop="updateNodeProp" />
    <Padding :node="selectedNode" :update-node-prop="updateNodeProp" />


</template>

<script setup >
import Cross from '@/components/atributos/CrossCount.vue';
import Padding from '@/components/atributos/Padding.vue';




import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>