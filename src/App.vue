<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';   
import { type UploadChangeParam } from 'ant-design-vue';
import emitter from './libs/eventbus';
enum Status {
	INIT = 0,
	START = 1,
	RUNNING = 2,
	TRAINING = 3,
} // 状态
const status = ref<Status>(Status.INIT);
const files = ref<string[]>([]);
const onUpload = (info: UploadChangeParam) => {
	if (info.file.status !== 'done') {
		return;
	}
	status.value = Status.START; // 上传完成, 进入START状态
};
const DataSize = ref<number>(0);
const position = ref<{ x: number, y: number }>({ x: 0, y: 0 });
// 开始运行
// TODO: 优化注视点标记的移动效果
function Start(): void {
	// axios.post('http://localhost:5000/Camera', { isDataset: false }).then((response:any) => {
	// 	if (response.status === 200) {
	// 		position.value = response.data.position;
	// 		emitter.emit(response.data.action);
	// 		Start();
	// 	}
	// });
	// 每500ms获取一次摄像头数据
	setInterval(() => {
		axios.post('http://localhost:5000/Camera', { isDataset: false }).then((response:any) => {
			if (response.status === 200) {
				// position.value = response.data.position;
				let x = response.data.position.x, y = response.data.position.y; // 获取位置
				let dx = x - position.value.x, dy = y - position.value.y; // 计算位移
				// 将当前位置向目标位置移动80%的距离
				position.value = { x: position.value.x + dx * 0.8, y: position.value.y + dy * 0.8 };
				emitter.emit(response.data.action);
			}
		});
	}, 500); // 500ms
}

function RunningSkipTraining() {
	axios.get('http://localhost:5000/LoadModel').then((response:any) => {
		if (response.status === 200) {
			status.value = Status.RUNNING;
			axios.get('http://localhost:5000/imageList').then((response:any) => {
				files.value = [];
				for (let i = 0; i < response.data.image_list.length; i++) {
					files.value.push('http://localhost:5000/image/' + response.data.image_list[i]);
				}
			});
			Start();
		}
	})
}
const Message = ref<string>('Please press Space to start training');

// 训练
function Train() {      
	axios.post('http://localhost:5000/Train').then((response:any) => {
		if (response.status === 200) {
			DataSize.value = response.data.size; // 数据集大小
		}
		if (response.data.isTrained) {
			status.value = Status.RUNNING;
			axios.get('http://localhost:5000/imageList').then((response:any) => {
				files.value = [];
				for (let i = 0; i < response.data.image_list.length; i++) {
					files.value.push('http://localhost:5000/image/' + response.data.image_list[i]);
				} // 获取图片列表
			});
			Start(); // 开始运行
		}
	});
}
// 按下空格键进行训练
document.onkeyup = function (event) {
	if (event.key === ' ') {
		if (status.value === Status.TRAINING) {
			Train();
		}
	}
}
</script>

<template>
	<template v-if="status === Status.INIT"> <!-- 初始化状态 -->
		<h1>基于智能控制的无接触医学图像浏览系统</h1>
		<a-upload action="http://localhost:5000/upload" @change="onUpload" directory>
			<a-button type="primary">Upload</a-button>
		</a-upload>
	</template> 
	<template v-else-if="status === Status.START"> <!-- 开始状态 -->
		<a-button @click="RunningSkipTraining">使用默认数据集</a-button>
		<a-button @click="status = Status.TRAINING">使用自定义数据集</a-button>
	</template>
	<template v-else-if="status === Status.TRAINING"> <!-- 训练状态 -->
		<a-progress :percent="DataSize * 5" /> <!-- 训练进度 -->	
		<p>{{ Message }}</p> 
	</template>
	<template v-else-if="status === Status.RUNNING"> <!-- 运行状态 -->
		<ImageViewer :imageUrl="files"></ImageViewer>
		<div id="target" :style="{left: position.x + '%', top: position.y + '%'}">
		</div> <!-- 渲染注视点标记 -->
	</template>
</template>

<style scoped>
#target {
	background-color: rgba(144, 238, 144, 0.8);
	position: absolute;
	border-radius: 50%;
	height: 40px;
	width: 40px;
	transition: all 0.1s ease;
	box-shadow: 0 0 20px 10px white;
	border: 4px solid rgba(0, 0, 0, 0.5);
	z-index: 2016;
} /* 注视点样式 */
</style>