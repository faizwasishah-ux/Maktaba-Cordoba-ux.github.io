const products = [
  // GROCERY
  {id:1,name:"Basmati Rice",category:"grocery",price:320,old:350,unit:"1 kg",img:"images/rice.jpg",tag:"STAPLE"},
  {id:2,name:"White Sugar",category:"grocery",price:170,old:180,unit:"1 kg",img:"images/sugar.jpg",tag:"ESSENTIAL"},
  {id:3,name:"Fine Salt",category:"grocery",price:60,old:null,unit:"800 gm",img:"images/salt.jpg",tag:"DAILY"},
  {id:4,name:"Cooking Oil",category:"grocery",price:550,old:600,unit:"1 litre",img:"images/oil.jpg",tag:"OFFER"},
  {id:5,name:"Ghee",category:"grocery",price:680,old:720,unit:"1 kg",img:"images/ghee.jpg",tag:"POPULAR"},
  {id:6,name:"Red Chili Powder",category:"grocery",price:280,old:320,unit:"200 gm",img:"images/redchili.jpg",tag:"SPICE"},
  {id:7,name:"Turmeric Powder",category:"grocery",price:200,old:null,unit:"200 gm",img:"images/haldi.jpg",tag:"SPICE"},
  {id:8,name:"Coriander Powder",category:"grocery",price:220,old:null,unit:"200 gm",img:"images/dhania.jpg",tag:"SPICE"},
  {id:9,name:"Cumin Seeds",category:"grocery",price:350,old:null,unit:"100 gm",img:"images/zeera.jpg",tag:"SPICE"},
  {id:10,name:"Black Pepper",category:"grocery",price:400,old:null,unit:"100 gm",img:"images/kalimirch.jpg",tag:"SPICE"},
  {id:11,name:"Garam Masala",category:"grocery",price:300,old:null,unit:"100 gm",img:"images/garammasala.jpg",tag:"SPICE"},
  {id:12,name:"Tea Leaves",category:"grocery",price:450,old:500,unit:"190 gm",img:"images/tea.jpg",tag:"DAILY"},
  
  // DAIRY
  {id:13,name:"Fresh Full Cream Milk",category:"dairy",price:260,old:null,unit:"1 litre",img:"images/milk.jpg",tag:"DAILY"},
  {id:14,name:"Farm Fresh Eggs",category:"dairy",price:360,old:400,unit:"12 pieces",img:"images/eggs.jpg",tag:"SAVE"},
  {id:15,name:"Yogurt",category:"dairy",price:180,old:null,unit:"500 gm",img:"images/dahi.jpg",tag:"FRESH"},
  {id:16,name:"Cheddar Cheese",category:"dairy",price:650,old:null,unit:"400 gm",img:"images/cheese.jpg",tag:"NEW"},
  
  // VEGETABLES
  {id:17,name:"Fresh Onions",category:"vegetable",price:180,old:220,unit:"1 kg",img:"images/onions.jpg",tag:"FRESH"},
  {id:18,name:"Fresh Tomatoes",category:"vegetable",price:200,old:250,unit:"1 kg",img:"images/tomatoes.jpg",tag:"12% OFF"},
  {id:19,name:"Fresh Potatoes",category:"vegetable",price:140,old:160,unit:"1 kg",img:"images/potatoes.jpg",tag:"POPULAR"},
  {id:20,name:"Green Chilies",category:"vegetable",price:120,old:150,unit:"250 gm",img:"images/greenchilies.jpg",tag:"FRESH"},
  {id:21,name:"Garlic",category:"vegetable",price:380,old:null,unit:"250 gm",img:"images/garlic.jpg",tag:"FRESH"},
  {id:22,name:"Ginger",category:"vegetable",price:420,old:null,unit:"250 gm",img:"images/ginger.jpg",tag:"FRESH"},
  
  // BAKERY
  {id:23,name:"Soft White Bread",category:"bakery",price:160,old:null,unit:"1 pack",img:"images/bread.jpg",tag:"BAKERY"},
  {id:24,name:"Tandoori Roti",category:"bakery",price:25,old:null,unit:"1 piece",img:"images/roti.jpg",tag:"HOT"},
];

let activeFilter = "all";
let cart = JSON.parse(localStorage.getItem("quickmartBlueCart") || "[]");
let savedAddress = JSON.parse(localStorage.getItem("quickmartAddress") || "null");

const grid = document.getElementById("productGrid");

function renderProducts(){
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p =>
    (activeFilter === "all" || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search))
  );
  
  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <span class="product-tag">${p.tag}</span>
      <div class="product-image">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category.toUpperCase()}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-unit">${p.unit}</p>
        <div class="product-bottom">  <!-- YEH DIV BAND KIYA -->
          <div>
            <span class="price">Rs. ${p.price}</span>${p.old ? `<span class="old-price">Rs. ${p.old}</span>` : ""}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </article>
  `).join("");
  
  if(document.getElementById("emptyState")){
    document.getElementById("emptyState").style.display = filtered.length ? "none" : "block";
  }
}

function setFilter(filter){
  activeFilter = filter;
  document.querySelectorAll(".filter,.category").forEach(btn => {
    const activeClass = btn.classList.contains("filter") ? "active-filter" : "active-category";
    btn.classList.toggle(activeClass, btn.dataset.filter === filter);
  });
  renderProducts();
  document.getElementById("products")?.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll(".filter,.category").forEach(btn => btn.addEventListener("click", () => setFilter(btn.dataset.filter)));
document.getElementById("searchInput")?.addEventListener("input", renderProducts);

// SIRF 1 BAAR addToCart
function addToCart(productId){
  const item = cart.find(x => x.id === productId);
  if(item) item.qty++;
  else cart.push({id: productId, qty:1});
  saveCart();
  showToast("Product added to your cart.");
}

function removeFromCart(id){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty--;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("quickmartBlueCart",JSON.stringify(cart));
  renderCart();
  updateCartCount(); // Count bhi update karo
}

function updateCartCount() {
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.innerText = totalQty);
}

function renderCart(){
  const count = cart.reduce((a,x)=>a+x.qty,0);
  document.getElementById("cartCount").textContent = count;
  const items = document.getElementById("cartItems");
  
  if(!cart.length){
    items.innerHTML = `<div class="cart-empty">🛒<br><br><b>Your cart is empty</b><br><small>Add products to start shopping.</small></div>`;
    document.getElementById("cartTotal").textContent = "Rs. 0";
    return;
  }
  
  items.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `
      <div class="cart-item">
        <div class="emoji"><img src="${p.img}" alt="${p.name}"></div>
        <div>
          <b>${p.name}</b>
          <small>${p.unit} x ${item.qty}</small>
        </div>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `
  }).join('');
  
  const total = cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id); return sum+p.price*item.qty;
  },0);
  document.getElementById("cartTotal").textContent = `Rs. ${total.toLocaleString()}`;
}

const drawer=document.getElementById("cartDrawer"), overlay=document.getElementById("drawerOverlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);

// Address + Location wala code same rahega...
const addressModal=document.getElementById("addressModal");
function openAddressModal(){addressModal.classList.add("show")}
function closeAddressModal(){addressModal.classList.remove("show")}
document.getElementById("addressButton").addEventListener("click",openAddressModal);
document.getElementById("heroAddressBtn").addEventListener("click",openAddressModal);
document.getElementById("addressStripBtn").addEventListener("click",useCurrentLocation);
addressModal.addEventListener("click",e=>{if(e.target===addressModal)closeAddressModal()});

function setLocationStatus(message, type=""){
  const status = document.getElementById("locationStatus");
  status.textContent = message;
  status.className = "location-status" + (type ? " " + type : "");
}

function useCurrentLocation(){
  if(!navigator.geolocation){ openAddressModal(); setLocationStatus("Location not supported", "error"); return; }
  openAddressModal(); setLocationStatus("Getting your location...", "loading");
  navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude; const lng = position.coords.longitude;
      savedAddress = savedAddress || {}; savedAddress.latitude = lat; savedAddress.longitude = lng; savedAddress.locationName = "Current GPS Location";
      localStorage.setItem("quickmartAddress", JSON.stringify(savedAddress)); updateAddressUI();
      setLocationStatus(`Location found: ${lat.toFixed(5)}, ${lng.toFixed(5)}`, "success"); showToast("Location detected");
    }, error => { setLocationStatus("Unable to get location", "error"); },
    {enableHighAccuracy:true, timeout:10000, maximumAge:300000}
  );
}
document.getElementById("currentLocationBtn").addEventListener("click", useCurrentLocation);

document.getElementById("addressForm").addEventListener("submit",function(e){
  e.preventDefault();
  savedAddress={ name:document.getElementById("fullName").value.trim(), phone:document.getElementById("phone").value.trim(), address:document.getElementById("fullAddress").value.trim(), city:document.getElementById("city").value.trim(), area:document.getElementById("area").value.trim(), latitude:document.getElementById("latitude").value || (savedAddress && savedAddress.latitude) || "", longitude:document.getElementById("longitude").value || (savedAddress && savedAddress.longitude) || "", locationName:(savedAddress && savedAddress.locationName) || "" };
  localStorage.setItem("quickmartAddress",JSON.stringify(savedAddress)); updateAddressUI(); closeAddressModal(); showToast("Address saved");
});

function updateAddressUI(){
  if(!savedAddress) return;
  const short = [savedAddress.area, savedAddress.city].filter(Boolean).join(", ");
  const hasManualAddress = savedAddress.address || short;
  const locationText = hasManualAddress ? (short || savedAddress.address) : (savedAddress.locationName || "Current Location");
  document.getElementById("addressLabel").textContent = locationText || "Add your location";
  document.getElementById("addressStripText").textContent = hasManualAddress ? `${savedAddress.name || "Delivery"} • ${savedAddress.address || ""}${savedAddress.address && short ? ", " : ""}${short}` : "Add complete address";
  document.getElementById("cartAddress").textContent = hasManualAddress ? `${savedAddress.address || ""}${savedAddress.address && short ? ", " : ""}${short}` : (savedAddress.locationName || "No location");
  document.getElementById("fullName").value=savedAddress.name||""; document.getElementById("phone").value=savedAddress.phone||""; document.getElementById("fullAddress").value=savedAddress.address||""; document.getElementById("city").value=savedAddress.city||""; document.getElementById("area").value=savedAddress.area||""; document.getElementById("latitude").value=savedAddress.latitude||""; document.getElementById("longitude").value=savedAddress.longitude||"";
}

function checkout(){
  if(!cart.length) return showToast("Your cart is empty.");
  if(!savedAddress || (!savedAddress.address && !savedAddress.latitude)){ openAddressModal(); return showToast("Please add delivery location first."); }
  showToast(`Checkout ready for delivery to ${savedAddress.city || "your location"}.`);
}

function sendWhatsAppOrder(){
  if(!cart.length) return showToast("Cart is empty");
  if(!savedAddress || !savedAddress.phone) return openAddressModal();
  let items = cart.map(i=>{let p=products.find(x=>x.id===i.id); return `${i.qty}x ${p.name} = Rs.${p.price*i.qty}`}).join('%0A');
  let total = cart.reduce((sum,i)=>{let p=products.find(x=>x.id===i.id); return sum+p.price*i.qty},0);
  let msg = `*New Order*%0A${items}%0A*Total: Rs.${total}*%0A*Address:* ${savedAddress.address}, ${savedAddress.city}`;
  window.open(`https://wa.me/923117585046?text=${encodeURIComponent(msg)}`,'_blank'); // FIX: ${msg}
}

document.getElementById("mobileMenuBtn").addEventListener("click",()=>document.getElementById("mobileNav").classList.toggle("show"));
document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mobileNav").classList.remove("show")));

let toastTimer;
function showToast(msg){
  const toast=document.getElementById("toast"); toast.textContent=msg; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}

renderProducts();renderCart();updateAddressUI();updateCartCount();
