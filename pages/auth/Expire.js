import { userState } from "../../store/states";
import { useRecoilValue , useResetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useEffect } from "react";
import setToken from "./setToken";

export default function Expire (props) {
    const Props = props.data
    // const router = useRouter();
    const user = useRecoilValue(userState)
    const reset = useResetRecoilState(userState)

    useEffect(() => {
        if(user.loggin) {
            if(!user.emailAuth) {
                if(confirm('YEH의 모든 기능 사용을 위해 이메일 인증을 완료해 주세요.')) router.push("/user/signupComplete");
                else useRouter().push("/");
            } else if(Props === null) {
                reset();
                if(Confirm = confirm('세션이 만료되었습니다. 다시 로그인 후 시도해 주세요'))useRouter().push("/user/signin");
                else useRouter().push("/");
            } else setToken(Props)
        } else {
            if(confirm('로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다.')) useRouter().push("/user/signin");
            else useRouter().push("/");
        }
        
    },[Props])

    return (
        <></>
    )
}