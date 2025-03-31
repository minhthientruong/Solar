// dữ liệu ngày giờ
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  document.getElementById("time").innerText = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  document.getElementById("date").innerText = now.toLocaleDateString(
    "en-US",
    options
  );
}

setInterval(updateDateTime, 1000);
updateDateTime(); // Gọi ngay lập tức để tránh độ trễ 1 giây ban đầu

const eraWidget = new EraWidget();
let onLivingLight = {
  action: "someActionValue", // Replace with your actual action value
};
eraWidget.init({
  needRealtimeConfigs: true,
  needHistoryConfigs: true,
  needActions: true,
  maxRealtimeConfigsCount: 2,
  maxHistoryConfigsCount: 1,
  minRealtimeConfigsCount: 2,
  minHistoryConfigsCount: 0,
  maxActionsCount: 3, // Add this to specify you need 3 actions
  minActionsCount: 3, // Add this to ensure you get at least 3 actions
  onConfiguration: (configuration) => {
    console.log("Configuration received:", configuration);
    console.log("All available actions:", configuration.actions); // Log all actions

    window.configTemp = configuration.realtime_configs[0];
    window.configHumi = configuration.realtime_configs[1];

    if (!configuration.actions) {
      console.warn("No actions received in configuration");
      return;
    }

    // Log each action's properties
    configuration.actions.forEach((action, index) => {
      console.log(`Action ${index}:`, {
        name: action.name,
        type: action.type,
        action: action.action,
        properties: action,
      });
    });

    // Try multiple ways to find the light action
    const livingLightAction = configuration.actions.find(
      (action) =>
        action.name === "living_light" ||
        action.type === "light" ||
        action.name?.includes("light") ||
        action.type?.includes("light")
    );

    if (livingLightAction) {
      onLivingLight = livingLightAction;
      console.log("Found light action:", livingLightAction);
    } else {
      console.warn("Living light action not found in configuration");
      // If no specific light action is found, use the first available action
      if (configuration.actions.length > 0) {
        onLivingLight = configuration.actions[0];
        console.log("Using first available action as fallback:", onLivingLight);
      } else {
        onLivingLight = {
          action: "default_action",
        };
      }
    }
  },

  // Cập nhật giá trị từ widget
  onValues: (values) => {
    if (window.configTemp && window.configHumi) {
      let temperature = values[window.configTemp.id]?.value ?? "N/A";
      let humidity = values[window.configHumi.id]?.value ?? "N/A";

      updateHumidity(humidity);
      updateTemperature(temperature);
    }
  },
});

// Cập nhật độ ẩm
function updateHumidity(humidity) {
  document.getElementById("humidityValue").innerText = `${humidity}%`;

  let neonGreen = `rgba(0, 255, 0, 1)`;
  let fadeGreen = `rgba(0, 0, 0, 0.3)`;

  let gaugeHumidity = document.getElementById("gaugeHumidity");
  gaugeHumidity.style.background = `conic-gradient(
    ${neonGreen} 0%,
    ${neonGreen} ${(humidity / 100) * 100}%,
    ${fadeGreen} ${(humidity / 100) * 100}%,
    ${fadeGreen} 100%
  )`;

  let glowIntensity = (humidity / 100) * 30;
  gaugeHumidity.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 255, 0, 0.8)`;
}

// Cập nhật nhiệt độ
function updateTemperature(temperature) {
  document.getElementById("temperatureValue").innerText = `${temperature}°C`;

  let neonRed = `rgba(255, 0, 0, 1)`;
  let fadeRed = `rgba(255, 0, 0, 0.1)`;

  let gaugeTemperature = document.getElementById("gaugeTemperature");
  gaugeTemperature.style.background = `conic-gradient(
    ${neonRed} 0%,
    ${neonRed} ${(temperature / 40) * 100}%,
    ${fadeRed} ${(temperature / 40) * 100}%,
    ${fadeRed} 100%
  )`;

  let glowIntensity = (temperature / 40) * 30;
  gaugeTemperature.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 0, 0, 0.8)`;
}

document.addEventListener("DOMContentLoaded", function () {
  let temperature = 20; // Giá trị nhiệt độ ban đầu
  const tempDisplay = document.getElementById("temperature");
  const increaseBtn = document.getElementById("increase-temp");
  const decreaseBtn = document.getElementById("decrease-temp");

  // Sự kiện tăng nhiệt độ
  increaseBtn.addEventListener("click", function () {
    if (temperature < 30) {
      // Giới hạn tối đa 30°C
      temperature++;
      tempDisplay.textContent = temperature + "°";
    }
  });

  // Sự kiện giảm nhiệt độ
  decreaseBtn.addEventListener("click", function () {
    if (temperature > 16) {
      // Giới hạn tối thiểu 16°C
      temperature--;
      tempDisplay.textContent = temperature + "°";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const sliderLivingRoom = document.querySelector("#brightness-slider-2");
  const valueLivingRoom = document.querySelector("#brightness-value-2");
  const sliderFillLivingRoom = document.querySelector("#slider-fill-2");

  // Verify all elements are found
  if (!sliderLivingRoom || !valueLivingRoom || !sliderFillLivingRoom) {
    console.error("Required DOM elements not found!");
    return;
  }

  // Check if eraWidget exists
  if (typeof eraWidget === "undefined") {
    console.error(
      "eraWidget is not defined - check if the widget script is loaded correctly"
    );
    return;
  }

  sliderLivingRoom.addEventListener("input", function () {
    const value = parseFloat(this.value);
    sliderFillLivingRoom.style.width = value + "%";
    valueLivingRoom.textContent = value + "%";

    if (onLivingLight && onLivingLight.action) {
      try {
        eraWidget.triggerAction(onLivingLight.action, null, { value: value });
      } catch (error) {
        console.error("Error triggering action:", error);
      }
    } else {
      console.error("onLivingLight or onLivingLight.action is not defined");
    }
  });
});

// Đo nhiệt độ
const ctx = document.getElementById("energyChart").getContext("2d");

// Đảm bảo khai báo và sử dụng biến chỉ trong phạm vi này
(function () {
  const energyData = [50, 60, 55, 70, 80, 65, 90]; // Giả sử là mức tiêu thụ điện trong tuần

  // Tạo chart
  const energyChart = new Chart(ctx, {
    type: "bar", // Kiểu đồ thị là thanh
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Các ngày trong tuần
      datasets: [
        {
          label: "Energy Consumption (kWh)",
          data: energyData, // Dữ liệu mức tiêu thụ điện
          backgroundColor: "rgba(128, 0, 128, 0.5)", // Màu sắc cho các thanh
          borderColor: "rgba(128, 0, 128, 1)", // Màu viền cho các thanh
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
})();

// Giao diện xem camera
function toggleFullScreen() {
  let video = document.getElementById("cameraFeed");
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const door = document.querySelector("img[src='assets/img/door-garage.png']");
  const btnUp = document.getElementById("open-door");
  const btnDown = document.getElementById("close-door");
  const btnPause = document.querySelector(".bg-red-900"); // Nút dừng

  let position = 0; // Vị trí hiện tại của cửa
  let direction = 0; // 1 = lên, -1 = xuống, 0 = dừng
  let animationFrame;

  function moveDoor() {
    if (direction !== 0) {
      position += direction * 2; // Tăng giảm vị trí
      door.style.transform = `translateY(${position}px)`;

      if (position > 50) position = 50; // Giới hạn cửa không đi quá cao
      if (position < -100) position = -100; // Giới hạn cửa không đi quá thấp

      animationFrame = requestAnimationFrame(moveDoor);
    }
  }

  btnUp.addEventListener("click", () => {
    direction = -1;
    cancelAnimationFrame(animationFrame);
    moveDoor();
  });

  btnDown.addEventListener("click", () => {
    direction = 1;
    cancelAnimationFrame(animationFrame);
    moveDoor();
  });

  btnPause.addEventListener("click", () => {
    direction = 0;
    cancelAnimationFrame(animationFrame);
  });
});
