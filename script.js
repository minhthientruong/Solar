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
eraWidget.init({
  needRealtimeConfigs: true,
  needHistoryConfigs: true,
  needActions: false, // Không cần hành động (đèn LED)
  maxRealtimeConfigsCount: 2, // Chỉ lấy nhiệt độ và độ ẩm
  maxHistoryConfigsCount: 1,
  minRealtimeConfigsCount: 2,
  minHistoryConfigsCount: 0,

  // Nhận cấu hình từ widget
  onConfiguration: (configuration) => {
    window.configTemp = configuration.realtime_configs[0]; // Nhiệt độ
    window.configHumi = configuration.realtime_configs[1]; // Độ ẩm
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
  function setupSlider(sliderId, fillId, valueId, containerId) {
    const slider = document.getElementById(sliderId);
    const sliderFill = document.getElementById(fillId);
    const brightnessValue = document.getElementById(valueId);
    const sliderContainer = document.getElementById(containerId);

    // Cập nhật giá trị khi kéo slider
    slider.addEventListener("input", updateSlider);

    // Cập nhật giá trị khi click trực tiếp vào thanh slider
    sliderContainer.addEventListener("click", function (event) {
      const rect = sliderContainer.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newValue = Math.round((offsetX / rect.width) * 100);

      slider.value = newValue;
      updateSlider();
    });

    function updateSlider() {
      const value = slider.value;
      sliderFill.style.width = `${value}%`;
      brightnessValue.textContent = `${value}%`;
    }
  }

  // Kích hoạt điều khiển cho cả 2 card
  setupSlider(
    "brightness-slider-1",
    "slider-fill-1",
    "brightness-value-1",
    "slider-container-1"
  );
  setupSlider(
    "brightness-slider-2",
    "slider-fill-2",
    "brightness-value-2",
    "slider-container-2"
  );
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
