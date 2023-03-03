import axios from "axios";

export default async function getToken (accessToken, refreshToken) {
  const response = await axios({
    method: "get",
    // url: "http://130.162.159.231:8080/api/token/refresh",
    url: "http://43.201.144.113:8080/api/token/refresh",
    headers: {
      Authorization: `Bearer ${accessToken !== undefined ? accessToken : refreshToken}`,
    },
  })
    return response
}

