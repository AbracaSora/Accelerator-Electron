<template>
    <viewer class="image-viewer" @inited="inited">
        <img class="preview-box" v-for="src in props.imageUrl" :src="src"/>
    </viewer>
</template>

<script setup lang="ts">
import emitter from '../libs/eventbus.ts';
import { onBeforeMount, onMounted } from 'vue';


let $viewer : Viewer;

const inited = (viewer: Viewer) => {
    console.log(viewer);
    $viewer = viewer;
    emitter.on('放大', zoomIn);
    emitter.on('缩小', zoomOut);
    emitter.on('向后翻页', Next);
    emitter.on('向前翻页', Prev);
}
const zoomIn = () => {
    $viewer.zoom(0.1);
}
const zoomOut = () => {
    $viewer.zoom(-0.1);
}
const Next = () => {
    $viewer.next(true);
}
const Prev = () => {
    console.log($viewer);
    $viewer.prev(true);
}
interface Props {
    imageUrl: string[];
}
const props = defineProps<Props>();
onMounted(() => {
    
});
onBeforeMount(() => {
    emitter.off('放大');
    emitter.off('缩小');
    emitter.off('向后翻页');
    emitter.off('向前翻页');
});
</script>

<style scoped>
.preview-box {
    width: 100px;
    height: 100px;
    object-fit: contain;
}
</style>