<template>
    <template v-if="props.imageUrl.length"> <!--在图片加载完成后显示-->
        <viewer class="viewer" @inited="inited">
            <img class="preview-box" v-for="src in props.imageUrl" :src="src" :key="src"/>
        </viewer>
    </template>
</template> 

<script setup lang="ts">
import emitter from '../libs/eventbus.ts';
import { onBeforeMount, onMounted } from 'vue';

let $viewer : Viewer;
// 初始化viewer
const inited = (viewer: Viewer) => {
    $viewer = viewer;
    $viewer.view(0);
}
// TODO: 添加其他功能,并对应一种操作手势
// 放大
const zoomIn = () => {
    $viewer.zoom(0.1);
}
// 缩小
const zoomOut = () => {
    $viewer.zoom(-0.1);
}
// 下一页
const Next = () => {
    $viewer.next(true);
}
// 上一页
const Prev = () => {
    $viewer.prev(true);
}
interface Props {
    imageUrl: string[]; // 图片地址
}
const props = defineProps<Props>();
// 监听事件
onMounted(() => {
    emitter.on('放大', zoomIn);
    emitter.on('缩小', zoomOut);
    emitter.on('向后翻页', Next);
    emitter.on('向前翻页', Prev);
});
// 在组件挂载之前移除事件监听
onBeforeMount(() => {
    emitter.off('放大');
    emitter.off('缩小');
    emitter.off('向后翻页');
    emitter.off('向前翻页');
});
</script>

<style scoped>
.preview-box {
    width: 250px;
    height: 250px;
    object-fit: contain;
}
</style>