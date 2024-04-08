import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import panZoom from 'vue-panzoom'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

const app =  createApp(App)
app.use(panZoom)
app.use(VueViewer)
app.mount('#app')
