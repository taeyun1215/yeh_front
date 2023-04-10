import axios from "axios";
import { getRefreshToken } from "../../pages/api";

const setToken = async (props) => {
  const reset = props.reset;
  const router = props.router;

  const res = await getRefreshToken();
  if (res.data.success) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.access_token}`;
    return new Promise((resolve, reject) => {
      resolve("userLogin");
    });
  } else {
    alert("세션이 만료되었습니다. 다시 로그인 후 시도해 주세요");
    router.push("/user/signin");
    reset();
    return new Promise((resolve, reject) => {
      resolve("userLogout");
    });
  }
};

export default setToken;
