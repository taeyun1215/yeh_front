
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

const userState = atom({
  key: 'userState',
  default: {name : null, loggin : false, emailAuth : false},
  effects_UNSTABLE: [persistAtom],
});


export { userState};