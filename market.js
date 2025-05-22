
async function fetchCoins() {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true");
  const coins = await res.json();
  renderMarketTable(coins);

  const searchInput = document.getElementById("coin-search");
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = coins.filter(c => c.name.toLowerCase().includes(keyword) || c.symbol.toLowerCase().includes(keyword));
    renderMarketTable(filtered);
  });
}

function renderMarketTable(data) {
  const tbody = document.getElementById("coin-table-body");
  tbody.innerHTML = "";
  data.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>${coin.price_change_percentage_1h_in_currency?.toFixed(2) ?? "0.00"}%</td>
      <td>${coin.price_change_percentage_24h_in_currency?.toFixed(2) ?? "0.00"}%</td>
      <td>${coin.price_change_percentage_7d_in_currency?.toFixed(2) ?? "0.00"}%</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td><img src="https://www.coingecko.com/coins/${coin.id}/sparkline.svg" style="width:100px;height:30px;" /></td>
    `;
    tbody.appendChild(row);
  });
}

async function fetchGlobalStats() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await res.json();
    document.getElementById("global-market-cap").textContent = "$" + data.data.total_market_cap.usd.toLocaleString();
    document.getElementById("global-volume").textContent = "$" + data.data.total_volume.usd.toLocaleString();
  } catch (e) {
    console.error("Failed to fetch global stats", e);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  fetchCoins();
  fetchGlobalStats();
  setInterval(fetchGlobalStats, 60000);
});

