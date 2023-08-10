# html-poc

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## WEB接入 数字人

### demo 访问链接：https://demo.deepscience.cn/html-poc/index.html

### WEB以iframe方式加载数字人
```html
<iframe src="https://demo.deepscience.cn/poc/index.html" frameborder="0" allow="autoplay" id="iframeDom"></iframe>
```

### WEB调用iframe页面的方法
```javascript
// 获取iframe dom
var iframeDom = document.getElementById('iframeDom')

// 更换数字人 type: 方法名 data:方法参数【数字人的名称】
iframeDom.contentWindow.postMessage({ type: 'ChangeCharacter', data: roleName }, '*')

// 播报声音文件地址 type: 方法名 data:方法参数【声音文件URL地址】
iframeDom.contentWindow.postMessage({ type: 'AudioBroadcast', data: audioUrl }, '*')

// 播报文本 type: 方法名 data:方法参数【播报的文本】 bodyMotion:身体动作 isFirst:播放是否放到第一位
// 注：该方法可以连续多次调用，输入不通的文本，数字人会按调用顺序逐次播报
iframeDom.contentWindow.postMessage({ type: 'TextBroadcast', data: boardcastText, bodyMotion:3, isFirst:false }, '*')

// 问答 文字问答 type: 方法名 data:方法参数【问题的文本】 bodyMotion:身体动作
iframeDom.contentWindow.postMessage({ type: 'TextAnswerMotion', data: qaText, bodyMotion:3 }, '*')

// 问答 语音问答 type: 方法名 data:方法参数【录音流的BASE64编码】
iframeDom.contentWindow.postMessage({ type: 'AudioAnswerMotion', data: base64 }, '*')

// 中断数字人当前动作 type：方法名 data：参数无
iframeDom.contentWindow.postMessage({ type: 'BroadcastStop', data: null }, '*')

// 播放音量 type：方法名 data：参数 float【0~1】
iframeDom.contentWindow.postMessage({ type: 'AudioVolume', data: 1 }, '*')

// tts音色 type：方法名 data：参数 string【声音名称】
iframeDom.contentWindow.postMessage({ type: 'VoiceName', data: 'aixia' }, '*')

// 生成音频速度 type：方法名 data：参数 int【0~100】
iframeDom.contentWindow.postMessage({ type: 'VoiceSpeed', data: 50 }, '*')

// 生成音频音调 type：方法名 data：参数 int【0~100】
iframeDom.contentWindow.postMessage({ type: 'VoiceFM', data: 50 }, '*')
```

### WEB监听iframe页面的方法
```javascript

// 监听iframe方法
 window.addEventListener('message', function(){

  // iframe页面载入进度
  if (e.data.type == 'loading') {
    console.log(Math.ceil(e.data.data * 100))
  }

  // 交互完成loading
  if (e.data.type == 'loadAb') {
    interactiveLoading.value = e.data.data
  }

  // 播放开始
  if (e.data.type == 'playStart'){
    // 问题文本
    console.log(e.data.text)

    // 答案文本
    console.log(e.data.answer)
  }

  // 播放结束
  if (e.data.type == 'playEnd'){
    // code...
  }

  // 检测webview受到点击，【通常用来解决浏览器禁止自动播放音频的安全策略】
  if (e.data.type == 'touch'){
    // code...
  }

 }, false)
```
