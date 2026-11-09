const normaliza = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const paraNumero = t => parseFloat(t.replace(/[^\d,]/g, "").replace(",", "."));
const paraReal = n => "R$ " + n.toFixed(2).replace(".", ",");

// Contador do carrinho
let totalCarrinho = Number(localStorage.getItem("carrinho")) || 0;
const iconeCarrinho = document.querySelector('.icones a[href="carrinho.html"]');
function atualizaBadge() {
  if (!iconeCarrinho) return;
  let b = iconeCarrinho.querySelector(".badge");
  if (!b) {
    b = document.createElement("sup");
    b.className = "badge";
    b.style.cssText = "background:#fccd6b;color:#000;border-radius:50%;padding:2px 6px;font-size:12px;font-weight:700;margin-left:2px";
    iconeCarrinho.appendChild(b);
  }
  b.textContent = totalCarrinho;
  b.hidden = totalCarrinho === 0;
}
atualizaBadge();
document.querySelectorAll(".produto .btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    totalCarrinho++;
    localStorage.setItem("carrinho", totalCarrinho);
    atualizaBadge();
    const t = btn.textContent;
    btn.textContent = "Adicionado ✓";
    setTimeout(() => (btn.textContent = t), 1000);
  });
});

// Pesquisa + filtros
const busca = document.querySelector(".busca");
const cards = document.querySelectorAll(".card");
let filtroAtual = "todos";
function aplicaFiltros() {
  const termo = normaliza(busca ? busca.value : "");
  cards.forEach(c => {
    const texto = normaliza((c.dataset.categoria || "") + " " + c.textContent);
    c.style.display = texto.includes(termo) && (filtroAtual === "todos" || texto.includes(filtroAtual)) ? "" : "none";
  });
}
if (busca) busca.addEventListener("input", aplicaFiltros);
document.querySelectorAll(".filtros button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    filtroAtual = normaliza(btn.textContent.trim());
    aplicaFiltros();
  });
});

// Carrinho
const TAXA = 5.10;
function recalcula() {
  const itens = document.querySelectorAll(".item");
  let sub = 0;
  itens.forEach(i => (sub += paraNumero(i.querySelector(".preco").textContent)));
  const v = document.querySelectorAll(".resumo div strong");
  const taxa = itens.length ? TAXA : 0;
  if (v.length === 3) { v[0].textContent = paraReal(sub); v[1].textContent = paraReal(taxa); v[2].textContent = paraReal(sub + taxa); }
  const c = document.querySelector(".pedido-topo span");
  if (c) c.textContent = "Da coleção : " + itens.length;
}
document.querySelectorAll(".item button").forEach(b => b.addEventListener("click", () => { b.closest(".item").remove(); recalcula(); }));
const btnFinal = document.querySelector(".btn-final");
if (btnFinal) btnFinal.addEventListener("click", e => {
  e.preventDefault();
  if (!document.querySelector(".item")) return alert("Seu carrinho está vazio.");
  alert("Pedido finalizado com sucesso! 🎉");
  localStorage.setItem("carrinho", 0);
  window.location.href = "home.html";
});

// Máscara de CPF
const cpf = document.querySelector('input[inputmode="numeric"]');
if (cpf) {
  cpf.maxLength = 14;
  cpf.addEventListener("input", () => {
    let v = cpf.value.replace(/\D/g, "").slice(0, 11);
    cpf.value = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  });
}
