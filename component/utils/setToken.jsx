import axios from "axios";
import { getRefreshToken } from "../../pages/api";
import { resetRecoil } from "recoil-nexus";
import { userState } from "../../store";

const setToken = async () => {
  const res = await getRefreshToken();
  if (res.data.success) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.access_token}`;
    return new Promise((resolve, reject) => {
      resolve("userLogin");
    });
  } else {
    alert("세션이 만료되었습니다. 다시 로그인 후 시도해 주세요");
    window.location.href = "/user/signin";
    resetRecoil(userState);
    return new Promise((resolve, reject) => {
      resolve("userLogout");
    });
  }
};

export default setToken;
