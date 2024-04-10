import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import panZoom from 'vue-panzoom'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
const app =  createApp(App)
app.use(panZoom)
app.use(VueViewer)
app.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://localhost:5000')
}))
app.mount('#app')
