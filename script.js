function updateHumidity() {
  let humidity = Math.floor(Math.random() * 101); // Giá trị từ 0 đến 100%
  document.getElementById("humidityValue").innerText = `${humidity}%`;

  let neonGreen = `rgba(0, 255, 0, 1)`;
  let fadeGreen = `rgba(0, 0, 0, 0.3)`; // Màu đen trong suốt nhẹ hơn

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

function updateTemperature() {
  let temperature = Math.floor(Math.random() * 41); // Giá trị từ 0 đến 40°C
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
