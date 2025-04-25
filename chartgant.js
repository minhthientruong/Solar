// Hàm đổi màu pin theo phần trăm
function getBatteryColor(amount) {
  if (amount === undefined) return "#0000ff"; // Không sạc (xanh dương)
  if (amount < 0.3) return "#ff0000"; // Đỏ (0-30%)
  if (amount < 0.7) return "#ffff00"; // Vàng (30-70%)
  return "#00ff00"; // Xanh lá (trên 70%)
}

// Dữ liệu pin mô phỏng với Pin A và Pin B
const batteryData = [
  {
    name: "Pin A",
    start: Date.UTC(2025, 3, 14, 0, 0),
    end: Date.UTC(2025, 3, 17, 23, 59),
    completed: { amount: 0.1 },
  },
  {
    name: "Pin B",
    start: Date.UTC(2025, 3, 14, 0, 0),
    end: Date.UTC(2025, 3, 17, 23, 59),
    completed: { amount: 0 },
  },
];

// Tính toán min và max từ dữ liệu
const startDates = batteryData.map((item) => item.start);
const endDates = batteryData.map((item) => item.end);
const minDate = Math.min(...startDates);
const maxDate = Math.max(...endDates);

// Tạo biểu đồ Gantt
const chart = Highcharts.ganttChart("container", {
  chart: { zoomType: "x" },
  title: { text: "Dung lượng pin năng lượng mặt trời" },
  xAxis: {
    min: minDate,
    max: maxDate,
    currentDateIndicator: true,
  },
  yAxis: { uniqueNames: true },
  navigator: {
    enabled: true,
    xAxis: {
      min: minDate,
      max: maxDate,
    },
  },
  scrollbar: { enabled: true },
  rangeSelector: {
    enabled: true,
    selected: 1, // Mặc định là khoảng thời gian 3 phút
    buttons: [
      {
        type: "minute",
        count: 1,
        text: "1m",
      },
      {
        type: "minute",
        count: 3,
        text: "3m",
      },
      {
        type: "minute",
        count: 6,
        text: "6m",
      },
      {
        type: "all",
        text: "ALL",
      },
    ],
  },
  tooltip: {
    pointFormatter: function () {
      const completed = this.completed?.amount ?? 0;
      return (
        `<span style="color:${this.color}">●</span> <b>${this.name}</b><br/>` +
        `Từ: ${Highcharts.dateFormat("%Y-%m-%d %H:%M", this.start)}<br/>` +
        `Đến: ${Highcharts.dateFormat("%Y-%m-%d %H:%M", this.end)}<br/>` +
        `Đã sạc: ${(completed * 100).toFixed(1)}%`
      );
    },
  },
  series: [
    {
      name: "Dung lượng pin",
      data: batteryData.map((item) => ({
        ...item,
        color: getBatteryColor(item.completed?.amount),
      })),
    },
  ],
});

// Giả lập sạc
const chargingDurationA = 1 * 60 * 1000; // 1 phút
const chargingDurationB = 2 * 60 * 1000; // 2 phút
const startTimeA = Date.now();
const startTimeB = Date.now();

function formatRemainingTime(ms) {
  const sec = Math.ceil(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function updateBorderProgress(percent, elementId) {
  const el = document.getElementById(elementId);
  const deg = (percent / 100) * 360;
  if (percent >= 100) {
    el.classList.add("glow-border");
  } else {
    el.classList.remove("glow-border");
  }
  el.style.borderImage = `conic-gradient(#00ff00 ${deg}deg, transparent 0deg) 1`;
  el.style.borderStyle = "solid";
  el.style.borderWidth = "6px";
  el.style.borderRadius = "16px";
}

function updateSimulatedCharging() {
  const now = Date.now();

  // --- Pin A ---
  const elapsedA = now - startTimeA;
  const percentA = Math.min((elapsedA / chargingDurationA) * 100, 100);
  const remainingA = Math.max(chargingDurationA - elapsedA, 0);

  document.getElementById("solarPercentage").textContent = `${percentA.toFixed(
    1
  )}%`;
  document.getElementById("solarProgress").style.width = `${percentA}%`;
  document.getElementById("chargingStatus").textContent =
    percentA < 100
      ? `Đang sạc 🔋 (${formatRemainingTime(remainingA)})`
      : "Đã đầy ✅";

  updateBorderProgress(percentA, "borderA");

  // --- Pin B ---
  const elapsedB = now - startTimeB;
  const percentB = Math.min((elapsedB / chargingDurationB) * 100, 100);
  const remainingB = Math.max(chargingDurationB - elapsedB, 0);

  document.getElementById("solarPercentageB").textContent = `${percentB.toFixed(
    1
  )}%`;
  document.getElementById("solarProgressB").style.width = `${percentB}%`;
  document.getElementById("chargingStatusB").textContent =
    percentB < 100
      ? `Đang sạc 🔋 (${formatRemainingTime(remainingB)})`
      : "Đã đầy ✅";

  updateBorderProgress(percentB, "borderB");

  // Cập nhật biểu đồ
  chart.series[0].points[0].update({
    completed: { amount: percentA / 100 },
    color: getBatteryColor(percentA / 100),
  });
  chart.series[0].points[1].update({
    completed: { amount: percentB / 100 },
    color: getBatteryColor(percentB / 100),
  });
}

// Gọi lần đầu và lặp lại mỗi 5s
updateSimulatedCharging();
setInterval(updateSimulatedCharging, 5000);
// Function to simulate random solar data Giả lập 2 Card
function simulateSolarData() {
  // Pin A Data
  let powerA = Math.floor(Math.random() * 1000) + 200; // Simulated power between 200W and 1200W
  let kwhTodayA = (Math.random() * 5).toFixed(2); // Simulated kWh between 0 and 5
  let progressA = Math.random() * 100; // Simulated progress between 0% and 100
  let chargingStatusA = progressA > 20 ? "Đang sạc" : "Không sạc"; // Simulate charging status

  // Update UI for Pin A
  document.getElementById("currentPowerA").innerText = `${powerA} W`;
  document.getElementById("kwhTodayA").innerText = `${kwhTodayA} kWh`;
  document.getElementById("progressBarA").style.width = `${progressA}%`;
  document.getElementById("progressPercentA").innerText =
    `${Math.round(progressA)}%`;
  document.getElementById("statusA").innerText = chargingStatusA;

  // Pin B Data
  let powerB = Math.floor(Math.random() * 1000) + 200; // Simulated power between 200W and 1200W
  let kwhTodayB = (Math.random() * 5).toFixed(2); // Simulated kWh between 0 and 5
  let progressB = Math.random() * 100; // Simulated progress between 0% and 100
  let chargingStatusB = progressB > 20 ? "Đang sạc" : "Không sạc"; // Simulate charging status

  // Update UI for Pin B
  document.getElementById("currentPowerB").innerText = `${powerB} W`;
  document.getElementById("kwhTodayB").innerText = `${kwhTodayB} kWh`;
  document.getElementById("progressBarB").style.width = `${progressB}%`;
  document.getElementById("progressPercentB").innerText =
    `${Math.round(progressB)}%`;
  document.getElementById("statusB").innerText = chargingStatusB;

  // Simulate the border animation based on progress
  let borderA = document.getElementById("borderA");
  let borderB = document.getElementById("borderB");

  if (progressA >= 100) {
    borderA.style.animation = "borderAnimation 5s infinite"; // Trigger animation when fully charged
  } else {
    borderA.style.animation = "none";
  }

  if (progressB >= 100) {
    borderB.style.animation = "borderAnimation 5s infinite"; // Trigger animation when fully charged
  } else {
    borderB.style.animation = "none";
  }
}
// Báo cáo

// Call the simulateSolarData function every 5 seconds to update the data
setInterval(simulateSolarData, 5000);
simulateSolarData();
