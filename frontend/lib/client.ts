import axios from "axios"

const client = axios.create({
  headers: { "Content-Type": "application/json" },
})

client.interceptors.response.use(
  (res) => {
    if (res.data?.success === false)
      return Promise.reject(new Error(res.data.error?.message || "Request failed"))
    if (res.data?.success === true) res.data = res.data.data
    return res
  },
  (err) => {
    if (err.response?.data) {
      const body = err.response.data
      const msg = body.error?.message || body.message || err.response.statusText
      return Promise.reject(new Error(msg))
    }
    if (err.request) return Promise.reject(new Error("No response from server"))
    return Promise.reject(err)
  },
)

export default client
