<template>
  <div id="wrap">
    <!-- welcome -->
    <div class="welcome" v-if="step === 0">
      <div class="welcome-logo"></div>
      <p class="welcome-name">Motionverse</p>
      <p class="welcome-desc">{{desc}}</p>
      <van-button round @click="onExperience" class="welcome-btn">Experience</van-button>
    </div>

    <!-- loading -->
    <div class="loading" v-if="step === 1">
      <van-loading type="spinner" size="40px" vertical color="#666666" text-size="14px">{{loadingNum}}%</van-loading>
    </div>

    <!-- stage -->
    <div class="stage" v-if="step === 1 || step === 2">
      <div id="iframe-wrap" :class="{bank: sceneType == 2}">
        <iframe :src="iframeUrl" frameborder="0" ref="iframeDom" allow="autoplay" id="iframeDom"></iframe>
      </div>
      <div class="header">
        Motionverse Demo
        <div class="config-btn">
          <span @click="configShow = true" class="setting-ico"></span>
          <van-action-sheet v-model:show="configShow" cancel-text="Cancel" :actions="actions" @select="onSelect" />
        </div>
      </div>

      <div class="buttom-bar" v-if="touched == 2">
        <div class="quick-bar" v-if="!prevView && stageType == 2">
          <!-- <van-tag color="#1989fa" size="large" plain round @click="fixedAnswer('平台介绍')">平台介绍</van-tag>
          <van-tag color="#1989fa" size="large" plain round @click="fixedAnswer('技术介绍')">技术介绍</van-tag>
          <van-tag color="#1989fa" size="large" plain round @click="fixedAnswer('业务介绍')">业务介绍</van-tag> -->
          <div v-if="sceneType == 2">
            <p class="tag-title">You can ask the following questions:</p>
            <van-tag color="#1989fa" size="large" plain round @click="fixedAnswer('最近有什么好的产品')">最近产品</van-tag>
            <van-tag color="#1989fa" size="large" plain round @click="fixedAnswer('理财购买')">理财购买</van-tag>
          </div>
        </div>
        <div class="option-bar">
          <!-- 播报 -->
          <div v-if="stageType == 1">
            <div v-if="boardcastType" class="bottom-option">
              <div @click="changeBoardcastType" class="ico keybord"></div>
              <van-button @click="boardcastOutData" round class="out-btn">Click to broadcast voice files</van-button>
            </div>
            <div v-if="!boardcastType" class="bottom-option">
              <div @click="changeBoardcastType" class="ico keybord"></div>
              <van-field v-model="boardcastText" placeholder="Please enter the broadcast text" class="bottom-text" @keyup.enter="onBoardcast" />
              <van-button @click="onBoardcast" type="primary" class="bottom-btn">Send</van-button>
            </div>
          </div>
          <!-- 问答 -->
          <div v-if="stageType == 2">
            <div v-if="qaType" class="bottom-option">
              <div @click="changeQaType" class="ico keybord"></div>
              <van-button @touchstart="onRecordStart" @touchend="onRecordEnd" round class="out-btn record-btn" :class="{active: recordStatus}" v-if="isMobile">Long press to speak</van-button>
              <van-button @mousedown="onRecordStart" @mouseup="onRecordEnd" round class="out-btn record-btn" :class="{active: recordStatus}" v-else>Long press to speak</van-button>
            </div>
            <div v-if="!qaType" class="bottom-option">
              <div @click="changeQaType" class="ico mic"></div>
              <van-field v-model="qaText" placeholder="Please enter the question text" class="bottom-text" @keyup.enter="onQa" />
              <van-button @click="onQa" type="primary" class="bottom-btn">Send</van-button>
            </div>
          </div>
        </div>
      </div>

      <div class="interactiveLoading" v-if="interactiveLoading"></div>
    </div>
  </div>

  <!-- 弹出层 -->
  <van-popup v-model:show="popupShow" position="bottom" round>
    <div class="popup-wrap">
      <h6>{{popupTitle}}</h6>
      <!-- 数字人更换 -->
      <div v-if="popupIndex === 0">
        <div style="overflow-x: scroll">
          <van-radio-group v-model="role" direction="horizontal" class="role-item-group" :style="'width:' + roleList.length + 'rem'">
            <van-radio class="role-item" v-for="item in roleList" :key="item.abName" :name="item.abName">
              <template #icon="props">
                <img :src="item.img" :data-alt="props">
                <p>{{item.name}}</p>
              </template>
            </van-radio>
          </van-radio-group>
        </div>
        <van-button @click="changeRole" class="submit-btn" size="mini" type="primary">Submit</van-button>
      </div>

      <!-- 交互类型更换 -->
      <div v-if="popupIndex === 1">
        <van-radio-group v-model="type">
          <van-radio :name="1" class="type-item">
            <template #icon="props">
              <div :id="props">
                Broadcast
              </div>
            </template>
          </van-radio>
          <van-radio :name="2" class="type-item">
            <template #icon="props">
              <div :id="props">
                Q and A
              </div>
            </template>
          </van-radio>
        </van-radio-group>
        <van-button @click="changeType" class="submit-btn" size="mini" type="primary">Submit</van-button>
      </div>

      <!-- 应用场景更换 -->
      <div v-if="popupIndex === 2">
        <van-radio-group v-model="scene">
          <van-radio :name="1" class="type-item">
            <template #icon="props">
              <div :id="props">
                Ordinary scenario
              </div>
            </template>
          </van-radio>
          <van-radio :name="2" class="type-item">
            <template #icon="props">
              <div :id="props">
                Banking Scenario
              </div>
            </template>
          </van-radio>
        </van-radio-group>
        <van-button @click="changeScene" class="submit-btn" size="mini" type="primary">Submit</van-button>
      </div>

      <!-- 关于示例 -->
      <div v-if="popupIndex === 3">
        <div class="about-banner">
          <div class="about-left">
            <div class="about-logo"></div>
            <div class="about-name">Motionverse</div>
          </div>
          <div>Version 1.0</div>
        </div>
        <p class="about-text">{{desc}}</p>
      </div>
    </div>
  </van-popup>

  <!-- 介绍单图展示 -->
  {{singleImgSrc}}
  <div class="single-img" v-if="singleImgSrc">
    <img :src="singleImgSrc" alt="">
  </div>

  <!-- Swiper -->
  <van-overlay :show="show" @click="closeSwiper" :z-index="10">
    <div class="wrapper" @click.stop>
      <div id="swiper" v-if="show">
        <swiper class="swiper" :modules="[Pagination]" :space-between="10" slides-per-view="auto" :centered-slides="true" :initialSlide="1">
          <swiper-slide class="slide" v-for="item in swiperImage" :key="item.image">
            <img :src="item.image" alt="" @click="swiperClick(item.big)">
          </swiper-slide>
        </swiper>
        <van-button @click="closeSwiper">Close</van-button>
      </div>
    </div>
  </van-overlay>

  <!-- Swiper Image -->
  <van-overlay :show="swiperBigShow" @click="closeSwiperBig" :z-index="11">
    <div class="wrapper" @click.stop>
      <div class="swiper-big">
        <van-icon name="close" @click="closeSwiperBig" color="#FFFFFF" size="40px" class="swiper-big-close" />
        <img :src="swiperBigImg" alt="">
        <van-button type="primary">Buy</van-button>
      </div>
    </div>
  </van-overlay>

  <!-- 触摸提示 -->
  <div class="touch-tips" v-if="touched == 1">
    <p>The Digital Human has been loaded</p>
    <p>Please click on the blank space to start</p>
  </div>

</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Toast } from 'vant'
import Recorder from 'recorder-core/recorder.wav.min'
import { getRole } from '@/http/api'

// swiper
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'

const desc = ref('Motionverse Digital Human Open Platform provides Digital Human PaaS & SaaS solutions, supporting Digital Humans to be driven by AI intelligent algorithms through various means such as text, speech, and motion.')

const step = ref(0) // 0:welcome 1:加载 2:demo
const roleList = ref([])
const onExperience = () => {
  step.value = 1
  getRole().then(res => {
    roleList.value = res.data
    role.value = roleList.value[0].abName
    stageRole.value = roleList.value[0].abName
  })
}

// unity 加载
const loadingNum = ref(0)
watch(loadingNum, (newValue, oldValue) => {
  if (newValue >= 100) {
    step.value = 2
    // setIframeHeight()
  }
})

/**
 * 是否移动设备
 */
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
}
checkMobile()
window.addEventListener('resize', checkMobile, false)

/**
 * 设置菜单相关
 */
const configShow = ref(false)
const actions = [
  { name: 'Digital Human Select', disabled: false },
  { name: 'Interactivity Type Select', disabled: true },
  { name: 'Scenario Select', disabled: true },
  { name: 'About', disabled: false }
]
const onSelect = (item, index) => {
  console.log(index)
  configShow.value = false
  popupIndex.value = index
  popupTitle.value = item.name
  popupShow.value = true
  // 同步选项数据
  role.value = stageRole.value
  type.value = stageType.value
  scene.value = sceneType.value
}

// 弹出层
const popupTitle = ref('')
const popupIndex = ref(0)
const popupShow = ref(false)

// 更换数字人
const role = ref('')
const stageRole = ref('')
const changeRole = () => {
  stageRole.value = role.value
  popupShow.value = false
  // console.log(stageRole.value)
  iframeDom.value.contentWindow.postMessage({ type: 'ChangeCharacter', data: stageRole.value }, '*')
}

// 更换交互类型
const type = ref(2)
const stageType = ref(1) // 1 播报 2问答
const changeType = () => {
  stageType.value = type.value
  popupShow.value = false
}

// 应用场景
const scene = ref(1)
const sceneType = ref(1) // 1普通场景 2银行场景
const changeScene = () => {
  sceneType.value = scene.value
  popupShow.value = false
  if (sceneType.value == 2) {
    stageType.value = 2
  }
}

/**
 * 播报
 */
const boardcastType = ref(true)
const boardcastText = ref('')
const changeBoardcastType = () => {
  boardcastType.value = !boardcastType.value
}

const outData = ['https://motionverse-oversea.oss-us-west-1.aliyuncs.com/temp/169217423113252177.wav']
const boardcastOutData = () => {
  iframeDom.value.contentWindow.postMessage({ type: 'AudioBroadcast', data: outData[0] }, '*')
}
const onBoardcast = () => {
  if (boardcastText.value != '') {
    iframeDom.value.contentWindow.postMessage({ type: 'TextBroadcast', data: boardcastText.value }, '*')
    interactiveLoading.value = true
    boardcastText.value = ''
  } else {
    Toast('Please enter text')
  }
}

/**
 * 问答
 */
const qaType = ref(true)
const qaText = ref('')
const changeQaType = () => {
  qaType.value = !qaType.value
}
const onQa = () => {
  if (qaText.value != '') {
    // console.log(qaText.value)
    iframeDom.value.contentWindow.postMessage({ type: 'TextAnswerMotion', data: qaText.value }, '*')
    interactiveLoading.value = true
    qaText.value = ''
  } else {
    Toast('Please enter text')
  }
}

// 录音
const rec = ref(null)
const recordStatus = ref(false)
const onRecordStart = e => {
  e.preventDefault()
  recordStatus.value = true
  rec.value = null
  let newRec = Recorder({
    type: 'wav',
    sampleRate: 16000,
    bitRate: 24,
    onProcess: recProcess
  })
  newRec.open(
    () => {
      rec.value = newRec
      rec.value.start()
      console.log('start recording')
      recPower.value = {
        buffers: [],
        powerLeverTotal: 0
      }
    },
    err => {
      console.log('Recording permission denied' + err)
    }
  )
}

// 监听录音音量
const recPower = ref({
  buffers: [],
  powerLeverTotal: 0
})
const recProcess = (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) => {
  recPower.value.buffers = buffers
  recPower.value.powerLeverTotal += powerLevel
}

const blobToDataUrl = blob => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = e => resolve(e.target.result)
    reader.onerror = err => reject(err)
  })
}

const blobToBytes = blob => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = e => resolve(e.target.result)
    reader.onerror = err => reject(err)
  })
}

const onRecordEnd = () => {
  recordStatus.value = false
  rec.value.stop(
    (blob, duration) => {
      const averagePower = recPower.value.powerLeverTotal / recPower.value.buffers.length
      console.log(`Recorded ${duration}ms，${blob.size}Bytes, average volume${averagePower}`)
      // 音量不能低于此设置
      // if (averagePower < 1) {
      //   Toast('声音异常，请重试')
      //   return
      // }
      blobToDataUrl(blob)
        .then(base64 => {
          const _base64 = base64.split('data:audio/wav;base64,')[1]
          iframeDom.value.contentWindow.postMessage({ type: 'AudioAnswerMotion', data: _base64 }, '*')
          interactiveLoading.value = true
        })
        .catch(err => {
          console.log('Recording error:' + err)
        })
      // let audioRes = {
      //   blob,
      //   size: blob.size
      // }
      // var audio = document.createElement('audio')
      // audio.controls = true
      // document.body.appendChild(audio)
      // //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
      // audio.src = (window.URL || webkitURL).createObjectURL(blob)
      // audio.play()
      rec.value.close()
      rec.value = null
    },
    err => {
      console.log('Recording failed:' + err)
      rec.value.close()
      rec.value = null
    }
  )
}

const iframeDom = ref()
onMounted(() => {
  window.addEventListener('message', receiveMessageIframePage, false)
  window.addEventListener('resize', setIframeHeight, false)
})

const receiveMessageIframePage = e => {
  if (e.data.type == 'loading') {
    loadingNum.value = Math.ceil(e.data.data * 100)
  } else if (e.data.type == 'loadAb') {
    // 交互完成loading
    interactiveLoading.value = e.data.data
    onTouched()
  } else if (e.data.type == 'playStart') {
    // 开始播放
    if (e.data.order) {
      if (e.data.answer == '近期比较优质得理财产品有：产品一，上银理财鑫享利，1个月，产品二，上银理财价值甄选100期，1点8年，产品三，上银理财双周利-14天持有。') {
        // 显示产品介绍
        showSingleImg()
      }
      if (e.data.answer == '我航有多样化理财产品满足您的需求') {
        // 显示理财购买
        show.value = true
      }
    }
    interactiveLoading.value = !e.data.data
  } else if (e.data.type == 'touch') {
    // webview收到触摸事件
    onTouched(e.data.data)
  }
}

// 固定问答
const fixedAnswer = text => {
  interactiveLoading.value = true
  iframeDom.value.contentWindow.postMessage({ type: 'TextAnswerMotion', data: text }, '*')
}

// 交互loading
const interactiveLoading = ref(false)

// 适配safari 动态设置iframe高度
const setIframeHeight = () => {
  if (document.querySelector('.header') && document.querySelector('.option-bar')) {
    const headerHeight = document.querySelector('.header').offsetHeight
    const bottomBarTop = document.querySelector('.option-bar').getBoundingClientRect().top
    document.getElementById('iframe-wrap').style.height = bottomBarTop - headerHeight + 'px'
  }
}

// 获取 url 中参数
const getQueryParams = url => {
  const paramArr = url.slice(url.indexOf('?') + 1).split('&')
  const params = {}
  paramArr.map(param => {
    const [key, val] = param.split('=')
    params[key] = decodeURIComponent(val)
  })
  return params
}

// 动态设置iframe 地址
const iframeUrl = ref('https://demo.motionverse.ai/avatar/v3.1/index.html?code=wK0IOM2EhXbA9ILCgAju8QL+FTzF7A8OLnbB3ss6WrNtg1yXMwCrppklLq6psQZMg4j0YuVYzgCKF9LA84KWp9BCspurNmwhk0HF7wPF5fXwpFjXTbhw80nZGdMa5N8+')
const prevView = ref(false) // 默认为不是motionver预览
if (getQueryParams(window.location.href).previewurl) {
  prevView.value = true
  iframeUrl.value = getQueryParams(window.location.href).previewurl + '?code=' + getQueryParams(window.location.href).code
}

// iframe显示位置
const setIframePostion = left => {
  iframeDom.value.style.left = left + 'px'
}

// 展示单图
const singleImgSrc = ref('')
const setSingleImgSrc = src => {
  singleImgSrc.value = src
}
const showSingleImg = () => {
  setIframePostion(-100)
  let index = 1
  let count = 3
  setSingleImgSrc(require('../assets/bank/icon' + index + '.jpg'))
  index++
  let timer = setInterval(() => {
    if (index <= count) {
      setSingleImgSrc(require('../assets/bank/icon' + index + '.jpg'))
      index++
    } else {
      index = 1
      clearInterval(timer)
      singleImgSrc.value = ''
      setIframePostion(0)
    }
  }, 4500)
}
// setTimeout(() => {
//   showSingleImg()
//   // setSingleImgSrc(require('../assets/bank/icon1.jpg'))
// }, 20000)
// setSingleImgSrc(require('../assets/bank/icon2.jpg'))
// setSingleImgSrc(require('../assets/bank/icon3.jpg'))

// swiper 相关
const swiperImage = [
  {
    image: require('../assets/bank/image1.jpeg'),
    big: require('../assets/bank/big1.jpeg')
  },
  {
    image: require('../assets/bank/image2.jpeg'),
    big: require('../assets/bank/big3.jpeg')
  },
  {
    image: require('../assets/bank/image3.jpeg'),
    big: require('../assets/bank/big3.jpeg')
  }
]
const show = ref(false)
const swiperClick = src => {
  showSwiperBig(src)
}
const closeSwiper = () => {
  show.value = false
  // 播报文字 请问还有什么可以帮您的吗
  iframeDom.value.contentWindow.postMessage({ type: 'TextBroadcast', data: '请问还有什么可以帮您的吗' }, '*')
}

// 预览相关
const swiperBigShow = ref(false)
const swiperBigImg = ref('')
const showSwiperBig = src => {
  swiperBigShow.value = true
  swiperBigImg.value = src
}
const closeSwiperBig = () => {
  swiperBigShow.value = false
}

// 监听webview被点击
const touched = ref(0) // 0:数字人未载入 1:数字人载入完成 2:数字人被点击
const onTouched = (touch = false) => {
  if (!interactiveLoading.value && loadingNum.value >= 100 && touched.value == 0) {
    touched.value = 1
  }
  if (touch && touched.value == 1) {
    touched.value = 2
  }
}
</script>
<style lang="scss" scoped>
#iframe-wrap {
  position: absolute;
  width: 100vw;
  height: calc(100vh - 0.5rem - 0.65rem);
  top: 0.5rem;
  left: 0;
  z-index: 1;

  &.bank {
    background: url('../assets/bank/bg_bank.jpg') no-repeat;
    background-size: 100% 100%;
  }
}
#iframeDom {
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;
  transition: all 1s;
}

.welcome {
  padding-top: 1.45rem;

  .welcome-logo {
    background: url('../assets/logo.png') no-repeat;
    width: 0.7rem;
    height: 0.7rem;
    background-size: cover;
    margin: 0 auto;
  }

  .welcome-name {
    color: #37c7f7;
    font-size: 0.18rem;
    margin-bottom: 0.3rem;
  }

  .welcome-desc {
    font-size: 0.13rem;
    color: #333;
    width: 3.35rem;
    margin: 0 auto;
    text-align: left;
    line-height: 1.6em;
  }

  .welcome-btn {
    width: 3.35rem;
    margin: 0.5rem auto 0 auto;
    background-color: #37acf7;
    color: #fff;
    border: none;
  }
}

.loading {
  background: url('../assets/img_bg@2x.jpg') no-repeat #ddd;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 10;
}

.header {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.5rem;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-wrap {
  padding: 0.2rem;
  text-align: left;
  position: relative;

  h6 {
    text-align: center;
    font-size: 0.18rem;
    padding: 0;
    margin: 0 0 0.2rem 0;
  }
}

.out-btn {
  // width: 3.05rem;
  width: calc(100vw - 0.8rem);
  color: #333;
  border: none;

  &.active {
    background-color: #eee;
  }
}

.ico {
  width: 0.25rem;
  height: 0.25rem;
  overflow: hidden;
  background-size: cover !important;

  &.keybord {
    background: url('../assets/icon_keyboard@2x.png');
  }
  &.mic {
    background: url('../assets/icon_voice@2x.png');
  }
}

.stage {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
}

.config-btn {
  position: absolute;
  right: 0.1rem;
  top: 0.15rem;
}
.buttom-bar {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 90;
  min-height: 0.65rem;

  .quick-bar {
    padding: 0.1rem;
    text-align: left;
    .tag-title {
      font-size: 0.13rem;
      color: #1989fa;
    }
    .van-tag {
      margin-right: 0.1rem;
    }
  }

  .option-bar {
    background-color: #f8f8f8;
    padding: 0.1rem;
    height: 0.45rem;
    width: calc(100vw - 0.2rem);
  }
}
.bottom-option {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .bottom-text {
    // width: 2.3rem;
    width: calc(100vw - 1.5rem);
    border-radius: 0.2rem;
  }

  .bottom-btn {
    border-radius: 0.2rem;
  }
}

.setting-ico {
  background: url('../assets/img_set up@2x.png');
  background-size: cover;
  display: block;
  width: 0.2rem;
  height: 0.2rem;
}

.about-banner {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 0.1rem 0;

  .about-left {
    display: flex;
    align-items: center;
    color: #37c7f7;
  }

  .about-logo {
    width: 0.3rem;
    height: 0.3rem;
    background-size: cover !important;
    background: url('../assets/logo.png') no-repeat;
    margin-right: 0.1rem;
  }
}
.about-text {
  font-size: 0.13rem;
}

.submit-btn {
  position: absolute;
  top: 0.15rem;
  right: 0.2rem;
  border: none;
}

.role-item-group {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;

  .role-item {
    width: 1rem;
    height: 2.2rem;
    align-items: flex-start;
    text-align: center;
    margin: 0;
    overflow: hidden;

    .van-radio__icon {
      flex: auto !important;
    }

    img {
      border-radius: 0.1rem;
      width: 0.9rem;
    }

    &[aria-checked='true'] {
      color: #37acf7;
      font-size: 0.13rem;
      img {
        border: 1px solid #37acf7;
      }
    }
  }
}

.type-item {
  height: 0.5rem;
  border: 1px solid #ccc;
  margin: 0.15rem 0;
  width: 100%;
  text-align: center;
  border-radius: 0.1rem;
  justify-content: center;
  font-size: 0.14rem !important;

  &[aria-checked='true'] {
    border-color: #37acf7;
    color: #37acf7;
  }
}

.interactiveLoading {
  background: url('../assets/loading.png') no-repeat;
  position: absolute;
  right: 5%;
  bottom: 10%;
  z-index: 1;
  width: 0.5rem;
  height: 0.5rem;
  animation: loading 2s infinite linear;
  background-size: cover;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 内容展示单图
.single-img {
  position: absolute;
  width: 1.6rem;
  overflow: hidden;
  top: 1rem;
  left: 50%;
  z-index: 5;

  img {
    width: 100%;
  }
}

#swiper {
  position: absolute;
  width: 100%;
  top: 1.5rem;
}

.swiper {
  height: 3.5rem;
  width: 3.5rem;
}

.slide {
  // @include swiper-slide();
  width: 80%;

  &.swiper-slide-prev,
  &.swiper-slide-next {
    width: 70%;
    margin-top: 5%;
  }

  img {
    width: 100%;
  }
}
.swiper-big {
  width: 3.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
  }
  .swiper-big-close {
    position: absolute;
    right: 0.1rem;
    top: -0.5rem;
  }
}

.touch-tips {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  color: #1989fa;
  box-shadow: 0 0 20px rgba($color: #000, $alpha: 0.6);
  z-index: 5;
  p {
    padding: 0;
    margin: 0;
  }
}
</style>