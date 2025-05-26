<template>
  <label>Cross Count</label>
  <input class="form-control" type="number" :value="props.node?.crossc || 4" @change="onPaddingChange" />

</template>

<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function onPaddingChange(event) {
  const value = Number(event.target.value);
  props.updateNodeProp('crossc', value);
}
</script>
