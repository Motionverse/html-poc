<template>
  <router-view />
</template>

<style lang="scss">
html {
  font-size: 26.66666667vw;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.18rem;
}
body {
  background: url('./assets/img_bg@2x.jpg') no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
</style>
<script>
const setRem = () => {
  const _width = document.documentElement.clientWidth
  if (_width > 720) {
    document.documentElement.style.fontSize = '120px'
  } else {
    document.documentElement.style.fontSize = '26.66666667vw'
  }
}
setRem()
window.addEventListener('resize', setRem, false)
</script>