import axios from "axios";

export default async function getToken (refreshToken) {
  const response = await axios({
    method: "get",
    url: "https://www.devyeh.com/api/api/token/refresh",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    withCredentials : true
  })
  return new Promise((resolve, reject) => {
    resolve(response)
})
}

