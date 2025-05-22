// market.js

// สร้างข้อมูลเหรียญ 50 อันดับ (mock)
const coinData = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  const name = id === 1 ? 'Bitcoin' : id === 2 ? 'Ethereum' : `Coin ${id}`;
  const symbol = id === 1 ? 'BTC' : id === 2 ? 'ETH' : `C${id}`;
  const chartUrl = id === 1
    ? 'https://www.coingecko.com/coins/1/sparkline.svg'
    : id === 2
    ? 'https://www.coingecko.com/coins/279/sparkline.svg'
    : 'https://www.coingecko.com/coins/1/sparkline.svg';

  return {
    id,
    name,
    symbol,
    price: (Math.random() * 1000 + 1).toFixed(2),
    change1h: (Math.random() * 2).toFixed(1),
    change24h: (Math.random() * 5).toFixed(1),
    change7d: (Math.random() * 10).toFixed(1),
    volume24h: Math.floor(Math.random() * 100_000_000_000),
    marketCap: Math.floor(Math.random() * 2_000_000_000_000),
    chartUrl,
  };
});

// แสดงข้อมูลเหรียญในตาราง
function renderMarketTable() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = '';

  coinData.forEach((coin) => {
    const row = document.createElement('tr');
    row.classList.add('border-t');

    row.innerHTML = `
      <td class="px-2 py-1">${coin.id}</td>
      <td class="px-2 py-1">${coin.name} ${coin.symbol}</td>
      <td class="px-2 py-1">$${parseFloat(coin.price).toLocaleString()}</td>
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

// ดึงข้อมูล Market Cap และ Volume รวมแบบ real-time
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

// โหลดเมื่อหน้าเว็บเปิด และตั้งเวลาอัปเดตซ้ำทุก 60 วินาที
window.addEventListener('DOMContentLoaded', () => {
  renderMarketTable();
  fetchGlobalStats();
  setInterval(() => {
    fetchGlobalStats();
  }, 60000);
});
