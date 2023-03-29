import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { postRank } from "../api";

export default function Rank() {
  const router = useRouter();
  const [rankigData, setRankingData] = useState([]);

  useEffect(() => {
    async function getRankings() {
      const res = await postRank();

      if (res.data.success) setRankingData(res.data.data);
      else alert("잠시 후 다시 접속해주세요");
    }
    try {
      getRankings();
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 접속해주세요");
    }
  }, []);

  return (
    <div className="ranking">
      <p className="rankingTitle">실시간 인기글</p>
      {rankigData.map((i, index) => (
        <div
          className="rankingContents"
          key={i.id}
          onClick={() =>
            router.push({
              pathname: "/post/read",
              query: { id: i.id },
            })
          }
        >
          <p className="index">{index + 1}</p>
          <p className="title">{i.title}</p>
        </div>
      ))}
    </div>
  );
}
