/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

let timerid = null;
const CountDown = ({ time, onWithdraw }: { time: number; onWithdraw: any }) => {
  const [timeText, setTimeText] = useState("");
  const formatTime = () => {
    const _time = Math.floor((time - Date.now()) / 1000);
    if (_time <= 0) {
      setTimeText("Unlocked");
      return;
    }
    let d = Math.floor(_time / 3600 / 24);
    let h = Math.floor((_time % 86400) / 3600);
    let m = Math.floor(((_time % 86400) % 3600) / 60);
    let s = _time % 60;
    setTimeText(d + ":" + h + ":" + m + ":" + s);
  };
  useEffect(() => {
    formatTime();
    if (timerid) clearInterval(timerid);
    timerid = setInterval(() => {
      formatTime();
    }, 1000);
  }, [time]);
  return (
    <>
      <div className="cursor-pointer leading-none" onClick={() => (timeText === "Unlocked" ? onWithdraw() : {})}>
        {timeText}
      </div>
      <div className="leading-none">{timeText === "Unlocked" ? "" : "Remaining"}</div>
    </>
  );
};

export default CountDown;
