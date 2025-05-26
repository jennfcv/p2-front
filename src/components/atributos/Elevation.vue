<template>
  <label>Elevacion</label>
  <input class="form-control" type="number" :value="props.node?.elevation || 1" @change="onPaddingChange" />
</template>

<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function onPaddingChange(event) {
  const value = Number(event.target.value);
  props.updateNodeProp('elevation', value);
}
</script>
