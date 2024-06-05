<script setup lang="ts">
import { onBeforeMount,onMounted,ref } from "vue";
import html2canvas from "html2canvas";
import emitter from "../libs/eventbus";
import axios from 'axios';
onBeforeMount(() => {
    emitter.off('识别');
});
onMounted(() => {
    emitter.on('识别', Identify);
});
const Message = ref<string>('');
let imgUrl = ref<string>('')
// 生成快照
const convertToImage = (container: any, options?: any):Promise<any> => {
    // 设置放大倍数
    const scale = window.devicePixelRatio;

    // 传入节点原始宽高
    const _width = container.offsetWidth;
    const _height = container.offsetHeight;
    if (options) {
        let { width, height } = options;
        width = width || _width;
        height = height || _height;
    }
    // html2canvas配置项
    const ops = {
        scale,
        // width,
        // height,
        useCORS: true,
        allowTaint: false,
        ...options
    };
    return new Promise((resolve) => {
        html2canvas(container, ops).then(canvas => {
            //   document.body.appendChild(canvas);  // 直接是一个canvas图片

            // 返回图片的二进制数据
            // return canvas.toDataURL("image/png");
            // let dataURI = canvas.toDataURL('image/' + format, quality);  ps:  弃用
            // 生成的Base64图片将比使用toDataURL方法生成的小得多，并且可以方便地在浏览器中显示和处理。
            canvas.toBlob((blob: any) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                }
            }, 'image/jpeg');
        });
    });
}
const Identify = async () => {
    let imgBlobData: any = '';
    imgBlobData = await convertToImage(document.body);
    imgUrl.value = imgBlobData;
    axios.post('http://localhost:5000/Identify', { 
        img : imgBlobData,
    }).then((response: any) => {
        if (response.status === 200) {
            console.log('保存成功');
            console.log(response.data);
            Message.value = response.data;
        }
    });
}
</script>
<template>
    <div class="contrainer">
        {{ Message }}
    </div>
</template>
<style>
.contrainer {
    display: flex;
    flex-direction: column;
}

.img {
    width: 500px;
    height: 300px;
    border: 1px solid black;
}

.btnCon {
    display: flex;
}

.btn {
    cursor: pointer;
    width: 200px;
    margin: 20px 20px;
}

#content {
    background: rgba(100, 255, 255, 0.5);
    padding: 50px 10px;
}
</style>
