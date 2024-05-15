import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import jQuery from 'jquery'
const app =  createApp(App)
app.use(VueViewer)
app.use(jQuery)
app.config.globalProperties.$ = jQuery
app.mount('#app')
