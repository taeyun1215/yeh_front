import axios from "axios";
import qs from "qs";
// axios.defaults.baseURL = "https://www.devyeh.com/api";
axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.withCredentials = true;

// 회원가입
const join = async (data) => {
  const result = await axios.post("/user", data);
  return result;
};

// 회원 인증 메일 전송
const joinConfirm = async () => {
  const result = await axios.post(
    "/email/certify-regis",
    {
      body: null,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result;
};

// 회원 인증 완료
const joinCheck = async (data) => {
  const result = await axios.get("/user/check-email-code", { params: data });
  return result;
};

// 로그인
const login = async (data) => {
  const result = await axios.post("/login", data, { withCredentials: true });
  return result;
};

// 유저 정보 찾기
const userFind = async (type, data) => {
  const result = await axios.get(type === "id" ? "/user/username" : "/user/password", { params: data });
  return result;
};

// 유저 마이 페이지
const myInfo = async () => {
  const result = await axios.get("/post/myPost");
  return result;
};

// 메인화면 전체 게시글 조회
const postAll = async (data) => {
  const result = await axios.get("/post/all", { params: { page: data } });
  return result;
};

// 실시간 인기글
const postRank = async () => {
  const result = await axios.get("/post/popular");
  return result;
};

// 상세 게시글 조회
const postRead = async (id) => {
  const result = await axios.get(`/post/read/${id}`);
  return result;
};

// 상세 게시글 좋아요
const postLike = async (id) => {
  const result = await axios.get(`/post/like/${id}`);
  return result;
};

// 상세 게시글 댓글 작성
const postComment = async (id, data) => {
  const result = await axios.post(`/comment/new/${id}`, data);
  return result;
};

// 상세 게시글 대댓글 작성
const postNestedComment = async (id, nestedId, data) => {
  const result = await axios.post(`/comment/reNew/${id}/${nestedId}`, data);
  return result;
};

// 게시글 삭제
const postDelete = async (id) => {
  const result = await axios.delete(`/post/delete/${id}`);
  return result;
};

// 게시글 수정
const postEdit = async (id, data) => {
  const result = await axios.put(`/post/edit/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

// 게시글 작성
const postNew = async (data) => {
  const result = await axios.post("/post/new", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

// 게시글 검색
const postSearch = async (data) => {
  const result = await axios({
    method: "post",
    url: "/post/search/",
    data: qs.stringify({
      keyword: data,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return result;
};

// 리프레시 토큰 반환
const getRefreshToken = async () => {
  const result = await axios.get("user/token/refresh");
  return result;
};

export {
  join,
  joinConfirm,
  joinCheck,
  login,
  userFind,
  myInfo,
  postAll,
  postRank,
  postRead,
  postLike,
  postComment,
  postNestedComment,
  postDelete,
  postNew,
  postSearch,
  postEdit,
  getRefreshToken,
};
