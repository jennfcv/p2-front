<template>
    sized box elementos
    <WH :node="selectedNode" :update-node-prop="updateNodeProp" />
</template>

<script setup >
import Padding from '@/components/atributos/Padding.vue';
import WH from '@/components/atributos/WH.vue';

import { useDiagram } from '@/composables/useDiagram.js';


const { selectedNode, updateNodeProp } = useDiagram();



</script>