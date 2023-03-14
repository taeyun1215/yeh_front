
import getToken from "./getToken";

const setToken = async (props) => {
    const cookie =  props.cookie
    const setCookie = props.setCookie;
    const reset = props.reset;
    const router = props.router

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 30);

    const response = await getToken(cookie.refreshToken)
    if(response.data.success) {
        // 쿠키에 리프레시 토큰 저장 배포 때는 httponly true 바꾸기
        setCookie('accessToken', response.data.data.access_token, {expires : expires, httpOnly : true} )
        return new Promise((resolve, reject) => {
            resolve('userLogin')
        })
    } else {
        alert('세션이 만료되었습니다. 다시 로그인 후 시도해 주세요');
        router.push("/user/signin");
        reset();
        return new Promise((resolve, reject) => {
            resolve('userLogout')
        })
    }
  } 
  

  
  
  export default setToken
  