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
}
const status = ref<Status>(Status.INIT);
const files = ref<string[]>([]);
const onUpload = (info: UploadChangeParam) => {
	if (info.file.status !== 'done') {
		return;
	}
	axios.get('http://localhost:5000/imageList').then((response:any) => {
		files.value = [];
		console.log(response);
		for (let i = 0; i < response.data.image_list.length; i++) {
			files.value.push('http://localhost:5000/image/' + response.data.image_list[i]);
		}
		status.value = Status.START;
	});
};
const DataSize = ref<number>(0);

async function Start(): Promise<void> {
	const response = await axios.post('http://localhost:5000/Camera', { isDataset: false });
	if (response.status === 200) {
		console.log(response.data.action);
		emitter.emit(response.data.action);
		Start();
	}
}

function RunningSkipTraining() {
	axios.get('http://localhost:5000/LoadModel').then((response:any) => {
		if (response.status === 200) {
			status.value = Status.RUNNING;
			Start();
		}
	})
}

function RunningWithTraining() {
	status.value = Status.TRAINING;
}
const Message = ref<string>('Please press Space to start training');

function Train() {      
	axios.post('http://localhost:5000/Train').then((response:any) => {
		if (response.status === 200) {
			DataSize.value = response.data.size;
		}
		if (response.data.size === 20) {
			status.value = Status.RUNNING;
			Start();
		}
	});
}
document.onkeyup = function (event) {
	if (event.key === ' ') {
		if (status.value === Status.TRAINING) {
			Train();
		}
	}
}
</script>

<template>
	<template v-if="status === Status.INIT">
		<a-upload action="http://localhost:5000/upload" @change="onUpload" directory>
			<a-button type="primary">Upload Directory</a-button>
		</a-upload>
	</template>
	<template v-else-if="status === Status.START">
		<a-button @click="RunningSkipTraining">使用默认数据集</a-button>
		<a-button @click="RunningWithTraining">使用自定义数据集</a-button>
	</template>
	<template v-else-if="status === Status.TRAINING">
		<a-progress :percent="DataSize * 5" />	
		<p>{{ Message }}</p>
	</template>
	<template v-else-if="status === Status.RUNNING">
		<ImageViewer :imageUrl="files"></ImageViewer>
	</template>
</template>

<style scoped></style>