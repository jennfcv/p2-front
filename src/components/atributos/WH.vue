<script setup>
const props = defineProps({
  node: Object,
  updateNodeProp: Function,
});

function updateWH(width, height) {
  const whValue = `${width} ${height}`;
  props.updateNodeProp('size', whValue);
  
//   props.updateNodeProp('size', whValue);
}

function onWidthChange(e) {
  const height = props.node?.size?.split(' ')[1] || 0;
  updateWH(Number(e.target.value), height);
}

function onHeightChange(e) {
  const width = props.node?.size?.split(' ')[0] || 0;
  updateWH(width, Number(e.target.value));
}
</script>

<template>
  <label>Width</label>
  <input class="form-control" type="number" :value="props.node?.size?.split(' ')[0] || 0" @change="onWidthChange" />
  <label>Height</label>
  <input class="form-control" type="number" :value="props.node?.size?.split(' ')[1] || 0" @change="onHeightChange" />
</template>
