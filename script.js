// function updateHumidity() {
//   let humidity = Math.floor(Math.random() * 101); // Giá trị từ 0 đến 100%
//   document.getElementById("humidityValue").innerText = `${humidity}%`;

//   let neonGreen = `rgba(0, 255, 0, 1)`;
//   let fadeGreen = `rgba(0, 0, 0, 0.3)`; // Màu đen trong suốt nhẹ hơn

//   let gaugeHumidity = document.getElementById("gaugeHumidity");
//   gaugeHumidity.style.background = `conic-gradient(
//     ${neonGreen} 0%,
//     ${neonGreen} ${(humidity / 100) * 100}%,
//     ${fadeGreen} ${(humidity / 100) * 100}%,
//     ${fadeGreen} 100%
//   )`;

//   let glowIntensity = (humidity / 100) * 30;
//   gaugeHumidity.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 255, 0, 0.8)`;
// }

// function updateTemperature() {
//   let temperature = Math.floor(Math.random() * 41); // Giá trị từ 0 đến 40°C
//   document.getElementById("temperatureValue").innerText = `${temperature}°C`;

//   let neonRed = `rgba(255, 0, 0, 1)`;
//   let fadeRed = `rgba(255, 0, 0, 0.1)`;

//   let gaugeTemperature = document.getElementById("gaugeTemperature");
//   gaugeTemperature.style.background = `conic-gradient(
//     ${neonRed} 0%,
//     ${neonRed} ${(temperature / 40) * 100}%,
//     ${fadeRed} ${(temperature / 40) * 100}%,
//     ${fadeRed} 100%
//   )`;

//   let glowIntensity = (temperature / 40) * 30;
//   gaugeTemperature.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 0, 0, 0.8)`;
// }
async function fetchSensorData() {
  try {
    let response = await fetch(
      "https://mqtt1.eoh.io/api/v1/get_data/17c955f0-c03f-49ea-a776-37bb90038cb1"
    );
    let data = await response.json();

    let humidity = data.V0 || 0; // Lấy dữ liệu độ ẩm
    let temperature = data.V1 || 0; // Lấy dữ liệu nhiệt độ

    updateHumidity(humidity);
    updateTemperature(temperature);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu từ ERA:", error);
  }
}

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

// Cập nhật dữ liệu mỗi 5 giây
setInterval(fetchSensorData, 5000);

// Lấy dữ liệu ngay khi trang tải
fetchSensorData();

// Tự động cập nhật dữ liệu
setInterval(updateHumidity, 3000);
setInterval(updateTemperature, 4000);

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
