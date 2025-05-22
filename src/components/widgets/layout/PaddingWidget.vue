<template>
    padding elementos
    <Padding :node="selectedNode" :update-node-prop="updateNodeProp" />
</template>

<script setup >
import Padding from '@/components/atributos/Padding.vue';


import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>