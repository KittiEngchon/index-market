
let provider, signer, userAddress, isConnected = false, isRequesting = false;
let selectedSide = null;
let tokenList = [];

async function connectWallet() {
  if (isRequesting) return;
  isRequesting = true;
  try {
    if (!window.ethereum) return alert("กรุณาติดตั้ง MetaMask");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    isConnected = true;
    document.getElementById("wallet-button").innerText = "Disconnect Wallet";
    document.getElementById("wallet-address").innerText = `🔗 ${userAddress}`;
    document.getElementById("sidebar-wallet-address").innerText = `🔗 ${userAddress}`;
    openSidebar();
    loadBalances();
  } catch (err) {
    console.error("Connect Wallet Error:", err);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Wallet");
  } finally {
    isRequesting = false;
  }
}

function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;
  isConnected = false;
  document.getElementById("wallet-button").innerText = "Connect Wallet";
  document.getElementById("wallet-address").innerText = "⛔ ยังไม่ได้เชื่อมต่อ";
  document.getElementById("sidebar-wallet-address").innerText = "⏳ รอกำหนดที่อยู่...";
  document.getElementById("balance-list").innerHTML = "";
  closeSidebar();
}

document.getElementById("wallet-button").onclick = () => {
  if (!isConnected) connectWallet();
  else disconnectWallet();
};
document.getElementById("close-sidebar").onclick = closeSidebar;

function openSidebar() {
  document.getElementById("wallet-sidebar").style.right = "0px";
}
function closeSidebar() {
  document.getElementById("wallet-sidebar").style.right = "-320px";
}

function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(div => div.style.display = "none");
  document.getElementById(`tab-${tab}`).style.display = "block";
  document.querySelectorAll(".nav-menu button").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.nav-menu button[onclick*="${tab}"]`).classList.add("active");
}

function openTokenModal(side) {
  selectedSide = side;
  document.getElementById("tokenSearch").value = "";
  renderTokenList(tokenList);
  document.getElementById("tokenModal").style.display = "flex";
}
function closeTokenModal() {
  document.getElementById("tokenModal").style.display = "none";
}
window.onclick = e => {
  if (e.target === document.getElementById("tokenModal")) closeTokenModal();
};

function renderTokenList(tokens) {
  const container = document.getElementById("tokenListPopup");
  container.innerHTML = "";
  tokens.forEach(token => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${token.symbol}</strong> - ${token.name}`;
    div.onclick = () => selectToken(token);
    container.appendChild(div);
  });
}

function filterTokens() {
  const search = document.getElementById("tokenSearch").value.toLowerCase();
  const filtered = tokenList.filter(t =>
    t.symbol.toLowerCase().includes(search) || t.name.toLowerCase().includes(search)
  );
  renderTokenList(filtered);
}

function selectToken(token) {
  document.getElementById(`${selectedSide}Token`).value = token.address;
  document.getElementById(`${selectedSide}TokenDisplay`).value = token.symbol;
  closeTokenModal();
  estimatePrice();
}

async function loadBalances() {
  if (!provider || !userAddress || !tokenList.length) return;
  const container = document.getElementById("balance-list");
  container.innerHTML = "Loading...";
  let html = "";
  for (const token of tokenList) {
    try {
      const contract = new ethers.Contract(token.address, ["function balanceOf(address) view returns (uint256)"], provider);
      const raw = await contract.balanceOf(userAddress);
      const formatted = ethers.utils.formatUnits(raw, token.decimals);
      html += `<p><strong>${token.symbol}:</strong> ${formatted}</p>`;
    } catch {
      html += `<p><strong>${token.symbol}:</strong> ⚠️ Error</p>`;
    }
  }
  container.innerHTML = html;
}

function prefillTokenFromURL() {
  const params = new URLSearchParams(window.location.search);
  const tokenSymbol = params.get("token");
  if (!tokenSymbol || !tokenList.length) return;
  const found = tokenList.find(t => t.symbol.toLowerCase() === tokenSymbol.toLowerCase());
  if (found) {
    document.getElementById("fromToken").value = found.address;
    document.getElementById("fromTokenDisplay").value = found.symbol;
  }
}

async function loadTokenList() {
  try {
    const res = await fetch("token-list.json");
    tokenList = await res.json();
    prefillTokenFromURL();
  } catch (err) {
    console.error("Load token list failed", err);
    tokenList = [];
  }
}
loadTokenList();

async function estimatePrice() {
  const from = document.getElementById("fromToken").value;
  const to = document.getElementById("toToken").value;
  const amount = parseFloat(document.getElementById("amount").value);
  if (!from || !to || !amount) return;

  const route = [from, to];
  const router = new ethers.Contract("0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", [
    "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)"
  ], provider);

  try {
    const token = tokenList.find(t => t.address === from);
    const amountIn = ethers.utils.parseUnits(amount.toString(), token.decimals);
    const amounts = await router.getAmountsOut(amountIn, route);
    const target = tokenList.find(t => t.address === to);
    const out = ethers.utils.formatUnits(amounts[1], target.decimals);
    document.getElementById("estimatedPrice").innerText = `${out} ${target.symbol}`;
  } catch (err) {
    document.getElementById("estimatedPrice").innerText = "⚠️ ไม่สามารถคำนวณได้";
  }
}
document.getElementById("amount").addEventListener("input", estimatePrice);
