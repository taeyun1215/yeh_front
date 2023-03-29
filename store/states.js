import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

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
export { userState, keywordState, pageState };
