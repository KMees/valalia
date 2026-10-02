
const CART_KEY = "valalia-cart";
function readCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch(e){ return []; } }
function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }
function addToCart(id){
  const items = readCart();
  if (!items.includes(id)) items.push(id);
  writeCart(items);
  alert("Saved in this browser. Checkout is not open yet.");
}
function renderCart(){
  const el = document.querySelector("[data-cart]");
  if (!el) return;
  const items = readCart();
  el.textContent = items.length ? items.join(", ") : "Empty.";
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-add]");
  if (!b) return;
  addToCart(b.getAttribute("data-add"));
});
renderCart();
