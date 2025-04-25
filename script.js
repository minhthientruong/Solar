//
const eraWidget = new EraWidget();
eraWidget.init({
  needRealtimeConfigs: true /* Cần giá trị hiện thời */,
  needHistoryConfigs: true /* Cần giá trị lịch sử */,
  needActions: true /* Cần các hành động (ví dụ Bật/Tắt đèn) */,
  maxRealtimeConfigsCount: 3 /* Số lượng tối đa giá trị hiện thời */,
  maxHistoryConfigsCount: 1 /* Số lượng tối đa giá trị lịch sử */,
  maxActionsCount: 2 /* Số lượng tối đa các hành động có thể kích hoạt */,
  minRealtimeConfigsCount: 0 /* Số lượng tối thiểu giá trị hiện thời */,
  minHistoryConfigsCount: 0 /* Số lượng tối thiểu giá trị lịch sử */,
  minActionsCount: 0 /* Số lượng tối thiểu hành động */,
  mobileHeight: 800 /* Thiết lập chiều cao hiển thị trên mobile app E-Ra, mặc đinh 300px */,

  /* Hàm callback được gọi khi có cấu hình được nhận từ server */
  onConfiguration: (configuration) => {
    /* Cập nhật cấu hình đèn LED từ cấu hình thời gian thực đầu tiên */
    configLed = configuration.realtime_configs[0];
    actions = configuration.actions; /* Lưu danh sách các hành động được nhận */
  },

  /* Hàm callback được gọi khi nhận giá trị mới từ server */
  onValues: (values) => {
    /* Lấy trạng thái hiện tại của đèn LED từ giá trị của cấu hình */
    const stateLed = values[configLed.id].value;

    /* Kiểm tra nếu trạng thái đèn thay đổi */
    if (newStatusLed !== stateLed) {
      newStatusLed = stateLed; /* Cập nhật trạng thái mới của đèn */
      theSwitch.checked =
        stateLed; /* Thay đổi trạng thái của switch dựa trên trạng thái đèn */
    }
  },
});

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
      document.getElementById("frequencyValue").innerText =
        `${data.frequency} Hz`;
      document.getElementById("powerFactorValue").innerText =
        `${data.power_factor}`;
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

  document.getElementById("electricityCostResult").innerText =
    `Tổng hóa đơn điện: ${totalCost.toLocaleString()} VNĐ`;
}

// Initialize dashboard data on page load
window.onload = () => {
  // Initial call to set up the dashboard (you can set default dates if needed)
  updateDateRange();
};

// Tính tiền điện
// --- MẪU DỮ LIỆU (thay bằng fetch từ ESP32) ---
// Giả lập dữ liệu từ ESP hoặc DB
const dailyData = [
  { date: "2025-04-11", wh: 32000 },
  { date: "2025-04-12", wh: 1600 },
  { date: "2025-04-13", wh: 1000 },
  { date: "2025-04-14", wh: 2200 },
  { date: "2025-04-15", wh: 1200 },
  { date: "2025-04-16", wh: 2600 },
  { date: "2025-04-17", wh: 900 },
  { date: "2025-04-18", wh: 1800 },
  { date: "2025-04-19", wh: 1200 },
  { date: "2025-04-21", wh: 1500 },
  { date: "2025-04-22", wh: 1100 },
  { date: "2025-04-23", wh: 1800 },
  { date: "2025-04-24", wh: 2000 },
];

// Khởi tạo chart với format label và tooltip

const ONE_DAY_AGO = 24 * 60 * 60 * 1000;
const chart = Highcharts.chart("historyChart", {
  chart: { type: "column" },
  title: { text: "Tiêu thụ điện theo ngày" },
  xAxis: { categories: [], crosshair: true },
  yAxis: [
    {
      labels: {
        formatter: function () {
          return (this.value / 1000).toFixed(1) + " kWh"; // Chia 1000 và hiển thị 1 chữ số sau dấu phẩy
        },
      },
      title: { text: "kWh / ngày" },
    },
    {
      title: { text: "Chi phí (₫)" },
      labels: {
        formatter: function () {
          return Highcharts.numberFormat(this.value, 0, ",", ".") + " ₫";
        },
      },
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
    formatter: function () {
      let s = `<b>${this.x}</b><br/>`;
      this.points.forEach((pt) => {
        if (pt.series.name === "Chi phí") {
          s += `${pt.series.name}: <b>${Highcharts.numberFormat(
            pt.y,
            0,
            ",",
            "."
          )} ₫</b><br/>`;
        } else {
          s += `${pt.series.name}: <b>${(pt.y / 1000).toFixed(1)} kWh</b><br/>`; // Hiển thị 1 chữ số sau dấu phẩy
        }
      });
      return s;
    },
  },
  series: [
    { name: "Tiêu thụ (kWh)", type: "column", data: [] },
    { name: "Chi phí", type: "spline", yAxis: 1, data: [] },
  ],
});

function updateChart() {
  const price = Number(document.getElementById("priceInput").value);
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

function showReport() {
  const price = Number(document.getElementById("priceInput").value);
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  const filtered = dailyData.filter((d) => {
    const t = Date.parse(d.date);
    return t >= Date.parse(from) && t <= Date.parse(to);
  });

  const totalWh = filtered.reduce((sum, d) => sum + d.wh, 0);
  const totalKwh = (totalWh / 1000).toFixed(1); // Chuyển đổi tổng Wh thành kWh
  const totalCost = Math.round((totalWh / 1000) * price);

  const rows = filtered
    .map((d) => {
      const cost = Math.round((d.wh / 1000) * price);
      const dateLabel = new Date(d.date).toLocaleDateString("vi-VN");
      const kwh = (d.wh / 1000).toFixed(1); // Chuyển đổi Wh thành kWh và làm tròn
      return `<tr>
        <td class="border px-2 py-1">${dateLabel}</td>
        <td class="border px-2 py-1 text-right">${kwh} kWh</td>
        <td class="border px-2 py-1 text-right">${cost.toLocaleString(
          "vi-VN"
        )} ₫</td>
      </tr>`;
    })
    .join("");

  document.getElementById("reportContent").innerHTML = `
    <div class="flex items-center justify-between mb-4">
    <img src="assets/img/logo-era.png" alt="Logo" class="h-12">
    <div class="text-left mr-4">
      <p><strong>Khách hàng:</strong> Trương Minh Thiện </p>
            <p><strong>Số điện thoại:</strong> 0363739222</p>

      <p><strong>Mã KH:</strong> 123456789</p>
    </div>
  </div>
    <p><strong>Khoảng thời gian:</strong> ${from} đến ${to}</p>
    <p><strong>Giá điện:</strong> ${price.toLocaleString("vi-VN")} ₫/kWh</p>
    <table class="w-full border mt-2 text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1 text-left">Ngày</th>
          <th class="border px-2 py-1 text-right">Tiêu thụ</th>
          <th class="border px-2 py-1 text-right">Chi phí</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr class="bg-gray-50 font-semibold">
          <td class="border px-2 py-1 text-right">Tổng cộng:</td>
          <td class="border px-2 py-1 text-right">${totalKwh} kWh</td> <!-- Tổng tiêu thụ kWh -->
          <td class="border px-2 py-1 text-right">${totalCost.toLocaleString(
            "vi-VN"
          )} ₫</td>
        </tr>
      </tfoot>
    </table>
  `;

  document.getElementById("reportModal").classList.remove("hidden");
}

document.getElementById("downloadReport").addEventListener("click", () => {
  const btn = document.getElementById("downloadReport");
  const content = document.getElementById("reportContent");

  btn.disabled = true;
  const originalText = btn.innerText;
  btn.innerText = "Đang tạo PDF...";

  const opt = {
    margin: 0.5,
    filename: `hoa_don_dien_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(content)
    .save()
    .then(() => {
      btn.innerText = originalText;
      btn.disabled = false;
    });
});

// Khởi tạo biểu đồ ban đầu
(function () {
  const to = new Date();
  const from = new Date(to.getTime() - 6 * 86400000);
  document.getElementById("toDate").value = to.toISOString().slice(0, 10);
  document.getElementById("fromDate").value = from.toISOString().slice(0, 10);
  updateChart();
})();

document.getElementById("updateBtn").addEventListener("click", updateChart);

// Điện nạp xả
// Giả lập dữ liệu từ tấm pin mặt trời
function updateSolarData() {
  // Dữ liệu giả lập
  const voltage = (Math.random() * 10 + 210).toFixed(2); // Điện áp từ 210V đến 220V
  const current = (Math.random() * 5 + 5).toFixed(2); // Dòng điện từ 5A đến 10A
  const power = (voltage * current).toFixed(2); // Công suất W (P = V * I)
  const frequency = (Math.random() * 2 + 49).toFixed(2); // Tần số từ 49Hz đến 51Hz
  const powerFactor = (Math.random() * 0.2 + 0.8).toFixed(2); // Hệ số công suất từ 0.8 đến 1.0
  const energy = (Math.random() * 50 + 500).toFixed(2); // Điện năng tiêu thụ từ 500 kWh đến 550 kWh

  // Cập nhật các giá trị trên giao diện
  document.getElementById("voltageValue").innerText = `${voltage} V`;
  document.getElementById("currentValue").innerText = `${current} A`;
  document.getElementById("powerValue").innerText = `${power} W`;
  document.getElementById("frequencyValue").innerText = `${frequency} Hz`;
  document.getElementById("powerFactorValue").innerText = `${powerFactor}`;
  document.getElementById("energyValue").innerText = `${energy} kWh`;

  // Cập nhật thanh tiến trình (progress bar)
  document.getElementById("voltageProgress").style.width = `${
    (voltage - 210) * 10
  }%`;
  document.getElementById("currentProgress").style.width = `${
    (current - 5) * 10
  }%`;
  document.getElementById("powerProgress").style.width = `${
    ((power - 1100) / 1100) * 100
  }%`;
  document.getElementById("frequencyProgress").style.width = `${
    (frequency - 49) * 50
  }%`;
  document.getElementById("powerFactorProgress").style.width = `${
    (powerFactor - 0.8) * 500
  }%`;
  document.getElementById("energyProgress").style.width = `${
    ((energy - 500) / 50) * 100
  }%`;
}

// Cập nhật dữ liệu mỗi 5 giây
setInterval(updateSolarData, 5000);

// Gọi hàm ngay lập tức khi tải trang để hiển thị dữ liệu ban đầu
updateSolarData();

// on off đèn
function toggleLight(icon) {
  const isOn = icon.classList.contains("text-green-500");
  icon.classList.toggle("text-green-500", !isOn);
  icon.classList.toggle("text-red-500", isOn);

  // Thêm xử lý logic bật tắt thiết bị thật nếu cần
  console.log(icon.id + " is now " + (isOn ? "OFF" : "ON"));
}
// Giả lập số Kwh
function generateRandomWatt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePowerConsumption() {
  const rooms = {
    powerConsumptionGarden: generateRandomWatt(50, 200), // Khu Vườn
    powerConsumptionLivingRoom: generateRandomWatt(100, 300), // Phòng Khách
    powerConsumptionKitchen: generateRandomWatt(150, 500), // Phòng Bếp
    powerConsumptionBedroom: generateRandomWatt(70, 250), // Phòng Ngủ
  };

  for (let id in rooms) {
    const span = document.getElementById(id);
    if (span) {
      span.textContent = `${rooms[id]} W`;
    }
  }
}

// Cập nhật mỗi 3 giây
setInterval(updatePowerConsumption, 3000);

// Cập nhật ngay lần đầu
updatePowerConsumption();
