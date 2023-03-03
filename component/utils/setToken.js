import cookie from "react-cookies";
import { HTTP_ONLY } from "../../config/config";

const setToken = (props) => {
    const user = props.user
    const data = props.props.data;

    if(user.loggin && data === null) {
        alert('세션이 만료되었습니다. 다시 로그인 후 시도해 주세요')
        return new Promise((resolve, reject) => {
            resolve('logout')
        })
    } 
    else if(user.loggin && data !== null) {
        console.log('login')
        const accessToken = data.data.access_token
        const refreshToken = data.data.refresh_token
        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + 3);
        cookie.save("accessToken", accessToken, {
            httpOnly: HTTP_ONLY,
            path: "/",
            expires : expires
        });
            cookie.save("refreshToken", refreshToken, {
            httpOnly: HTTP_ONLY,
            path: "/",
        });
        return new Promise((resolve, reject) => {
            resolve('login')
        })
      }    
    else return new Promise((resolve, reject) => {
        resolve('notUser')
    })
  }
  
  export default setToken
  