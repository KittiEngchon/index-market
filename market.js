
const fakePrices = {
  "POL": { price: 0.96, change: 2.1, volume: 123456 },
  "PRE": { price: 0.23, change: -1.5, volume: 45678 },
  "COM": { price: 0.75, change: 0.4, volume: 9023 }
};

async function loadMarket() {
  const res = await fetch("token-list.json");
  const tokens = await res.json();
  const tbody = document.getElementById("marketTableBody");

  tokens.forEach((token, index) => {
    const data = fakePrices[token.symbol] || { price: 0, change: 0, volume: 0 };
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${token.symbol}</strong><br><small>${token.name}</small></td>
      <td>$${data.price.toFixed(2)}</td>
      <td style="color: ${data.change >= 0 ? 'lightgreen' : 'red'}">${data.change.toFixed(2)}%</td>
      <td>$${data.volume.toLocaleString()}</td>
      <td><a href="index.html?token=${token.symbol}"><button class="swap-btn">Swap</button></a></td>
    `;
    tbody.appendChild(row);
  });
}

function filterMarket() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#marketTableBody tr");
  rows.forEach(row => {
    const symbol = row.children[1].textContent.toLowerCase();
    row.style.display = symbol.includes(input) ? "" : "none";
  });
}

loadMarket();
