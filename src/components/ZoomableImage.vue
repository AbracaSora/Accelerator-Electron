<template>
  <div class="zoomable-image" @click="handleImageClick($event)">
    <img :src="props.imageUrl" :style="{ transform: `scale(${scale})`, transformOrigin }" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// const imageUrl = ref('');
const scale = ref(1);
const transformOrigin = ref('top left');

const handleImageClick = (event: MouseEvent) => {
  const boundingRect = (event.target as HTMLElement).getBoundingClientRect();
  console.log(boundingRect);
  const offsetX = event.clientX - boundingRect.left;
  const offsetY = event.clientY - boundingRect.top;
  console.log(offsetX, offsetY);
  console.log(event.clientX, event.clientY);

  const zoomOffsetX = offsetX * (scale.value - 1);
  const zoomOffsetY = offsetY * (scale.value - 1);

  transformOrigin.value = `${zoomOffsetX}px ${zoomOffsetY}px`;

  // 根据需要调整放大倍数
  scale.value += 0.5;
};

interface Props {
  imageUrl: string;
}

const props = defineProps<Props>();

</script>

<style scoped>
.zoomable-image {
  overflow: hidden;
  position: relative;
}

.zoomable-image img {
  display: block;
  transition: transform 0.3s ease;
}
</style>
