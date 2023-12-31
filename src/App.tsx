import { useState, useEffect, useRef } from "react";
import "./App.css";

type bellRefT = {
  bellSound: HTMLAudioElement;
  kotoSound: HTMLAudioElement;
  screamSound: HTMLAudioElement;
  doorSound: HTMLAudioElement;
  kongSound: HTMLAudioElement;
  bonusSound: HTMLAudioElement;
};

enum BellType {
  Normal = "/bell2.webp",
  Bad = "/badbell1.webp",
  Door = "/badbell2.webp",
  Bonus = "/goodbell1.webp"
}

function App() {
  const effectTime = 1000; // ms
  const thousand = 1000; // よくわからん単位
  const significantDecimalPoint = 2; // タイマーの小数点以下の有効桁数
  const lustLimit = 108; // 人間がもってる煩悩の数
  const newYearText = "迎春";
  const gameOverText1 = "顔を叩いてしまった";
  const beforeTweetText = encodeURIComponent("【");
  const afterTweetText = encodeURIComponent(
    "秒】で煩悩を打ち消しました🔔\r\n\r\n迎春RTA〜誰よりも早く煩悩を打ち消せ！\r\nhttps://newyearsbell.vercel.app\r\n\r\n#迎春RTA #ラムダ技術部"
  );
  const [lustCnt, setLustCnt] = useState(0);
  // 煩悩のない人間を表す
  const [isPerfectHuman, setIsPerfectHuman] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bellType, setBellType] = useState(BellType.Normal);
  const [isCriminal, setIsCriminal] = useState(false);
  const [ringingType, setRingingType] = useState("bell ring");

  const bellRef = useRef<bellRefT>(null!);

  const gong = () => {
    if (isPerfectHuman || isCriminal) return;

    switch (bellType) {
      // 一定の確率で画面が変わる
      case BellType.Normal:
        if (lustCnt < lustLimit - 1) {
          const randomNum = Math.random();
          console.log(randomNum);
          if (randomNum < 0.05) {
            setBellType(BellType.Bad);
            // 一定時間後にBellを正常に戻す
            setTimeout(() => {
              setBellType(BellType.Normal);
            }, 400);
          }
          if (randomNum >= 0.05 && randomNum < 0.1) {
            setBellType(BellType.Door);
            setRingingType("bell door-ring");
            // 一定時間後にBellを正常に戻す
            setTimeout(() => {
              setBellType(BellType.Normal);
              setRingingType("bell ring");
            }, 1000);
          }
          if (randomNum >= 0.1 && randomNum < 0.2) {
            setBellType(BellType.Bonus);
            // 一定時間後にBellを正常に戻す
            setTimeout(() => {
              setBellType(BellType.Normal);
            }, 1000);
          }
        }
        setRingingStatuses();
        playBellSound();
        eliminateLust(1);
        break;
      case BellType.Door:
        setRingingStatuses();
        playDoorSound();
        increaseLust();
        break;
      case BellType.Bonus:
        setRingingStatuses();
        playBonusSound();
        eliminateLust(2);
        break;
      case BellType.Bad:
        setIsCriminal(true);
        bellRef.current.screamSound.play();
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

  const playDoorSound = () => {
    bellRef.current.doorSound.pause();
    // 連打対応のための頭出し
    bellRef.current.doorSound.currentTime = 1;
    bellRef.current.doorSound.play();
  };

  const playBonusSound = () => {
    bellRef.current.bonusSound.pause();
    bellRef.current.bonusSound.currentTime = 0;
    bellRef.current.bonusSound.play();
  };

  // 琴の音の初期化
  const initKotoSound = () => {
    bellRef.current.kotoSound.volume = 0;
    bellRef.current.kotoSound.play();
    bellRef.current.kotoSound.pause();
    bellRef.current.kotoSound.currentTime = 0;
    bellRef.current.kotoSound.volume = 1;
  };

  // 悲鳴の初期化
  const initScreamSound = () => {
    bellRef.current.screamSound.volume = 0;
    bellRef.current.screamSound.play();
    bellRef.current.screamSound.pause();
    bellRef.current.screamSound.currentTime = 0;
    bellRef.current.screamSound.volume = 1;
  };

  // ドアベルの初期化
  const initDoorSound = () => {
    bellRef.current.doorSound.volume = 0;
    bellRef.current.doorSound.play();
    bellRef.current.doorSound.pause();
    bellRef.current.doorSound.currentTime = 0;
    bellRef.current.doorSound.volume = 1;
  };

  const initBonusSound = () => {
    bellRef.current.bonusSound.volume = 0;
    bellRef.current.bonusSound.play();
    bellRef.current.bonusSound.pause();
    bellRef.current.bonusSound.currentTime = 0;
    bellRef.current.bonusSound.volume = 1;
  };

  // 煩悩消す作業の状態管理
  const eliminateLust = (cnt: number) => {
    if (isPerfectHuman || isCriminal) return;

    if (lustCnt + cnt >= lustLimit) {
      setIsPerfectHuman(true);
      bellRef.current.kotoSound.play();
    }

    setLustCnt(lustCnt => lustCnt + cnt);
  };

  const increaseLust = () => {
    if (isPerfectHuman || isCriminal) return;

    if (lustCnt > 0) {
      setLustCnt(lustCnt => lustCnt - 1);
    }
  };

  const handleStart = () => {
    setIsModalOpen(false);
    // iOSなどのデバイスで音を出すため、ユーザーに画面を最低一度タップしてもらう必要があり、
    // 始めるボタンを最初に鐘を叩いたと見なす
    setTimerActive(true);
    // gong();
    initKotoSound();
    initScreamSound();
    initDoorSound();
    initBonusSound;
    bellRef.current.kongSound.play();
  };

  const initBellRef = () => {
    bellRef.current = {
      bellSound: new Audio("/bell.mp3"),
      kotoSound: new Audio("/koto.mp3"),
      screamSound: new Audio("/scream.mp3"),
      doorSound: new Audio("/chime.mp3"),
      kongSound: new Audio("/kong.mp3"),
      bonusSound: new Audio("/goodbell.mp3")
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
        {isCriminal && (
          <img
            className="complete"
            src="/background_bad.webp"
            alt="ゲームオーバ"
          />
        )}
        {isPerfectHuman && (
          <img className="complete" src="/background.webp" alt="迎春" />
        )}
        {bellType === BellType.Bonus && (
            <div className="bonus-bg"></div>
        )}
        <div className="card">
          <div className={isPerfectHuman ? "endroll-message" : "counter"}>
            {isPerfectHuman
              ? newYearText
              : isCriminal
              ? gameOverText1
              : `${lustCnt}回`}
          </div>
        </div>
        <div>
          <a onClick={gong}>
            <img
              src={isCriminal ? BellType.Bad : bellType}
              className={isRinging && !isPerfectHuman ? ringingType : "bell"}
              alt="除夜の鐘"
            />
          </a>
        </div>
        <div className="card">
          {!isCriminal && (
            <div className={isPerfectHuman ? "endroll-timer" : "timer"}>{`${(
              time / thousand
            ).toFixed(significantDecimalPoint)} 秒`}</div>
          )}
          <div className="button-box">
            {isPerfectHuman && (
              <button className="reset-button">
                <a
                  href={`https://twitter.com/intent/tweet?text=${beforeTweetText}${(
                    time / thousand
                  ).toFixed(significantDecimalPoint)}${afterTweetText}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="48"
                    width="48"
                    viewBox="0 0 512 512"
                  >
                    {/* Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc." */}
                    <path
                      fill="#fff"
                      d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"
                    />
                  </svg>
                </a>
              </button>
            )}
            <button
              className="reset-button"
              onClick={
                isPerfectHuman || isCriminal ? handleReload : handleReset
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                width="48"
                viewBox="0 0 512 512"
              >
                {/* Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc. */}
                <path
                  fill="#fff"
                  d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={isModalOpen ? "modal" : "modal-close"}>
        <h1>迎春RTA</h1>
        <p className="japanese">できる限り速く鐘をタップして108回鳴らそう</p>
        <p>Ring the bell 108 times quickly to welcome the New Year</p>
        <p>快速敲108次钟来迎新年</p>
        <p className="japanese">鐘以外のものを叩いてはいけません</p>
        <p>Avoid tapping anything else</p>
        <p>不要敲锺以外的东西</p>
        <button onClick={handleStart}>始める</button>
      </div>
    </div>
  );
}

export default App;
