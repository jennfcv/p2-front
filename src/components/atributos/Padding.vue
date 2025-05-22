<template>
  <label>Padding</label>
  <input class="form-control" type="number" :value="props.node?.padding || 0" @change="onPaddingChange" />
</template>

<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function onPaddingChange(event) {
  const value = Number(event.target.value);
  props.updateNodeProp('padding', value);
}
</script>
