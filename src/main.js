import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 1. 引入你需要的组件
import { Button, Loading, ActionSheet, Field, RadioGroup, Radio, Popup, Tag } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';

createApp(App)
  .use(Button)
  .use(Loading)
  .use(ActionSheet)
  .use(Field)
  .use(RadioGroup)
  .use(Radio)
  .use(Popup)
  .use(Tag)
  .use(router)
  .mount('#app')
