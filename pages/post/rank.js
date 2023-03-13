import { useEffect, useState } from "react";
import axios from "axios";

export default function Rank() {
  const [rankigData, setRankingData] = useState([]);

  useEffect(() => {
    async function getRankings() {
      const res = await axios.get("/post/popular");
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
        <div className="rankingContents" key={i.id}>
          <p className="index">{index + 1}</p>
          <p className="title">{i.title}</p>
        </div>
      ))}
    </div>
  );
}
