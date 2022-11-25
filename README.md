# motionverse-poc

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

### WEB以iframe方式加载数字人
```html
<iframe src="https://www.xxx.com/index.html" frameborder="0" allow="autoplay" id="iframeDom"></iframe>
```

### WEB调用iframe页面的方法
```javascript
// 获取iframe dom
var iframeDom = document.getElementById('iframeDom')

// 更换数字人 type: 方法名 data:方法参数【数字人的索引】
iframeDom.contentWindow.postMessage({ type: 'ChangeCharacter', data: roleIndex }, '*')

// 播报声音文件地址 type: 方法名 data:方法参数【声音文件URL地址】
iframeDom.contentWindow.postMessage({ type: 'AudioBroadcast', data: audioUrl] }, '*')

// 播报文本 type: 方法名 data:方法参数【播报的文本】
iframeDom.contentWindow.postMessage({ type: 'TextBroadcast', data: boardcastText }, '*')

// 问答 文字问答 type: 方法名 data:方法参数【问题的文本】
iframeDom.contentWindow.postMessage({ type: 'TextAnswerMotion', data: qaText }, '*')

// 问答 语音问答 type: 方法名 data:方法参数【录音流的BASE64编码】
iframeDom.contentWindow.postMessage({ type: 'AudioAnswerMotion', data: base64 }, '*')
```

### WEB监听iframe页面的方法
```javascript

// 监听iframe方法
 window.addEventListener('message', function(){
  if (e.data.type == 'loading') { // iframe页面载入进度
    console.log(Math.ceil(e.data.data * 100))
  }
 }, false)
```
