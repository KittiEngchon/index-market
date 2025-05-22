// market.js

let coinData = [];

// ดึงข้อมูล Top 50 เหรียญจริงจาก Coingecko
async function fetchTopCoins() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true');
    const data = await res.json();

    coinData = data.map((coin, index) => ({
      id: index + 1,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change1h: coin.price_change_percentage_1h_in_currency?.toFixed(2) || 0,
      change24h: coin.price_change_percentage_24h_in_currency?.toFixed(2) || 0,
      change7d: coin.price_change_percentage_7d_in_currency?.toFixed(2) || 0,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      chartUrl: coin.sparkline_in_7d?.price?.length ? generateSparklineUrl(coin.id) : ''
    }));

    renderMarketTable();
  } catch (error) {
    console.error("Error fetching top coins:", error);
  }
}

// ฟังก์ชันสร้าง URL กราฟ sparkline (mock สำหรับ Coingecko ไม่มี API นี้โดยตรง)
function generateSparklineUrl(coinId) {
  return `https://www.coingecko.com/coins/${coinId}/sparkline.svg`;
}

// แสดงข้อมูลเหรียญในตาราง
function renderMarketTable(filter = '') {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = '';

  coinData.filter(coin => coin.name.toLowerCase().includes(filter.toLowerCase())).forEach((coin) => {
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
      <td class="px-2 py-1">${coin.chartUrl ? `<img src="${coin.chartUrl}" alt="chart" class="w-20 h-4">` : '-'}</td>
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

// Event ค้นหา
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('coin-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderMarketTable(e.target.value);
    });
  }
});

// โหลดเมื่อหน้าเว็บเปิด และตั้งเวลาอัปเดตซ้ำทุก 60 วินาที
window.addEventListener('DOMContentLoaded', () => {
  fetchTopCoins();
  fetchGlobalStats();
  setInterval(fetchGlobalStats, 60000);
});


