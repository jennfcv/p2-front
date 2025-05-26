<template>
    Tipo de input
    <!-- <Elevation :node="selectedNode" :update-node-prop="updateNodeProp" />  -->
    <Select :node="selectedNode" :update-node-prop="updateNodeProp" /> 
    
</template>

<script setup >

import Select from '@/components/atributos/SelectInput.vue';



import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>