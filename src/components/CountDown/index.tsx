import { useEffect, useState } from "react";

let timerid = null;

const CountDown = ({ time, finishedText }: { time: number; finishedText?: string }) => {
  const [timeText, setTimeText] = useState("");
  const formatNumber = (date) => {
    return ("0" + date.toString()).slice(-2);
  };

  useEffect(() => {
    const formatTime = () => {
      const _time = Math.floor((time - Date.now()) / 1000);
      if (_time <= 0) {
        setTimeText(finishedText);
        return;
      }
      let d = Math.floor(_time / 3600 / 24);
      let h = Math.floor((_time % 86400) / 3600);
      let m = Math.floor(((_time % 86400) % 3600) / 60);
      let s = _time % 60;

      setTimeText(formatNumber(d) + ":" + formatNumber(h) + ":" + formatNumber(m) + ":" + formatNumber(s));
    };

    timerid = setInterval(() => {
      formatTime();
    }, 1000);

    return () => {
      clearInterval(timerid);
    };
  }, [finishedText, time]);

  return <div className="leading-none">{timeText}</div>;
};

export default CountDown;
