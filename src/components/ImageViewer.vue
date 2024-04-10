<template>
    <div class="image-viewer" v-viewer @inited="inited">
        <img class="preview-box" v-for="src in props.imageUrl" :src="src"/>
    </div>
</template>

<script setup lang="ts">
import Viewer from 'viewerjs';


let $viewer : Viewer;

const inited = (viewer: Viewer) => {
    $viewer = viewer;
}
// const zoomIn = (x: number, y: number) => {
//     $viewer.zoom(0.1);
// }
const Next = () => {
    $viewer.next(true);
}
const Prev = () => {
    $viewer.prev(true);
}
interface Props {
    imageUrl: string[];
}
const props = defineProps<Props>();
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        Next();
    } else if (e.key === 'ArrowLeft') {
        Prev();
    }
});
</script>

<style scoped>
.preview-box {
    width: 100px;
    height: 100px;
    object-fit: contain;
}
</style>