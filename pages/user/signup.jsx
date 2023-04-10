import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";
import Image from "next/image";

import logo from "../../asset/images/logo.png";
import { join } from "../api";
import axios from "axios";

export default function Signup() {
  const router = useRouter();

  // 회원가입 정보 유효성 검사 및 에러 메시지 출력
  const formSchema = yup.object({
    username: yup.string().required("아이디는 필수 입력 정보입니다"),
    email: yup
      .string()
      .required("이메일은 필수 입력 정보입니다 입력해주세요")
      .email("이메일 형식이 아닙니다.")
      .matches("goldenplanet.co.kr", "도메인 주소는 반드시 goldenplanet.co.kr 입니다."),
    password: yup
      .string()
      .required("영문, 숫자, 특수문자 포함 8자리를 입력해주세요.")
      .min(8, "최소 8자 이상 가능합니다")
      .max(16, "최대 20자 까지만 가능합니다")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[,./;'<>?:"~!@#$%^&*()])[a-zA-Z0-9,./;'<>?:"~!@#$%^&*()]{8,20}$/,
        "영문, 숫자, 특수문자 포함 8자리를 입력해주세요."
      ),
    nickname: yup.string().required("닉네임은 필수 입력 정보입니다"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange", resolver: yupResolver(formSchema) });

  // 회원가입 정보 제출
  const onSubmit = async (data) => {
    try {
      const res = await join(data);
      console.log(res);
      if (res.data.success === true) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.access_token}`;
        router.push("/user/signupComplete");
      } else if (res.data.success === false) {
        alert(res.data.error[0].message);
      } else {
        alert("회원가입에 실패했습니다. 잠시 후 다시 시도해 주십시오.");
      }
    } catch (e) {
      console.log(e);
      alert("회원가입에 실패했습니다. 잠시 후 다시 시도해 주십시오.");
    }
  };

  return (
    <div className="signup">
      <div className="sign_title">
        <Image src={logo} alt="yehLogo" onClick={() => router.push("/main")} />
        <span>조직문화의 개선과 소통을 위해 지금 시작해보세요</span>
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
        {errors.id && <p>{errors.id.message}</p>}
        <label htmlFor="password">비밀번호</label>
        <input
          name="password"
          type="password"
          {...register("password")}
          placeholder="비밀번호를 입력해주세요 (8 ~ 20자의 영문, 숫자, 특수문자 조합)"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          name="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="비밀번호를 한 번 더 입력해주세요"
        />
        {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
        <label htmlFor="nickname">닉네임</label>
        <input
          name="nickname"
          type="text"
          {...register("nickname")}
          placeholder="닉네임을 입력해주세요"
          autoComplete="off"
        />
        {errors.name && <p>{errors.name.message}</p>}
        <label htmlFor="email">이메일</label>
        <input
          name="email"
          type="email"
          placeholder="이메일을 입력해주세요 (user@goldenplanet.co.kr)"
          {...register("email")}
          autoComplete="off"
        />
        {errors.email && <p>{errors.email.message}</p>}
        <button type="submit" className="sign_Btn">
          가입하기
        </button>
      </form>
    </div>
  );
}
export async function getStaticProps() {
  return {
    props: {
      path: "signup",
    },
  };
}
