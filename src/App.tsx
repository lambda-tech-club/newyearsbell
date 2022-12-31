import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isRinging, setRinging] = useState(false);
  const [hasPermission, setPermission] = useState(false);
  const bell = new Audio("/bell.wav");
  const effectTime = 3000;
  const threshold = 5;

  // 鐘を鳴らす処理
  const ring = () => {
    if (isRinging) return;
    setRinging(true);
    setCount(count => count + 1);
    bell.pause();
    bell.currentTime = 0;
    bell.play();
    setTimeout(() => {
      setRinging(false);
    }, effectTime);
  };

  // 加速度が一定を超えたら
  const handleDevicemotion = (e) => {
    if (e.acceleration.x > threshold) {
      ring();
    }
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
        <a onClick={ring}>
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
