<script setup lang="ts">
import { ref } from 'vue';
// import { Capture,StartCamera } from './utils/Camera.ts';
import type { uploadChangeParam } from 'ant-design-vue';
const files = ref<string[]>([]);
const status = ref({
	done: 0
});
const handleChange = (info: uploadChangeParam) => {
	if (info.file.status !== 'done') {
		return;
	}
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:5000/imageList');
	xhr.send();
	xhr.responseType = 'json';
	xhr.onload = () => {
		if (xhr.status === 200) {
			files.value = [];
			const response = xhr.response;
			console.log(response.image_list[0]);
			for (let i = 0; i < response.length; i++) {
				files.value.push('http://localhost:5000/image/' + response.image_list[i]);
				console.log(files.value);
			}
			status.value.done = 1;
		}
	};
};
const size = ref<number>(0);

async function AppendDataset(): Promise<void> {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:5000/Camera');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({ isDataset: true }));
	xhr.responseType = 'json';
	xhr.onload = () => {
		if (xhr.status === 200) {
			console.log('Dataset Appended');
			size.value = xhr.response.size;
		}
	};
}
async function Start(): Promise<void> {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:5000/Camera');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({ isDataset: false }));
	xhr.responseType = 'json';
	xhr.onload = () => {
		if (xhr.status === 200) {
			const response = xhr.response;
			console.log(response);
			size.value = response.size;
			Start();
		}
	};
}
</script>

<template>
	<template v-if="status.done === 0">
		<a-upload action="http://localhost:5000/upload" @change="handleChange" directory>
			<a-button type="primary">Upload Directory</a-button>
		</a-upload>
	</template>
	<div v-else>
		<ImageViewer :imageUrl="files"></ImageViewer>
		<a-button @click="AppendDataset" type="primary">AppendDataset</a-button>
		<a-button @click="Start" type="primary">Start</a-button>
	</div>
</template>

<style scoped></style>
