import service from './index'

// https://demo.deepscience.cn/poc_dev/StreamingAssets/config.json
// http://192.168.10.109:8080/config.json
export function getRole() {
  return service({
    url: 'https://demo.deepscience.cn/poc_dev/StreamingAssets/config.json',
    method: 'get'
  })
}