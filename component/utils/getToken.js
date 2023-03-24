import axios from "axios";

export default async function getToken(refreshToken) {
  const response = await axios({
    method: "get",
    url: "https://www.devyeh.com/api/user/token/refresh",
  });
  return new Promise((resolve, reject) => {
    resolve(response);
  });
}
