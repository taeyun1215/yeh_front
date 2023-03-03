import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue , useResetRecoilState } from "recoil";
import axios from "axios";
import cookies from "next-cookies";
import cookie from "react-cookies";
import Image from "next/image";

import { userState } from "../../store/states";
import getToken from "../../component/utils/getToken";
import setToken from "../../component/utils/setToken";
import CreateTime from "../../component/utils/createTime";

export default function Details(props) {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const reset = useResetRecoilState(userState);
    const [datailData, setDetailData] = useState([]);

    useEffect(() => {
        setToken({user, props}).then((res) => {
            if(res === 'logout') {
              reset();
              router.push("/user/signin");
            }
        })
        async function getPostView() {
        const token = cookie.load("accessToken");
        const res = await axios.get(`/post/read/${router.query.id}`, {
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        if(res.data.success) setDetailData(res.data.data)
        else alert('잠시 후 다시 접속해주세요')
       }
       try {
            getPostView();
       } catch(e) {
            console.log(e)
            alert('잠시 후 다시 접속해주세요')
       }
    },[]);
    return (
        <div className="detailPost">
            <h2>{datailData.title}</h2>
            <p>{CreateTime(datailData.createTime)}</p>
            <p>{datailData.writer}</p>
            {/* {datailData.images[0] !== null ? datailData.images.map((i) => (
              <Image src={i.imageUrl} key={i.id}/>
            )) : null} */}
            <p>{datailData.content}</p>
            <p>{datailData.view}</p>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const allCookies = cookies(ctx);
    if(allCookies.refreshToken) {
      const res = await getToken(allCookies.accessToken, allCookies.refreshToken)
      const data = res.data
      return {
        props: {
          name : "detail",
          data : data  
        },
      };
    } else return {
      props: {
        name : "detail",
        data : null  
      },
    } 
  }