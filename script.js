const crops = [
  {
    id: 'jasmine-rice',
    name: 'ข้าวหอมมะลิ',
    cycleDays: 125,
    yields: { conventional: 900, organic: 780 },
    seedRate: { conventional: 25, organic: 30 },
    fertilizerRate: { conventional: 38, organic: 24 },
    laborDays: { conventional: 4.2, organic: 4.8 },
    waterNeed: 45,
    costs: {
      conventional: { seed: 480, fertilizer: 750, labor: 820, irrigation: 320 },
      organic: { seed: 520, fertilizer: 540, labor: 900, irrigation: 340 }
    },
    tips: [
      'ตรวจสอบระดับน้ำในแปลงเป็นประจำ โดยเฉพาะช่วงตั้งท้องของข้าว',
      'ใส่ปุ๋ยอินทรีย์หรือปุ๋ยคอกก่อนปักดำ 15 วันเพื่อเพิ่มอินทรียวัตถุในดิน'
    ]
  },
  {
    id: 'sweet-corn',
    name: 'ข้าวโพดหวาน',
    cycleDays: 95,
    yields: { conventional: 820, organic: 700 },
    seedRate: { conventional: 1.8, organic: 2.1 },
    fertilizerRate: { conventional: 24, organic: 18 },
    laborDays: { conventional: 3.6, organic: 4.1 },
    waterNeed: 38,
    costs: {
      conventional: { seed: 760, fertilizer: 930, labor: 680, irrigation: 280 },
      organic: { seed: 800, fertilizer: 660, labor: 780, irrigation: 300 }
    },
    tips: [
      'ควรให้น้ำอย่างสม่ำเสมอในช่วงผสมเกสรเพื่อให้ฝักเต็มเมล็ด',
      'ปลูกพืชตระกูลถั่วหมุนเวียนเพื่อเพิ่มไนโตรเจนในดิน'
    ]
  },
  {
    id: 'cassava',
    name: 'มันสำปะหลัง',
    cycleDays: 280,
    yields: { conventional: 3500, organic: 3000 },
    seedRate: { conventional: 1200, organic: 1400 },
    fertilizerRate: { conventional: 12, organic: 8 },
    laborDays: { conventional: 5.1, organic: 5.8 },
    waterNeed: 22,
    costs: {
      conventional: { seed: 980, fertilizer: 820, labor: 1040, irrigation: 180 },
      organic: { seed: 1080, fertilizer: 620, labor: 1180, irrigation: 190 }
    },
    tips: [
      'ตัดท่อนพันธุ์ให้ยาว 20-25 ซม. และเลือกท่อนที่มีอายุไม่น้อยกว่า 12 เดือน',
      'พ่นน้ำหมักชีวภาพช่วงเดือนที่ 2 และ 4 เพื่อเร่งการสร้างหัว'
    ]
  },
  {
    id: 'chili',
    name: 'พริกขี้หนู',
    cycleDays: 110,
    yields: { conventional: 620, organic: 520 },
    seedRate: { conventional: 0.6, organic: 0.8 },
    fertilizerRate: { conventional: 12, organic: 8 },
    laborDays: { conventional: 6.3, organic: 7.1 },
    waterNeed: 28,
    costs: {
      conventional: { seed: 540, fertilizer: 860, labor: 960, irrigation: 260 },
      organic: { seed: 580, fertilizer: 640, labor: 1080, irrigation: 280 }
    },
    tips: [
      'สำรวจศัตรูพืชทุกสัปดาห์และใช้ชีวภัณฑ์ควบคุมเมื่อพบการระบาด',
      'ตัดแต่งกิ่งหลังเก็บเกี่ยวชุดแรกเพื่อกระตุ้นการแตกยอด'
    ]
  },
  {
    id: 'hydro-lettuce',
    name: 'ผักสลัดไฮโดรโปนิกส์',
    cycleDays: 45,
    yields: { conventional: 420, organic: 360 },
    seedRate: { conventional: 0.3, organic: 0.35 },
    fertilizerRate: { conventional: 5.8, organic: 4.2 },
    laborDays: { conventional: 2.4, organic: 2.8 },
    waterNeed: 32,
    costs: {
      conventional: { seed: 820, fertilizer: 1150, labor: 520, irrigation: 460 },
      organic: { seed: 870, fertilizer: 820, labor: 620, irrigation: 490 }
    },
    tips: [
      'รักษาค่า EC และ pH ของสารละลายให้อยู่ในช่วงแนะนำ 1.2-1.8 และ pH 5.8-6.2',
      'เว้นระยะห่างระหว่างต้นอย่างน้อย 20 ซม. เพื่อให้อากาศถ่ายเทดี'
    ]
  }
];

const elements = {
  cropSelect: document.querySelector('#crop-select'),
  area: document.querySelector('#farm-area'),
  startDate: document.querySelector('#start-date'),
  targetPrice: document.querySelector('#target-price'),
  organicMode: document.querySelector('#organic-mode'),
  summary: document.querySelector('#summary'),
  resources: document.querySelector('#resources'),
  timeline: document.querySelector('#timeline'),
  insights: document.querySelector('#insights'),
  profitRemark: document.querySelector('#profit-remark')
};

let profitChart;

document.addEventListener('DOMContentLoaded', () => {
  initCropSelect();
  elements.startDate.valueAsDate = new Date();
  updatePlanner();
  elements.cropSelect.addEventListener('change', updatePlanner);
  elements.area.addEventListener('input', updatePlanner);
  elements.startDate.addEventListener('change', updatePlanner);
  elements.targetPrice.addEventListener('input', updatePlanner);
  elements.organicMode.addEventListener('change', updatePlanner);
});

function initCropSelect() {
  crops.forEach((crop) => {
    const option = document.createElement('option');
    option.value = crop.id;
    option.textContent = crop.name;
    elements.cropSelect.appendChild(option);
  });
}

function updatePlanner() {
  const area = Math.max(parseFloat(elements.area.value) || 0, 0);
  const mode = elements.organicMode.checked ? 'organic' : 'conventional';
  const crop = crops.find((c) => c.id === elements.cropSelect.value) || crops[0];
  const startDate = elements.startDate.value ? new Date(elements.startDate.value) : new Date();
  const price = Math.max(parseFloat(elements.targetPrice.value) || 0, 0);

  const yieldPerRai = crop.yields[mode];
  const totalYieldKg = area * yieldPerRai;
  const cycleDays = crop.cycleDays;
  const harvestDate = addDays(startDate, cycleDays);

  const costsPerRai = crop.costs[mode];
  const totalCost = Object.values(costsPerRai).reduce((sum, val) => sum + val, 0) * area;
  const revenue = totalYieldKg * price;
  const profit = revenue - totalCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

  renderSummary({ area, crop, mode, yieldPerRai, totalYieldKg, revenue, totalCost, profit, harvestDate, price, profitMargin });
  renderResources({ area, crop, mode });
  renderTimeline({ crop, startDate });
  renderInsights({ area, crop, mode, profit, profitMargin, totalYieldKg });
  renderChart({ revenue, totalCost, profit });
}

function renderSummary({ area, crop, mode, yieldPerRai, totalYieldKg, revenue, totalCost, profit, harvestDate, price, profitMargin }) {
  const summaryData = [
    { label: 'ผลผลิตต่อไร่ (กก.)', value: formatNumber(yieldPerRai) },
    { label: 'ผลผลิตรวม (กก.)', value: formatNumber(totalYieldKg) },
    { label: 'รายได้คาดการณ์ (บาท)', value: formatCurrency(revenue) },
    { label: 'ต้นทุนรวม (บาท)', value: formatCurrency(totalCost) },
    { label: 'กำไรสุทธิ (บาท)', value: formatCurrency(profit), highlight: profit >= 0 },
    { label: 'วันที่เก็บเกี่ยว', value: formatDate(harvestDate) },
    { label: 'โหมดการผลิต', value: mode === 'organic' ? 'อินทรีย์' : 'ทั่วไป' },
    { label: 'ราคาขายที่ตั้งไว้ (บาท/กก.)', value: formatNumber(price, 2) }
  ];

  elements.summary.innerHTML = summaryData
    .map(
      (item) => `
        <div class="result-card ${item.highlight === false ? 'negative' : ''}">
          <h3>${item.label}</h3>
          <p>${item.value}</p>
        </div>
      `
    )
    .join('');
}

function renderResources({ area, crop, mode }) {
  const seedKg = area * crop.seedRate[mode];
  const fertilizerKg = area * crop.fertilizerRate[mode];
  const laborDays = area * crop.laborDays[mode];
  const weeklyWater = area * crop.waterNeed;

  elements.resources.innerHTML = `
    <li class="resource-item">
      <strong>เมล็ดพันธุ์ที่ต้องใช้</strong>
      <span>${formatNumber(seedKg, 1)} กิโลกรัม สำหรับพื้นที่ ${formatNumber(area, 1)} ไร่</span>
    </li>
    <li class="resource-item">
      <strong>ปุ๋ย / ธาตุอาหาร</strong>
      <span>${formatNumber(fertilizerKg, 1)} กิโลกรัม (แนะนำแบ่งใส่ 2-3 ครั้ง)</span>
    </li>
    <li class="resource-item">
      <strong>แรงงาน</strong>
      <span>${formatNumber(laborDays, 1)} คน-วัน ตลอดรอบการผลิต</span>
    </li>
    <li class="resource-item">
      <strong>น้ำที่ต้องใช้</strong>
      <span>${formatNumber(weeklyWater, 1)} ลูกบาศก์เมตร ต่อสัปดาห์</span>
    </li>
  `;
}

function renderTimeline({ crop, startDate }) {
  const tasks = [
    { label: 'เตรียมดินและตรวจวิเคราะห์ดิน', offset: -14 },
    { label: 'เพาะกล้า / เตรียมต้นพันธุ์', offset: -7 },
    { label: 'วันเริ่มปลูก', offset: 0 },
    { label: 'บำรุงต้นและกำจัดวัชพืช', offset: Math.round(crop.cycleDays * 0.25) },
    { label: 'ช่วงสร้างผลผลิตสูงสุด', offset: Math.round(crop.cycleDays * 0.6) },
    { label: 'เตรียมตลาดและลูกค้ารับซื้อ', offset: Math.round(crop.cycleDays * 0.8) },
    { label: 'เก็บเกี่ยวและประเมินผล', offset: crop.cycleDays }
  ];

  elements.timeline.innerHTML = tasks
    .map((task) => {
      const taskDate = addDays(startDate, task.offset);
      return `
        <li>
          <strong>${task.label}</strong>
          <span>${formatDate(taskDate)}</span>
        </li>
      `;
    })
    .join('');
}

function renderInsights({ area, crop, mode, profit, profitMargin, totalYieldKg }) {
  const insights = [];

  if (area < 5) {
    insights.push({
      title: 'ขนาดแปลงไม่ใหญ่',
      text: 'แนะนำรวมกลุ่มเกษตรกรเพื่อขายรวมกัน จะช่วยต่อรองราคาได้สูงขึ้นและลดต้นทุนขนส่ง'
    });
  } else if (area > 30) {
    insights.push({
      title: 'แปลงขนาดใหญ่',
      text: 'ลองแบ่งพื้นที่บางส่วนสำหรับพืชทางเลือกหรือพืชคลุมดินเพื่อลดความเสี่ยงจากราคาตลาด'
    });
  }

  if (profitMargin < 20) {
    insights.push({
      title: 'กำไรค่อนข้างต่ำ',
      text: 'พิจารณาปรับปรุงประสิทธิภาพการให้น้ำหรือเจรจาราคาขายล่วงหน้ากับผู้รับซื้อเพื่อเพิ่มกำไร'
    });
  } else if (profitMargin > 45) {
    insights.push({
      title: 'กำไรดี',
      text: 'อาจพิจารณาลงทุนในระบบเก็บเกี่ยวหรือบรรจุภัณฑ์เพื่อเพิ่มมูลค่าผลผลิต'
    });
  }

  if (mode === 'organic') {
    insights.push({
      title: 'โหมดเกษตรอินทรีย์',
      text: 'รักษามาตรฐานอินทรีย์ เช่น ใช้ชีวภัณฑ์และปรับปรุงดินด้วยปุ๋ยพืชสด เพื่อเพิ่มความเชื่อมั่นของผู้บริโภค'
    });
  }

  if (totalYieldKg > 0) {
    insights.push({
      title: `คำแนะนำเฉพาะสำหรับ${crop.name}`,
      text: crop.tips[Math.floor(Math.random() * crop.tips.length)]
    });
  }

  elements.insights.innerHTML = insights
    .map(
      (insight) => `
        <div class="insight-card">
          <h3>${insight.title}</h3>
          <p>${insight.text}</p>
        </div>
      `
    )
    .join('');
}

function renderChart({ revenue, totalCost, profit }) {
  const ctx = document.getElementById('profitChart');
  const dataset = [totalCost, revenue, Math.max(profit, 0)];

  if (!profitChart) {
    profitChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['ต้นทุนรวม', 'รายได้คาดการณ์', 'กำไรสุทธิ'],
        datasets: [
          {
            data: dataset,
            backgroundColor: ['#ff9f1c', '#2ec4b6', '#2f8f4e'],
            borderRadius: 12,
            maxBarThickness: 60
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatNumber(value)
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${formatCurrency(context.parsed.y)}`
            }
          }
        }
      }
    });
  } else {
    profitChart.data.datasets[0].data = dataset;
    profitChart.update();
  }

  elements.profitRemark.textContent = profit >= 0
    ? 'กำไรเป็นบวก สามารถวางแผนเก็บสำรองหรือขยายการผลิตได้'
    : 'กำไรติดลบ ควรทบทวนต้นทุนและหาตลาดที่ให้ราคาสูงขึ้น';
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatNumber(value, decimals = 0) {
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function formatCurrency(value) {
  return Number(value).toLocaleString('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  });
}

function formatDate(date) {
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
