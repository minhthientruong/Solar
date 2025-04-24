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
    completed: { amount: 0.1 }, // 10% hoàn thành
  },
  {
    name: "Pin B",
    start: Date.UTC(2025, 3, 14, 0, 0),
    end: Date.UTC(2025, 3, 17, 23, 59),
    completed: { amount: 0 }, // Mới bắt đầu
  },
];

// Tạo biểu đồ Gantt
const chart = Highcharts.ganttChart("container", {
  chart: {
    zoomType: "x",
  },
  title: {
    text: "Dung lượng pin năng lượng mặt trời",
  },
  yAxis: {
    uniqueNames: true,
  },
  navigator: {
    enabled: true,
  },
  scrollbar: {
    enabled: true,
  },
  rangeSelector: {
    enabled: true,
    selected: 0,
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
// Thiết lập sạc giả lập cho Pin A và Pin B
const chargingDurationA = 5 * 60 * 1000; // 5 phút cho Pin A
const chargingDurationB = 1 * 60 * 1000; // 1 phút cho Pin B
const startTimeA = Date.now();
const startTimeB = Date.now();

function updateSimulatedCharging() {
  const now = Date.now();

  // Tính toán sạc cho Pin A
  const elapsedA = now - startTimeA;
  const percentA = Math.min((elapsedA / chargingDurationA) * 100, 100);

  // Tính toán sạc cho Pin B
  const elapsedB = now - startTimeB;
  const percentB = Math.min((elapsedB / chargingDurationB) * 100, 100);

  // Cập nhật giao diện cho Pin A
  document.getElementById("solarPercentage").textContent = `${percentA.toFixed(
    1
  )}%`;
  document.getElementById("solarProgress").style.width = `${percentA}%`;
  document.getElementById("chargingStatus").textContent =
    percentA < 100 ? "Đang sạc 🔋" : "Đã đầy ✅";

  // Cập nhật giao diện cho Pin B
  document.getElementById("solarPercentageB").textContent = `${percentB.toFixed(
    1
  )}%`;
  document.getElementById("solarProgressB").style.width = `${percentB}%`;
  document.getElementById("chargingStatusB").textContent =
    percentB < 100 ? "Đang sạc 🔋" : "Đã đầy ✅";

  document.getElementById("timestamp").textContent =
    new Date().toLocaleTimeString();

  // Cập nhật Highcharts (cập nhật Pin A và Pin B)
  chart.series[0].points[0].update({
    completed: { amount: percentA / 100 },
    color: getBatteryColor(percentA / 100),
  });
  chart.series[0].points[1].update({
    completed: { amount: percentB / 100 },
    color: getBatteryColor(percentB / 100),
  });
}

// Gọi lần đầu và cập nhật mỗi 5 giây
updateSimulatedCharging();
setInterval(updateSimulatedCharging, 5000);
