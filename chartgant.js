// ---------- Battery Color Function ----------
function getBatteryColor(isCharging) {
  return isCharging ? "#00ff00" : "#cccccc";
}

// ---------- Charging Time Checker ----------
function isChargingTime(hour, minute) {
  if (hour >= 6 && hour < 8) return true;
  if (hour === 8 && minute < 15) return false;
  if ((hour === 8 && minute >= 15) || (hour > 8 && hour < 12)) return true;
  return false;
}

// ---------- Timeline Generator ----------
function generateChargingTimeline(
  pinName,
  startDate,
  endDate,
  intervalMinutes = 15
) {
  const segments = [];
  const current = new Date(startDate);
  while (current < endDate) {
    const hour = current.getHours();
    const minute = current.getMinutes();
    const next = new Date(current);
    next.setMinutes(minute + intervalMinutes);
    const isCharging = isChargingTime(hour, minute);
    segments.push({
      name: pinName,
      start: Date.UTC(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        hour,
        minute
      ),
      end: Date.UTC(
        next.getFullYear(),
        next.getMonth(),
        next.getDate(),
        next.getHours(),
        next.getMinutes()
      ),
      color: getBatteryColor(isCharging),
      charging: isCharging,
    });
    current.setMinutes(minute + intervalMinutes);
  }
  return segments;
}

// ---------- Chart Initialization ----------
let chart;
function updateGanttChart() {
  const now = new Date();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 6,
    0,
    0
  );
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59
  );
  const timelineData = [
    ...generateChargingTimeline("Pin A", startDate, endDate),
    ...generateChargingTimeline("Pin B", startDate, endDate),
  ];
  chart = Highcharts.ganttChart("container", {
    chart: { zoomType: "x" },
    title: { text: "Lịch Sử Thời Gian Sạc Pin Năng Lượng Mặt Trời" },
    xAxis: { currentDateIndicator: true },
    yAxis: { uniqueNames: true },
    navigator: { enabled: true },
    scrollbar: { enabled: true },
    rangeSelector: {
      enabled: true,
      selected: 1,
      buttons: [
        { type: "minute", count: 1, text: "1m" },
        { type: "minute", count: 3, text: "3m" },
        { type: "minute", count: 6, text: "6m" },
        { type: "hour", count: 1, text: "1h" },
        { type: "hour", count: 2, text: "2h" },
        { type: "all", text: "ALL" },
      ],
    },
    tooltip: {
      pointFormatter: function () {
        return `<b>${this.name}</b><br/>
                Từ: ${Highcharts.dateFormat("%Y-%m-%d %H:%M", this.start)}<br/>
                Đến: ${Highcharts.dateFormat("%Y-%m-%d %H:%M", this.end)}<br/>
                Trạng thái: ${this.charging ? "Đang sạc 🔋" : "Không sạc 🌙"}`;
      },
    },
    series: [{ name: "Lịch sử sạc", data: timelineData }],
  });
}
updateGanttChart();

// ---------- Simulation & Update ----------
const chargingDurationA = 1 * 60 * 1000;
const chargingDurationB = 2 * 60 * 1000;
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
  el.style.borderImage = `conic-gradient(#00ff00 ${deg}deg, transparent 0deg) 1`;
  el.style.borderStyle = "solid";
  el.style.borderWidth = "6px";
  el.style.borderRadius = "16px";
  el.classList.toggle("glow-border", percent >= 100);
}

function updateSimulatedCharging() {
  const now = Date.now();
  const elapsedA = now - startTimeA;
  const elapsedB = now - startTimeB;
  const percentA = Math.min((elapsedA / chargingDurationA) * 100, 100);
  const percentB = Math.min((elapsedB / chargingDurationB) * 100, 100);
  const remainingA = Math.max(chargingDurationA - elapsedA, 0);
  const remainingB = Math.max(chargingDurationB - elapsedB, 0);

  document.getElementById("solarPercentage").textContent =
    `${percentA.toFixed(1)}%`;
  document.getElementById("solarProgress").style.width = `${percentA}%`;
  document.getElementById("chargingStatus").textContent =
    percentA < 100
      ? `Đang sạc 🔋 (${formatRemainingTime(remainingA)})`
      : "Đã đầy ✅";
  updateBorderProgress(percentA, "borderA");

  document.getElementById("solarPercentageB").textContent =
    `${percentB.toFixed(1)}%`;
  document.getElementById("solarProgressB").style.width = `${percentB}%`;
  document.getElementById("chargingStatusB").textContent =
    percentB < 100
      ? `Đang sạc 🔋 (${formatRemainingTime(remainingB)})`
      : "Đã đầy ✅";
  updateBorderProgress(percentB, "borderB");

  if (chart?.series?.[0]?.points?.length >= 2) {
    chart.series[0].points[0].update({
      completed: { amount: percentA / 100 },
      color: getBatteryColor(percentA / 100),
    });
    chart.series[0].points[1].update({
      completed: { amount: percentB / 100 },
      color: getBatteryColor(percentB / 100),
    });
  }
}
setInterval(updateSimulatedCharging, 5000);
updateSimulatedCharging();

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
