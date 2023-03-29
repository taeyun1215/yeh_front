import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCookies } from "react-cookie";
import Image from "next/image";
import axios from "axios";

import logo from "../../asset/images/logo.png";
import { pageState, userState } from "../../store/states";
import { login } from "../api";

export default function Signiin() {
  const router = useRouter();
  const setUser = useSetRecoilState(userState);
  const PageHandler = useSetRecoilState(pageState);
  const [cookies, setCookie] = useCookies(["refreshToken"]);

  const expires = new Date();
  expires.setHours(expires.getHours() + 2);

  const formSchema = yup.object({
    username: yup.string().required(""),
    password: yup.string().required(""),
  });

  const { register, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      const res = await login(formData);
      if (res.data.success === true) {
        const response = res.data.data;
        const accessToken = response.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        setUser({
          name: response.nickname,
          loggin: true,
          emailAuth: response.emailVerified,
        });
        PageHandler(1);
        router.push("/main");
      } else {
        alert(res.data.error.message);
      }
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="sign">
      <div className="sign_title">
        <Image
          src={logo}
          alt="yehLogo"
          onClick={() => router.push("/main", undefined, { shallow: true })}
          style={{ cursor: "pointer" }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="sign_contents">
        <label htmlFor="username">아이디</label>
        <input
          name="username"
          type="text"
          {...register("username")}
          placeholder="아이디를 입력해주세요"
          autoComplete="off"
        />
        <label htmlFor="password">비밀번호</label>
        <input name="password" type="password" {...register("password")} placeholder="비밀번호를 입력해주세요" />
        <button type="submit" className="sign_Btn" style={{ marginTop: "50px" }}>
          로그인
        </button>
      </form>
      <div className="sign_Etc_Btn">
        <button onClick={() => router.push({ pathname: "/user/userFind", query: { type: "id" } })}>아이디 찾기</button>
        <span>|</span>
        <button
          onClick={() =>
            router.push({
              pathname: "/user/userFind",
              query: { type: "password" },
            })
          }
        >
          비밀번호 찾기
        </button>
        <span>|</span>
        <button onClick={() => router.push("/user/signup")}>회원가입</button>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      path: "signin",
    },
  };
}
