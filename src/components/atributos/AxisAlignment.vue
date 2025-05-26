<template>
  <label>Axis Aligment</label>
  <select class="form-control" :value="props.node?.axis || 'start'" @change="onMarginChange">
    <option value="start">Start</option>
    <option value="center">Center</option>
    <option value="spaceAround">Around</option>
    <option value="spaceBetween">Between</option>
    <option value="spaceEvenly">Evenly</option>
  </select>
</template>

<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function onMarginChange(event) {
  const value = event.target.value;
  props.updateNodeProp('axis', value);
}
</script>
