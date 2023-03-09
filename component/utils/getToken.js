import axios from "axios";

export default async function getToken (refreshToken) {
  const response = await axios({
    method: "get",
    url: "http://43.201.144.113:8080/api/token/refresh",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  })
  return new Promise((resolve, reject) => {
    resolve(response)
})
}

