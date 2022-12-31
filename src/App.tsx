import { useState, useEffect, useRef } from "react";
import "./App.css";

type bellRefT = {
  bellSound: HTMLAudioElement;
  kotoSound: HTMLAudioElement;
  isRinging: boolean;
};

function App() {
  const effectTime = 1000; // ms
  const threshold = 10; // よくわからん単位
  const lustLimit = 108; // 人間がもってる煩悩の数
  const bellSoundText = "ゴーン";
  const newYearText = "迎春";

  const [lustCnt, setLustCnt] = useState(0);
  // 煩悩のない人間を表す
  const [isPerfectHuman, setIsPerfectHuman] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [hasPermission, setPermission] = useState(false);

  const bellRef = useRef<bellRefT>(null!);

  const gong = () => {
    if (bellRef.current.isRinging) return;

    setRingingStatuses();
    playBellSound();
    eliminateLust();
  };

  // 鐘の状態管理
  const setRingingStatuses = () => {
    // EventListenerで鐘の状態を取得する必要があるため、
    // レンダリング用のisRingingと別にUseRefでも管理する。
    bellRef.current.isRinging = true;
    setIsRinging(true);

    setTimeout(() => {
      bellRef.current.isRinging = false;
      setIsRinging(false);
    }, effectTime);
  };

  // 鐘をゴーン
  const playBellSound = () => {
    bellRef.current.bellSound.pause();
    bellRef.current.bellSound.currentTime = 0;
    bellRef.current.bellSound.play();
  };

  // 煩悩消す作業の状態管理
  const eliminateLust = () => {
    if (isPerfectHuman) return;

    if (lustCnt + 1 === lustLimit) {
      setIsPerfectHuman(true);
      bellRef.current.kotoSound.play();
    }

    setLustCnt(lustCnt => lustCnt + 1);
  };

  const handleStart = () => {
    setIsModalOpen(false);
    // iOSなどのデバイスで音を出すため、ユーザーに画面を最低一度タップしてもらう必要があり、
    // 始めるボタンを最初に鐘を叩いたと見なす
    gong();
  };

  // 加速度が一定を超えたら
  const handleDevicemotion = e => {
    if (
      e.acceleration.x > threshold ||
      e.acceleration.y > threshold ||
      e.acceleration.z > threshold
    )
      gong();
  };

  // 加速度センサーの使用許可を取得
  const handleSensorPermissionRequest = () => {
    DeviceOrientationEvent.requestPermission()
      .then(function(response) {
        if (response === "granted") {
          setPermission(true);
          window.addEventListener("devicemotion", handleDevicemotion);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const initBellRef = () => {
    bellRef.current = {
      isRinging: false,
      bellSound: new Audio("/bell.mp3"),
      kotoSound: new Audio("/koto.mp3")
    };
  };

  useEffect(() => {
    // 初期化のとき一度だけrefの値を設定する。
    initBellRef();

    if (window.DeviceOrientationEvent) {
      if (
        DeviceOrientationEvent.requestPermission &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        setPermission(false);
      } else {
        setPermission(true);
        window.addEventListener("devicemotion", handleDevicemotion);
      }
    }
  }, []);

  return (
    <div className="App">
      <div className="center">
        {isRinging ? bellSoundText : isPerfectHuman ? newYearText : ""}
      </div>
      <div className={isModalOpen ? "bg" : ""}>
        {isPerfectHuman && (
          <img className="complete" src="/background.webp" alt="迎春" />
        )}
        <div>
          <a onClick={gong}>
            <img
              src="/bell.webp"
              className={isRinging && !isPerfectHuman ? "bell ring" : "bell"}
              alt="除夜の鐘"
            />
          </a>
        </div>

        <div className="card">
          <div className="counter">{`${lustCnt}回`}</div>
        </div>
        <p className="read-the-docs">端末を振ると鐘が鳴ります</p>
      </div>
      <div className={isModalOpen ? "modal" : "modal-close"}>
        <p className="modal-text">端末を振って鐘を鳴らそう</p>
        {!hasPermission ? (
          <button
            onClick={
              hasPermission ? handleStart : handleSensorPermissionRequest
            }
          >
            センサーを起動
          </button>
        ) : (
          <button onClick={handleStart}>始める</button>
        )}
      </div>
    </div>
  );
}

export default App;
