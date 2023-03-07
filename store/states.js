
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

const userState = atom({
  key: 'userState',
  default: {name : null, loggin : false, emailAuth : false},
  effects_UNSTABLE: [persistAtom],
});
const keywordState = atom({
  key: 'keywordState',
  default: {posts : null, postCount : 0},
  effects_UNSTABLE: [persistAtom],
});
const pageState = atom({
  key: 'pageState',
  default: 1,
  effects_UNSTABLE: [persistAtom],
})
export { userState, keywordState, pageState};