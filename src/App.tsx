import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isRinging, setIsRinging] = useState(false);
  const [hasPermission, setPermission] = useState(false);
  const effectTime = 1000; // ms
  const threshold = 10;
  const bellRef = useRef();
  const isRingingRef = useRef();

  const ring = () => {
    setRingingStatuses();
    gong();
    setCount(count => count + 1);
  };

  // 鐘をゴーン
  const gong = () => {
    bellRef.current.pause();
    bellRef.current.currentTime = 0;
    bellRef.current.play();
  };

  // 鐘の状態管理
  const setRingingStatuses = () => {
    // EventListenerで鐘の状態を取得する必要があるため、
    // レンダリング用のisRingingと別にUseRefでも管理する。
    isRingingRef.currnet = true;
    setIsRinging(true);

    setTimeout(() => {
      isRingingRef.currnet = false;
      setIsRinging(false);
    }, effectTime);
  };

  // 加速度が一定を超えたら
  const handleDevicemotion = e => {
    if (isRingingRef.currnet) return;

    if (
      e.acceleration.x > threshold ||
      e.acceleration.y > threshold ||
      e.acceleration.z > threshold
    )
      ring();
  };

  // 加速度センサーの使用許可を取得
  const handlePermissionRequest = () => {
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

  useEffect(() => {
    // 初期化のとき一度だけrefの値を設定する。
    isRingingRef.currnet = false;
    bellRef.current = new Audio("/bell.mp3");

    if (window.DeviceOrientationEvent) {
      if (
        DeviceOrientationEvent.requestPermission &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
      } else {
        setPermission(true);
        window.addEventListener("devicemotion", handleDevicemotion);
      }
    }
  }, []);

  return (
    <div className="App">
      <div>
        <a onClick={isRinging ? null : ring}>
          <img
            src="/bell.png"
            className={isRinging ? "bell ring" : "bell"}
            alt="除夜の鐘"
          />
        </a>
      </div>

      <div className="card">
        <div className="counter">{`${count}回`}</div>
        {!hasPermission && (
          <button onClick={handlePermissionRequest}>Permission Request</button>
        )}
      </div>
      <p className="read-the-docs">端末を振ると鐘が鳴ります</p>
    </div>
  );
}

export default App;
