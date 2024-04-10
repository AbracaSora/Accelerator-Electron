<script setup lang="ts">
import { ref } from 'vue';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');
socket.on('connect', () => {
	console.log('connected');
});

socket.on('message', (data: any) => {
	console.log(data);
});
const files = ref<string[]>([]);
const status = ref({ done: 0 });
const handleChange = () => {
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
			status.value.done = files.value.length;
		}
	};
}
</script>

<template>
	<template v-if="status.done == 0">
		<a-upload  action="http://localhost:5000/upload" @change="handleChange"  directory>
			<a-button type="primary" @click="">Upload Directory</a-button>
		</a-upload>
	</template>
	<ImageViewer v-else :imageUrl="files"></ImageViewer>
</template>

<style scoped></style>
