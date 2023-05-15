import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined;
const { persistAtom } = recoilPersist({ key: "yeh", storage: sessionStorage });

// 유저 State
const userState = atom({
  key: "userState",
  default: { name: null, loggin: false, emailAuth: false },
  effects_UNSTABLE: [persistAtom],
});

// 검색 State
const keywordState = atom({
  key: "keywordState",
  default: { posts: null, postCount: 0 },
  effects_UNSTABLE: [persistAtom],
});

// 페이지 State
const pageState = atom({
  key: "pageState",
  default: 1,
});

// 테마 State
const themeState = atom({
  key: "themeState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export { userState, keywordState, pageState, themeState };
