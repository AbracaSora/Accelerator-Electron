<template>
    <a-image-preview-group>
        <a-image :width="100" src="https://aliyuncdn.antdv.com/vue.png" />
        <a-image :width="100" src="https://aliyuncdn.antdv.com/logo.png" />
    </a-image-preview-group>
</template>

<script setup lang="ts">
function simulateMouseScroll(): void {
    const centerX: number = window.innerWidth / 2;
    const centerY: number = window.innerHeight / 2;

    // 创建一个鼠标事件，模拟鼠标移动到画面中心
    const mouseMoveEvent: MouseEvent = new MouseEvent('mousemove', {
        clientX: centerX,
        clientY: centerY,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(mouseMoveEvent);

    // 创建一个滚轮事件，模拟滚轮向前滚动
    const wheelEvent: WheelEvent = new WheelEvent('wheel', {
        deltaY: -100, // 滚轮向前滚动的量，可以根据需要调整
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(wheelEvent);
}
document.addEventListener('keydown', (event: KeyboardEvent) => {
    // 检查按下的是哪个按键，这里假设按下空格键触发函数
    if (event.code === 'Space') {
        simulateMouseScroll();
    }
});
</script>

<style scoped>
</style>