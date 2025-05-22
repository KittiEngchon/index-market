// market.js

// ข้อมูลตัวอย่างของเหรียญ (mock data)
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
    chartUrl: 'https://www.coingecko.com/graph_placeholder.png'
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
    chartUrl: 'https://www.coingecko.com/graph_placeholder.png'
  }
  // สามารถเพิ่มเหรียญอื่น ๆ ได้ที่นี่
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

// รันเมื่อโหลดหน้า
window.addEventListener('DOMContentLoaded', () => {
  renderMarketTable();
});
