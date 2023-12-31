import { useState, useEffect, useRef } from "react";
import "./App.css";

type bellRefT = {
  bellSound: HTMLAudioElement;
  kotoSound: HTMLAudioElement;
};

enum BellType {
  Normal = "/bell2.webp",
  Bad = "/badbell1.webp"
}

function App() {
  const effectTime = 1000; // ms
  const thousand = 1000; // よくわからん単位
  const significantDecimalPoint = 2; // タイマーの小数点以下の有効桁数
  const lustLimit = 108; // 人間がもってる煩悩の数
  const newYearText = "迎春";

  const [lustCnt, setLustCnt] = useState(0);
  // 煩悩のない人間を表す
  const [isPerfectHuman, setIsPerfectHuman] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bellType, setBellType] = useState(BellType.Normal);
  const [isCriminal, setIsCriminal] = useState(false);

  const bellRef = useRef<bellRefT>(null!);

  const gong = () => {
    if (isPerfectHuman) return;

    switch (bellType) {
      // 一定の確率で画面が変わる
      case BellType.Normal:
        if (Math.random() < 0.1) {
          setBellType(BellType.Bad);
          // 300 - 500ms後にBellを正常に戻す
          setTimeout(() => {
            setBellType(BellType.Normal);
          }, Math.floor(Math.random() * (500 - 300 + 1)) + 300);
        }
        setRingingStatuses();
        playBellSound();
        eliminateLust();
        break;
      case BellType.Bad:
        setIsCriminal(true);
        break;
    }
  };

  // 鐘の状態管理
  const setRingingStatuses = () => {
    setIsRinging(true);

    setTimeout(() => {
      setIsRinging(false);
    }, effectTime);
  };

  // 鐘をゴーン
  const playBellSound = () => {
    bellRef.current.bellSound.pause();
    // 連打対応のための頭出し
    bellRef.current.bellSound.currentTime = 1;
    bellRef.current.bellSound.play();
  };

  // 琴の音の初期化
  const initKotoSound = () => {
    bellRef.current.kotoSound.volume = 0;
    bellRef.current.kotoSound.play();
    bellRef.current.kotoSound.pause();
    bellRef.current.kotoSound.currentTime = 0;
    bellRef.current.kotoSound.volume = 1;
  };

  // 煩悩消す作業の状態管理
  const eliminateLust = () => {
    if (isPerfectHuman) return;

    if (lustCnt + 1 >= lustLimit) {
      setIsPerfectHuman(true);
      bellRef.current.kotoSound.play();
    }

    setLustCnt(lustCnt => lustCnt + 1);
  };

  const handleStart = () => {
    setIsModalOpen(false);
    // iOSなどのデバイスで音を出すため、ユーザーに画面を最低一度タップしてもらう必要があり、
    // 始めるボタンを最初に鐘を叩いたと見なす
    setTimerActive(true);
    gong();
    initKotoSound();
  };

  const initBellRef = () => {
    bellRef.current = {
      bellSound: new Audio("/bell.mp3"),
      kotoSound: new Audio("/koto.mp3")
    };
  };

  const handleReset = () => {
    setIsPerfectHuman(false);
    setIsModalOpen(true);
    setLustCnt(0);
    setTimerActive(false);
    setTime(0);
  };

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    // 初期化のとき一度だけrefの値を設定する。
    initBellRef();

    let timeout: number;

    if (timerActive) {
      const tick = () => {
        setTime(prevTime => prevTime + 10);
        timeout = setTimeout(tick, 10);
      };

      if (lustCnt !== lustLimit) {
        tick();
      }
    }

    return () => clearTimeout(timeout);
  }, [timerActive, lustCnt]);

  return (
    <div className="App">
      <div className={isModalOpen ? "bg" : ""}>
        {isCriminal && <div className="counter">{"犯罪者です"}</div>}
        {isPerfectHuman && (
          <img className="complete" src="/background.webp" alt="迎春" />
        )}
        <div className="card">
          <div className="counter">
            {isPerfectHuman ? newYearText : `${lustCnt}回`}
          </div>
        </div>
        <div>
          <a onClick={gong}>
            <img
              src={bellType}
              className={isRinging && !isPerfectHuman ? "bell ring" : "bell"}
              alt="除夜の鐘"
            />
          </a>
        </div>
        <div className="card">
          <div className="timer">{`${(time / thousand).toFixed(
            significantDecimalPoint
          )} 秒`}</div>
          <button
            className="reset-button"
            onClick={isPerfectHuman ? handleReload : handleReset}
          >
            やり直す
          </button>
        </div>
      </div>
      <div className={isModalOpen ? "modal" : "modal-close"}>
        <button onClick={handleStart}>始める</button>
      </div>
    </div>
  );
}

export default App;
