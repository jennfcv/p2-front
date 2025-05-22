<template>
  <label>Margin</label>
  <input class="form-control"  type="number" :value="props.node?.margin || 0" @change="onMarginChange" />
</template>

<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function onMarginChange(event) {
  const value = Number(event.target.value);
  props.updateNodeProp('margin', value);
}
</script>
