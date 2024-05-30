import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Viewer from 'v-viewer'
const app =  createApp(App)
app.use(VueViewer)
app.use(Viewer)
app.mount('#app')
