<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import emitter from './libs/eventbus';
enum Status {
	INIT = 0,
	START = 1,
	RUNNING = 2,
	TRAINING = 3,
} // 状态
const status = ref<Status>(Status.INIT);
const files = ref<string[]>([]);
const DataSize = ref<number>(0);
const position = ref<{ x: number, y: number }>({ x: 0, y: 0 });
// 开始运行
// TODO: 优化注视点标记的移动效果
function Start(): void {
	axios.post('http://localhost:5000/Camera', { isDataset: false }).then((response: any) => {
		if (response.status === 200) {
			position.value = response.data.position;
			emitter.emit(response.data.action);
			const videoFrameData = response.data.frame;
			const videoFrameElement = document.getElementById("videoFrame") as HTMLVideoElement;
			videoFrameElement.src = `data:image/jpeg;base64, ${videoFrameData}`;
			Start();
		}
	});
}

function RunningSkipTraining() {
	axios.get('http://localhost:5000/LoadModel').then((response: any) => {
		if (response.status === 200) {
			status.value = Status.RUNNING;
			axios.get('http://localhost:5000/imageList').then((response: any) => {
				files.value = [];
				for (let i = 0; i < response.data.image_list.length; i++) {
					files.value.push('http://localhost:5000/image/' + response.data.image_list[i]);
				}
			});
			Start();
		}
	})
}
const Message = ref<string>('1.请视线跟随鼠标，不连续地按下空格，直到进度条达到100%。\n2.按下空格时鼠标的位置尽量分散，更有利于视线追踪模型的准确性。');

// 训练
function Train() {
	axios.post('http://localhost:5000/Train').then((response: any) => {
		if (response.status === 200) {
			DataSize.value = response.data.size; // 数据集大小
		}
		if (response.data.isTrained) {
			status.value = Status.RUNNING;
			axios.get('http://localhost:5000/imageList').then((response: any) => {
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
		<a-upload action="http://localhost:5000/upload" multiple>
			<a-button type="primary">Upload</a-button>
		</a-upload>
		<a-button @click="status = Status.START">Start</a-button>
		<p style="text-align: left;margin-top: 20px;white-space: pre-line;">
			1.本系统基于视线追踪、手势识别与AI识别技术，可以进行图像的浏览与视线指向内容的识别。<br>
			2.请先选择图片进行上传，然后单击“Start”按钮，即可开始使用系统。<br>
			3.建议在光线适宜、人像清晰的摄像环境下使用本系统。<br>
		</p>

		<p style="text-align: left;margin-top: 20px;white-space: pre-line;">
			图片浏览时支持的手势操作：<br>
			向前切换图片：拇指张开，其余四指向上<br>
			向后切换图片：拇指折回，其余四指向上<br>
			放大图片：拇指与食指保持较大间距<br>
			缩小图片：拇指与食指保持较小间距<br>
			对注视部分的识别：食指与中指向上，其他手指折回<br>
		</p>

	</template>
	<template v-else-if="status === Status.START"> <!-- 开始状态 -->
		<a-button @click="RunningSkipTraining">使用默认数据集</a-button>
		<a-button @click="status = Status.TRAINING">使用自定义数据集</a-button>
		<p>
			1.若选择“使用已保存模型”，将会使用您上一次选择“进行模型训练”时得到的模型。<br>
			2.若选择“进行模型训练”，将会重新收集您的视线数据，训练新的模型。
		</p>
	</template>
	<template v-else-if="status === Status.TRAINING"> <!-- 训练状态 -->
		<a-progress :percent="DataSize * 5" /> <!-- 训练进度 -->
		<p style="white-space: pre-line;">{{ Message }}</p>
	</template>
	<template v-else-if="status === Status.RUNNING"> <!-- 运行状态 -->
		<ImageViewer :imageUrl="files"></ImageViewer>
		<div id="target" :style="{ left: position.x + '%', top: position.y + '%' }">
			<img id="Camera"></img>
		</div> <!-- 渲染注视点标记 -->
		<HtmlToCanvas id="canvas"></HtmlToCanvas>
		<img id="videoFrame" :Position="position"></img> <!-- 渲染视频流 -->

	</template>
</template>

<style scoped>
#target {
	background-color: rgba(144, 238, 144, 0);
	position: absolute;
	border-radius: 50%;
	height: 40px;
	width: 40px;
	transition: all 0.1s ease;
	box-shadow: 0 0 20px 10px white;
	border: 4px solid rgba(81, 81, 81, 0.3);
	z-index: 2016;
}

/* 注视点样式 */
#videoFrame {
	position: absolute;
	top: 0;
	left: 0;
	width: auto;
	height: auto;
	max-width: 30%;
	max-height: 30%;
}

#canvas {
	z-index: 2015;
	color: aqua;
}
</style>