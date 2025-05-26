<template>
    Row elementos
    <Axis :node="selectedNode" :update-node-prop="updateNodeProp" />
    <Cross :node="selectedNode" :update-node-prop="updateNodeProp" />

</template>

<script setup >
import Axis from '@/components/atributos/AxisAlignment.vue';
import Cross from '@/components/atributos/CrossAlignment.vue';



import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>