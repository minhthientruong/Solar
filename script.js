// // dữ liệu ngày giờ
// function updateDateTime() {
//   const now = new Date();
//   const options = {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   };

//   document.getElementById("time").innerText = now.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });

//   document.getElementById("date").innerText = now.toLocaleDateString(
//     "en-US",
//     options
//   );
// }

// setInterval(updateDateTime, 1000);
// updateDateTime(); // Gọi ngay lập tức để tránh độ trễ 1 giây ban đầu

// const eraWidget = new EraWidget();
// let onLivingLight = {
//   action: "someActionValue", // Replace with your actual action value
// };
// eraWidget.init({
//   needRealtimeConfigs: true,
//   needHistoryConfigs: true,
//   needActions: true,
//   maxRealtimeConfigsCount: 2,
//   maxHistoryConfigsCount: 1,
//   minRealtimeConfigsCount: 2,
//   minHistoryConfigsCount: 0,
//   maxActionsCount: 3, // Add this to specify you need 3 actions
//   minActionsCount: 3, // Add this to ensure you get at least 3 actions
//   onConfiguration: (configuration) => {
//     console.log("Configuration received:", configuration);
//     console.log("All available actions:", configuration.actions); // Log all actions

//     window.configTemp = configuration.realtime_configs[0];
//     window.configHumi = configuration.realtime_configs[1];

//     if (!configuration.actions) {
//       console.warn("No actions received in configuration");
//       return;
//     }

//     // Log each action's properties
//     configuration.actions.forEach((action, index) => {
//       console.log(`Action ${index}:`, {
//         name: action.name,
//         type: action.type,
//         action: action.action,
//         properties: action,
//       });
//     });

//     // Try multiple ways to find the light action
//     const livingLightAction = configuration.actions.find(
//       (action) =>
//         action.name === "living_light" ||
//         action.type === "light" ||
//         action.name?.includes("light") ||
//         action.type?.includes("light")
//     );

//     if (livingLightAction) {
//       onLivingLight = livingLightAction;
//       console.log("Found light action:", livingLightAction);
//     } else {
//       console.warn("Living light action not found in configuration");
//       // If no specific light action is found, use the first available action
//       if (configuration.actions.length > 0) {
//         onLivingLight = configuration.actions[0];
//         console.log("Using first available action as fallback:", onLivingLight);
//       } else {
//         onLivingLight = {
//           action: "default_action",
//         };
//       }
//     }
//   },

//   // Cập nhật giá trị từ widget
//   onValues: (values) => {
//     if (window.configTemp && window.configHumi) {
//       let temperature = values[window.configTemp.id]?.value ?? "N/A";
//       let humidity = values[window.configHumi.id]?.value ?? "N/A";

//       updateHumidity(humidity);
//       updateTemperature(temperature);
//     }
//   },
// });

// // Cập nhật độ ẩm
// function updateHumidity(humidity) {
//   document.getElementById("humidityValue").innerText = `${humidity}%`;

//   let neonGreen = `rgba(0, 255, 0, 1)`;
//   let fadeGreen = `rgba(0, 0, 0, 0.3)`;

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

// // Cập nhật nhiệt độ
// function updateTemperature(temperature) {
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

// document.addEventListener("DOMContentLoaded", function () {
//   let temperature = 20; // Giá trị nhiệt độ ban đầu
//   const tempDisplay = document.getElementById("temperature");
//   const increaseBtn = document.getElementById("increase-temp");
//   const decreaseBtn = document.getElementById("decrease-temp");

//   // Sự kiện tăng nhiệt độ
//   increaseBtn.addEventListener("click", function () {
//     if (temperature < 30) {
//       // Giới hạn tối đa 30°C
//       temperature++;
//       tempDisplay.textContent = temperature + "°";
//     }
//   });

//   // Sự kiện giảm nhiệt độ
//   decreaseBtn.addEventListener("click", function () {
//     if (temperature > 16) {
//       // Giới hạn tối thiểu 16°C
//       temperature--;
//       tempDisplay.textContent = temperature + "°";
//     }
//   });
// });
// document.addEventListener("DOMContentLoaded", function () {
//   const sliderLivingRoom = document.querySelector("#brightness-slider-2");
//   const valueLivingRoom = document.querySelector("#brightness-value-2");
//   const sliderFillLivingRoom = document.querySelector("#slider-fill-2");

//   // Verify all elements are found
//   if (!sliderLivingRoom || !valueLivingRoom || !sliderFillLivingRoom) {
//     console.error("Required DOM elements not found!");
//     return;
//   }

//   // Check if eraWidget exists
//   if (typeof eraWidget === "undefined") {
//     console.error(
//       "eraWidget is not defined - check if the widget script is loaded correctly"
//     );
//     return;
//   }

//   sliderLivingRoom.addEventListener("input", function () {
//     const value = parseFloat(this.value);
//     sliderFillLivingRoom.style.width = value + "%";
//     valueLivingRoom.textContent = value + "%";

//     if (onLivingLight && onLivingLight.action) {
//       try {
//         eraWidget.triggerAction(onLivingLight.action, null, { value: value });
//       } catch (error) {
//         console.error("Error triggering action:", error);
//       }
//     } else {
//       console.error("onLivingLight or onLivingLight.action is not defined");
//     }
//   });
// });

// // Đo nhiệt độ
// const ctx = document.getElementById("energyChart").getContext("2d");

// // Đảm bảo khai báo và sử dụng biến chỉ trong phạm vi này
// (function () {
//   const energyData = [50, 60, 55, 70, 80, 65, 90]; // Giả sử là mức tiêu thụ điện trong tuần

//   // Tạo chart
//   const energyChart = new Chart(ctx, {
//     type: "bar", // Kiểu đồ thị là thanh
//     data: {
//       labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Các ngày trong tuần
//       datasets: [
//         {
//           label: "Energy Consumption (kWh)",
//           data: energyData, // Dữ liệu mức tiêu thụ điện
//           backgroundColor: "rgba(128, 0, 128, 0.5)", // Màu sắc cho các thanh
//           borderColor: "rgba(128, 0, 128, 1)", // Màu viền cho các thanh
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       scales: {
//         y: {
//           beginAtZero: true,
//           max: 100,
//         },
//       },
//     },
//   });
// })();

// // Giao diện xem camera
// function toggleFullScreen() {
//   let video = document.getElementById("cameraFeed");
//   if (!document.fullscreenElement) {
//     video.requestFullscreen();
//   } else {
//     document.exitFullscreen();
//   }
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const door = document.querySelector("img[src='assets/img/door-garage.png']");
//   const btnUp = document.getElementById("open-door");
//   const btnDown = document.getElementById("close-door");
//   const btnPause = document.querySelector(".bg-red-900"); // Nút dừng

//   let position = 0; // Vị trí hiện tại của cửa
//   let direction = 0; // 1 = lên, -1 = xuống, 0 = dừng
//   let animationFrame;

//   function moveDoor() {
//     if (direction !== 0) {
//       position += direction * 2; // Tăng giảm vị trí
//       door.style.transform = `translateY(${position}px)`;

//       if (position > 50) position = 50; // Giới hạn cửa không đi quá cao
//       if (position < -100) position = -100; // Giới hạn cửa không đi quá thấp

//       animationFrame = requestAnimationFrame(moveDoor);
//     }
//   }

//   btnUp.addEventListener("click", () => {
//     direction = -1;
//     cancelAnimationFrame(animationFrame);
//     moveDoor();
//   });

//   btnDown.addEventListener("click", () => {
//     direction = 1;
//     cancelAnimationFrame(animationFrame);
//     moveDoor();
//   });

//   btnPause.addEventListener("click", () => {
//     direction = 0;
//     cancelAnimationFrame(animationFrame);
//   });
// });

lucide.createIcons();
// Chart thông tin
// Hàm xác định màu pin theo phần trăm sạc

// reportModal.js
//thanh tiến trình
function fetchData() {
  fetch("http://your-server.com/api/update")
    .then((response) => response.json())
    .then((data) => {
      // Cập nhật các giá trị vào giao diện
      document.getElementById("voltageValue").innerText = `${data.voltage} V`;
      document.getElementById("currentValue").innerText = `${data.current} A`;
      document.getElementById("powerValue").innerText = `${data.power} W`;
      document.getElementById(
        "frequencyValue"
      ).innerText = `${data.frequency} Hz`;
      document.getElementById(
        "powerFactorValue"
      ).innerText = `${data.power_factor}`;
      document.getElementById("energyValue").innerText = `${data.energy} kWh`;

      // Tính toán thanh tiến trình
      document.getElementById("voltageProgress").style.width = `${
        (data.voltage / 250) * 100
      }%`;
      document.getElementById("currentProgress").style.width = `${
        (data.current / 30) * 100
      }%`;
      document.getElementById("powerProgress").style.width = `${
        (data.power / 5000) * 100
      }%`;
      document.getElementById("frequencyProgress").style.width = `${
        (data.frequency / 60) * 100
      }%`;
      document.getElementById("powerFactorProgress").style.width = `${
        data.power_factor * 100
      }%`;
      document.getElementById("energyProgress").style.width = `${
        (data.energy / 1000) * 100
      }%`;
    })
    .catch((error) => console.error("Error fetching data:", error));
}
const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Mở modal
document.getElementById("openModalBtn").addEventListener("click", () => {
  document.getElementById("fullReportModal").classList.remove("hidden");

  // Lấy dữ liệu từ các phần tử chính và đổ vào modal
  document.getElementById("modalVoltage").innerText =
    document.getElementById("voltageValue").innerText;
  document.getElementById("modalCurrent").innerText =
    document.getElementById("currentValue").innerText;
  document.getElementById("modalPower").innerText =
    document.getElementById("powerValue").innerText;
  document.getElementById("modalFrequency").innerText =
    document.getElementById("frequencyValue").innerText;
  document.getElementById("modalPowerFactor").innerText =
    document.getElementById("powerFactorValue").innerText;
  document.getElementById("modalEnergy").innerText =
    document.getElementById("energyValue").innerText;
});

// Đóng modal
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("fullReportModal").classList.add("hidden");
});

// Hàm tải dữ liệu report xuống dưới dạng tệp CSV
function downloadReport() {
  // Lấy dữ liệu từ modal
  const reportData = [
    ["Voltage", document.getElementById("modalVoltage").innerText],
    ["Current", document.getElementById("modalCurrent").innerText],
    ["Power", document.getElementById("modalPower").innerText],
    ["Frequency", document.getElementById("modalFrequency").innerText],
    ["Power Factor", document.getElementById("modalPowerFactor").innerText],
    ["Energy", document.getElementById("modalEnergy").innerText],
  ];

  // Chuyển dữ liệu thành định dạng CSV
  const csvContent =
    "data:text/csv;charset=utf-8," +
    reportData.map((row) => row.join(",")).join("\n");

  // Tạo một đối tượng 'a' để tải file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "report.csv");

  // Tải file xuống
  link.click();
}

// Thêm sự kiện cho nút tải report
document
  .getElementById("downloadReportBtn")
  .addEventListener("click", downloadReport);
// Tính tiền điện
// Function to update date range based on user input
function updateDateRange() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Update displayed date range based on user input
  const dateRangeDisplay = document.getElementById("dateRange");
  dateRangeDisplay.textContent = `${startDate} - ${endDate}`;

  // Call a function to update the data for the selected date range
  updateDataForTimeRange(startDate, endDate);
}

// Function to update the data based on selected date range
function updateDataForTimeRange(startDate, endDate) {
  // You can customize this function to update the data accordingly
  // For example, if you want to update data based on the selected date range

  console.log(`Displaying data from ${startDate} to ${endDate}`);
  // Update other sections of the dashboard with the filtered data for the date range
}

// Optional: Calculate electricity cost (for demonstration purposes)
function calculateElectricityCost() {
  const pricePerKWh = document.getElementById("priceInput").value;
  const totalKWh = 28.25; // Example value
  const totalCost = pricePerKWh * totalKWh;

  document.getElementById(
    "electricityCostResult"
  ).innerText = `Tổng hóa đơn điện: ${totalCost.toLocaleString()} VNĐ`;
}

// Initialize dashboard data on page load
window.onload = () => {
  // Initial call to set up the dashboard (you can set default dates if needed)
  updateDateRange();
};

// Tính tiền điện
// --- MẪU DỮ LIỆU (thay bằng fetch từ ESP32) ---
const dailyData = [
  { date: "2025-04-10", wh: 12000 },
  { date: "2025-04-11", wh: 8000 },
  { date: "2025-04-12", wh: 15000 },
  { date: "2025-04-13", wh: 6000 },
  { date: "2025-04-14", wh: 18000 },
  { date: "2025-04-15", wh: 10000 },
  { date: "2025-04-16", wh: 14000 },
];

// Khởi tạo chart với format label và tooltip
const chart = Highcharts.chart("historyChart", {
  chart: { type: "column" },
  title: { text: "Tiêu thụ điện theo ngày" },
  xAxis: { categories: [], crosshair: true },
  yAxis: [
    {
      // Wh/ngày
      labels: { format: "{value} Wh" },
      title: { text: "Wh/ngày" },
    },
    {
      // Chi phí (₫)
      title: { text: "Chi phí (₫)" },
      labels: {
        // formatter cho axis labels
        formatter: function () {
          return Highcharts.numberFormat(this.value, 0, ",", ".") + " ₫";
        },
      },
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
    // custom tooltip formatter
    formatter: function () {
      let s = `<b>${this.x}</b><br/>`;
      this.points.forEach((pt) => {
        if (pt.series.name === "Chi phí") {
          s += `${pt.series.name}: <b>${Highcharts.numberFormat(
            pt.y,
            0,
            ",",
            "."
          )} ₫</b><br/>`;
        } else {
          s += `${pt.series.name}: <b>${pt.y} Wh</b><br/>`;
        }
      });
      return s;
    },
  },
  series: [
    { name: "Tiêu thụ (Wh)", type: "column", data: [] },
    { name: "Chi phí", type: "spline", yAxis: 1, data: [] },
  ],
});

// Hàm cập nhật chart
function updateChart() {
  const price = Number(document.getElementById("priceInput").value); // ₫/kWh
  const from = Date.parse(document.getElementById("fromDate").value);
  const to = Date.parse(document.getElementById("toDate").value);

  const filtered = dailyData.filter((d) => {
    const t = Date.parse(d.date);
    return t >= from && t <= to;
  });

  const cats = filtered.map((d) => {
    const dt = new Date(d.date);
    return dt.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  });
  const cons = filtered.map((d) => d.wh);
  const costs = filtered.map((d) => Math.round((d.wh / 1000) * price));

  chart.xAxis[0].setCategories(cats);
  chart.series[0].setData(cons);
  chart.series[1].setData(costs);
}

// Khởi tạo ngày và chart lần đầu
(function init() {
  const to = new Date(),
    from = new Date(to.getTime() - 6 * 24 * 3600 * 1000);
  document.getElementById("toDate").value = to.toISOString().slice(0, 10);
  document.getElementById("fromDate").value = from.toISOString().slice(0, 10);
  updateChart();
})();

// Nút Update
document.getElementById("updateBtn").addEventListener("click", updateChart);

// Khởi tạo ngày mặc định: 7 ngày gần nhất
(function initDates() {
  const to = new Date();
  const from = new Date(to.getTime() - 6 * 24 * 3600 * 1000);
  document.getElementById("toDate").value = to.toISOString().slice(0, 10);
  document.getElementById("fromDate").value = from.toISOString().slice(0, 10);
  updateChart();
})();
