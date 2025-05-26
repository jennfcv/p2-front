<template>
  <label>Cross Aligment</label>
  <select class="form-control" :value="props.node?.cross || 'start'" @change="onMarginChange">
    <option value="start">Start</option>
    <option value="center">Center</option>
    <option value="end">End</option>
    <option value="stretch">Stretch</option>
  </select>
</template>

<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function onMarginChange(event) {
  const value = event.target.value;
  props.updateNodeProp('cross', value);
}
</script>
