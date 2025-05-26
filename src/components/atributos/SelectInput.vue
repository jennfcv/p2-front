<template>
  <label>Tipo</label>
  <select class="form-control" :value="props.node?.field || 'text'" @change="onFieldChange">
    <option value="text">Texto</option>
    <option value="select">Select</option>
    <option value="check">Check</option>
    <option value="radio">Radio</option>
  </select>

  <!-- Opciones para select y radio -->
  <div v-if="field === 'select' || field === 'radio'" class="mt-3">
    <div v-for="(item, index) in opciones" :key="index" class="mb-2 d-flex">
      <input v-model="opciones[index]" type="text" class="form-control me-2" placeholder="Opción" />
      <button @click="removeOpcion(index)" type="button" class="btn btn-danger">x</button>
    </div>
    <button @click="agregarOpcion" type="button" class="btn btn-success me-2">+</button>
    <button @click="confirmarOpciones" type="button" class="btn btn-primary">Confirmar</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

const field = ref(props.node?.field || 'text');
const opciones = ref(props.node?.opciones ? [...props.node.opciones] : []);

watch(() => props.node, (newNode) => {
  field.value = newNode?.field || 'text';
  opciones.value = newNode?.opciones ? [...newNode.opciones] : [];
});

function onFieldChange(event) {
  const value = event.target.value;
  field.value = value;
  props.updateNodeProp('field', value);

  if (value !== 'select' && value !== 'radio') {
    opciones.value = [];
    props.updateNodeProp('opciones', []);
  }
}

function agregarOpcion() {
  if (opciones.value.length === 0 || opciones.value[opciones.value.length - 1] !== '') {
    opciones.value.push('');
  }
}

function removeOpcion(index) {
  opciones.value.splice(index, 1);
}

function confirmarOpciones() {
  const opcionesValidas = opciones.value.filter(o => o.trim() !== '');
  opciones.value = opcionesValidas;
  props.updateNodeProp('opciones', opcionesValidas);
}
</script>
