// market.js

// ข้อมูลตัวอย่างของเหรียญ (พร้อมกราฟจริงจาก Coingecko)
const coinData = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 111412,
    change1h: 0.0,
    change24h: 3.6,
    change7d: 8.3,
    volume24h: 73407997762,
    marketCap: 2213992403183,
    chartUrl: 'https://www.coingecko.com/coins/1/sparkline.svg'
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2629.85,
    change1h: 0.3,
    change24h: 2.0,
    change7d: 1.6,
    volume24h: 37737066940,
    marketCap: 317100454383,
    chartUrl: 'https://www.coingecko.com/coins/279/sparkline.svg'
  }
];

// ฟังก์ชันแสดงข้อมูลเหรียญในตาราง
function renderMarketTable() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = '';

  coinData.forEach((coin) => {
    const row = document.createElement('tr');
    row.classList.add('border-t');

    row.innerHTML = `
      <td class="px-2 py-1">${coin.id}</td>
      <td class="px-2 py-1">${coin.name} ${coin.symbol}</td>
      <td class="px-2 py-1">$${coin.price.toLocaleString()}</td>
      <td class="px-2 py-1 text-green-500">▲ ${coin.change1h}%</td>
      <td class="px-2 py-1 text-green-500">▲ ${coin.change24h}%</td>
      <td class="px-2 py-1 text-green-500">▲ ${coin.change7d}%</td>
      <td class="px-2 py-1">$${(coin.volume24h / 1e9).toFixed(2)}B</td>
      <td class="px-2 py-1">$${(coin.marketCap / 1e9).toFixed(2)}B</td>
      <td class="px-2 py-1"><img src="${coin.chartUrl}" alt="chart" class="w-20 h-4"></td>
    `;

    tableBody.appendChild(row);
  });
}

// ดึงข้อมูล Market Cap และ Volume ล่าสุดจาก Coingecko API
async function fetchGlobalStats() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await res.json();

    const marketCap = data.data.total_market_cap.usd;
    const volume = data.data.total_volume.usd;

    document.getElementById('global-market-cap').textContent = `$${marketCap.toLocaleString()}`;
    document.getElementById('global-volume').textContent = `$${volume.toLocaleString()}`;
  } catch (error) {
    console.error("Error fetching global stats:", error);
    document.getElementById('global-market-cap').textContent = 'N/A';
    document.getElementById('global-volume').textContent = 'N/A';
  }
}

// รันเมื่อโหลดหน้า
window.addEventListener('DOMContentLoaded', () => {
  renderMarketTable();
  fetchGlobalStats();

  // อัปเดตข้อมูลแบบ real-time ทุก 60 วินาที
  setInterval(() => {
    fetchGlobalStats();
  }, 60000);
});
