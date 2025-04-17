// Chart thông tin
// Hàm xác định màu pin theo phần trăm sạc

function getBatteryColor(amount) {
  if (amount === undefined) return "#0000ff"; // không sạc (xanh dương)
  if (amount < 0.3) return "#ff0000"; // đỏ
  if (amount < 0.9) return "#ffff00"; // vàng
  return "#00ff00"; // xanh lá
}

// Dữ liệu pin mô phỏng
const batteryData = [
  {
    name: "Pin A",
    start: "2025-04-14 00:00",
    end: "2025-04-17 23:59",
    completed: { amount: 0.1 },
  },
  {
    name: "Pin B",
    start: "2025-04-17 09:00",
    end: "2025-04-17 23:59",
    completed: { amount: 0.75 },
  },
  {
    name: "Pin C",
    start: "2025-04-17 06:00",
    end: "2025-04-17 23:59",
    completed: { amount: 0.95 },
  },
  {
    name: "Pin D",
    start: "2025-04-17 00:00",
    end: "2025-04-17 23:59",
  },
];

// Gán màu theo phần trăm sạc
const processedData = batteryData.map((item) => ({
  ...item,
  color: getBatteryColor(item.completed?.amount),
}));

// Vẽ biểu đồ Gantt
Highcharts.ganttChart("container", {
  chart: {
    zoomType: "x", // ✅ Cho phép zoom theo trục thời gian
  },

  title: {
    text: "Dung lượng pin năng lượng mặt trời",
  },

  yAxis: {
    uniqueNames: true,
  },

  navigator: {
    enabled: true,
    liveRedraw: true,
    series: {
      type: "gantt",
      pointPlacement: 0.5,
      pointPadding: 0.25,
      accessibility: {
        enabled: false,
      },
    },
    yAxis: {
      min: 0,
      max: 3,
      reversed: true,
      categories: [],
    },
  },

  scrollbar: {
    enabled: true,
  },

  rangeSelector: {
    enabled: true,
    selected: 0,
  },

  accessibility: {
    point: {
      descriptionFormat:
        "{yCategory}. " +
        "{#if completed}Task {(multiply completed.amount 100):.1f}% " +
        "completed. {/if}" +
        "Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.",
    },
    series: {
      descriptionFormat: "{name}",
    },
  },

  lang: {
    accessibility: {
      axis: {
        xAxisDescriptionPlural:
          "The chart has a two-part X axis " +
          "showing time in both week numbers and days.",
        yAxisDescriptionPlural:
          "The chart has one Y axis showing " + "task categories.",
      },
    },
  },

  series: [
    {
      start: "2018-12-25 00:00",
      end: "2018-12-25 23:59",
      name: "Dung lượng pin",
      data: processedData,
    },
  ],
});

const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
