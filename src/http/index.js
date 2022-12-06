import axios from 'axios'

const service = axios.create({
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8 '
  }
})

export default service