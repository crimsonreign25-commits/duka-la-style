import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Phone, MessageCircle, Wallet, Crown, Flame, Truck, ShieldCheck } from "lucide-react";

const BRAND = "BALEKING";
const TAGLINE = "GRADE 1 OR NOTHING";

const PRODUCTS = [
  // STREETWEAR KING
  { id: 1, name: "BK KING HOODIE", grade: "Grade 1 · Heavy Fleece", category: "Hoodies", style: "Streetwear", gender: "Male", age: "Adult", price: 2700, was: 3500, image: "https://images.unsplash.com/photo-1578683010236-d7160d1e3f5b?q=80&w=800&h=1000&auto=format&fit=crop", note: "OVERSIZED. The crown of all hoodies. Black, Grey, Cream" },
  { id: 2, name: "BK DRIP TEE", grade: "Grade 1 · 100% Cotton", category: "T-Shirts", style: "Streetwear", gender: "Unisex", age: "All", price: 700, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800&h=1000&auto=format&fit=crop", note: "Heavyweight. No fading. Sizes S-XXL" },
  { id: 3, name: "BK CARTEL JEANS", grade: "Grade 1", category: "Jeans", style: "Streetwear", gender: "Male", age: "Adult", price: 1500, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&h=1000&auto=format&fit=crop", note: "Baggy & Straight. Waist 30-38. No rips" },
  { id: 4, name: "BK CROWN CAP", grade: "Grade 1", category: "Caps", style: "Streetwear", gender: "Unisex", age: "All", price: 900, image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&h=1000&auto=format&fit=crop", note: "Flat brim. BK Logo. One size" },

  // CASUAL KING
  { id: 5, name: "BK EVERYDAY TEE", grade: "Grade 1 · Cotton", category: "T-Shirts", style: "Casual", gender: "Male", age: "Adult", price: 600, image: "https://images.unsplash.com/photo-1489987708160-a9753f8ee04b?q=80&w=800&h=1000&auto=format&fit=crop", note: "Black, White, Navy. Daily wear" },
  { id: 6, name: "BK ANKARA DRESS", grade: "Grade 1 · Cream", category: "Dresses", style: "Casual", gender: "Female", age: "Adult", price: 1100, was: 1400, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&h=1000&auto=format&fit=crop", note: "Sunday best. Sizes S-XL" },
  { id: 7, name: "BK VINTAGE JACKET", grade: "Grade 1", category: "Jackets", style: "Casual", gender: "Unisex", age: "Adult", price: 2000, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=800&h=1000&auto=format&fit=crop", note: "Denim. Vintage wash" },

  // OFFICIAL KING
  { id: 8, name: "BK CEO SHIRT", grade: "Grade 1", category: "Shirts", style: "Official", gender: "Male", age: "Adult", price: 1700, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&h=1000&auto=format&fit=crop", note: "White, Blue. Office fit. Ironed" },
  { id: 9, name: "BK BOARDROOM BLAZER", grade: "Grade 1", category: "Jackets", style: "Official", gender: "Female", age: "Adult", price: 2800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&h=1000&auto=format&fit=crop", note: "Navy, Black. Sizes 8-16" },
  { id: 10, name: "BK SLACKS", grade: "Grade 1", category: "Trousers", style: "Official", gender: "Unisex", age: "Adult", price: 1300, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&h=1000&auto=format&fit=crop", note: "Navy, Grey, Black. Work wear" },

  // KIDS
  { id: 11, name: "BK JUNIOR HOODIE", grade: "Grade 1", category: "Hoodies", style: "Casual", gender: "Unisex", age: "Child", price: 1700, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&h=1000&auto=format&fit=crop", note: "Ages 4-12. Multiple colors" },
];

const CATEGORIES = ["All", "T-Shirts", "Hoodies", "Caps", "Jeans", "Jackets", "Trousers", "Dresses", "Shirts"];
const GENDERS = ["All", "Male", "Female", "Unisex"];
const AGES = ["All", "Adult", "Child"];
const STYLES = ["All", "Casual", "Streetwear", "Official"];

function formatKES(n) { return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n); }

function ProductCard({ product, onAdd }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="group bg-[#0A0A0A] border border-[#FFD700]/10 overflow-hidden hover:border-[#FFD700]">
      <div className="relative h-80 flex items-end justify-center overflow-hidden">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {product.was && <span className="absolute top-3 left-3 text-[10px] bg-[#FFD700] text-black font-black px-2 py-1 tracking-wider">KING SALE</span>}
        <span className="absolute top-3 right-3 text-[9px] bg-black/70 text-[#FFD700] px-2 py-1 font-black">{product.style.toUpperCase()}</span>
      </div>
      <div className="p-4">
        <h3 className="text-[17px] font-black text-white tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>{product.name}</h3>
        <p className="text-xs text-white/50 mt-1">{product.grade}</p>
        <div className="flex items-end justify-between mt-3">
          <div className="text-[20px] font-black text-[#FFD700]">{formatKES(product.price)}</div>
          {product.was && <div className="text-[12px] line-through text-white/40">{formatKES(product.was)}</div>}
        </div>
        <button onClick={() => onAdd(product)} className="w-full mt-3 bg-[#FFD700] text-black font-black py-2.5 text-xs uppercase tracking-widest hover:bg-white transition-colors">
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
}

export default function Duka() {
  const [filter, setFilter] = useState("All"); const [genderFilter, setGenderFilter] = useState("All"); const [ageFilter, setAgeFilter] = useState("All"); const [styleFilter, setStyleFilter] = useState("All"); const [cart, setCart] = useState([]);
  const visible = PRODUCTS.filter((p) => (filter === "All" || p.category === filter) && (genderFilter === "All" || p.gender === genderFilter || p.gender === "Unisex") && (ageFilter === "All" || p.age === ageFilter || p.age === "All") && (styleFilter === "All" || p.style === styleFilter));
  const cartTotal = cart.reduce((s, i) => s + i.price, 0);
  const handleMpesaPay = () => { if (cart.length === 0) return alert("CART IS EMPTY KING"); const phone = prompt("ENTER MPESA NUMBER: 07XX XXX"); if (phone) alert(`👑 STK PUSH SENT TO ${phone} FOR ${formatKES(cartTotal)}\n\nENTER MPESA PIN TO COMPLETE. BALEKING APPRECIATES YOU.`) };
  const handleWhatsAppOrder = () => { if (cart.length === 0) return alert("CART IS EMPTY KING"); const items = cart.map(i => `• ${i.name} - ${formatKES(i.price)}`).join("%0A"); const url = `https://wa.me/254710574821?text=👑%20YO%20BALEKING%20I%20AM%20THE%20KING%20I%20WANT%3A%0A${items}%0A%0ATOTAL%3A%20${formatKES(cartTotal)}%0A%0ADElIVERY%20LOCATION%3A`; window.open(url, "_blank") };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800;900&family=Inter:wght@800;900&family=JetBrains+Mono:wght@800&display=swap'); body { font-family: 'Inter', sans-serif; } video { pointer-events: none; }`}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur border-b-2 border-[#FFD700]">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FFD700] flex items-center justify-center"><Crown size={24} className="text-black"/></div>
            <div><span className="tracking-[0.4em] text-2xl font-black text-[#FFD700]">{BRAND}</span><div className="text-[10px] tracking-[0.5em] text-white/60">{TAGLINE}</div></div>
          </div>
          <div className="flex items-center gap-4 text-sm"><ShoppingBag size={16} /> CART: {cart.length}</div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-12">
        <div className="flex items-center gap-2 mb-5"><Flame size={18} className="text-[#FFD700]" /><span className="text-xs uppercase tracking-[0.4em] text-[#FFD700]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>NEW BALE. NEW RULES.</span></div>
        <h1 className="text-6xl sm:text-8xl leading-[0.9] mb-4 font-black">RULE THE <span className="text-[#FFD700]">BALE.</span></h1>
        <p className="text-white/70 max-w-lg text-[16px] mb-8">We don't sell rags. We sell crowns. MPESA. Delivery Mombasa & Nairobi. 24hrs.</p>

        {/* TRUST BADGES */}
        <div className="flex gap-4 mb-10">
          <div className="flex items-center gap-2 text-xs"><ShieldCheck size={14} className="text-[#FFD700]"/> GRADE 1 ONLY</div>
          <div className="flex items-center gap-2 text-xs"><Truck size={14} className="text-[#FFD700]"/> FAST DELIVERY</div>
        </div>

        {/* VIBE SELECTOR */}
        <div>
          <h2 className="text-sm uppercase tracking-[0.4em] mb-5 text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>CHOOSE YOUR KINGDOM</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Casual", desc: "Everyday King", img: "https://images.unsplash.com/photo-1489987708160-a9753f8ee04b?q=80&w=800&h=600&auto=format&fit=crop", video: null },
              { name: "Official", desc: "CEO Energy", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&h=600&auto=format&fit=crop", video: null },
              { name: "Streetwear", desc: "King Drip", img: "https://images.unsplash.com/photo-1529139555592-44c9473e6e5b?q=80&w=800&h=600&auto=format&fit=crop", video: "https://videos.pexels.com/video-files/3195394/3195394-uhd_1440_1440_30fps.mp4" }
            ].map((vibe) => (
              <button key={vibe.name} onClick={() => { setStyleFilter(vibe.name); window.scrollTo({ top: document.querySelector('main').offsetTop - 20, behavior: 'smooth' }); }}
                className="group relative overflow-hidden h-40 sm:h-52 border-2 border-[#FFD700]/20 hover:border-[#FFD700] transition-all">
                {vibe.video? (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"><source src={vibe.video} type="video/mp4" /></video>) : (<img src={vibe.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />)}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-5 left-5 text-left"><h3 className="text-[#FFD700] text-2xl font-black drop-shadow-lg" style={{ fontFamily: "'Fraunces', serif" }}>{vibe.name.toUpperCase()}</h3><p className="text-white/90 text-sm">{vibe.desc}</p></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-5 pb-20">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-2 mb-4"><span className="text-xs font-black mr-2 pt-2 text-[#FFD700]">CATEGORY:</span>{CATEGORIES.map((c) => (<button key={c} onClick={() => setFilter(c)} className={`text-xs px-4 py-1.5 border ${filter === c? "bg-[#FFD700] text-black font-black" : "border-white/20 hover:border-[#FFD700]"}`}>{c.toUpperCase()}</button>))}</div>
        <div className="flex flex-wrap gap-2 mb-4"><span className="text-xs font-black mr-2 pt-2 text-[#FFD700]">WHO:</span>{GENDERS.map((g) => (<button key={g} onClick={() => setGenderFilter(g)} className={`text-xs px-4 py-1.5 border ${genderFilter === g? "bg-[#FFD700] text-black font-black" : "border-white/20 hover:border-[#FFD700]"}`}>{g.toUpperCase()}</button>))}</div>
        <div className="flex flex-wrap gap-2 mb-4"><span className="text-xs font-black mr-2 pt-2 text-[#FFD700]">AGE:</span>{AGES.map((a) => (<button key={a} onClick={() => setAgeFilter(a)} className={`text-xs px-4 py-1.5 border ${ageFilter === a? "bg-[#FFD700] text-black font-black" : "border-white/20 hover:border-[#FFD700]"}`}>{a.toUpperCase()}</button>))}</div>
        <div className="flex flex-wrap gap-2 mb-8"><span className="text-xs font-black mr-2 pt-2 text-[#FFD700]">VIBE:</span>{STYLES.map((s) => (<button key={s} onClick={() => setStyleFilter(s)} className={`text-xs px-4 py-1.5 border ${styleFilter === s? "bg-[#FFD700] text-black font-black" : "border-white/20 hover:border-[#FFD700]"}`}>{s.toUpperCase()}</button>))}</div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{visible.map((p) => <ProductCard key={p.id} product={p} onAdd={(item) => setCart([...cart, item])} />)}</div>

        {/* CART */}
        {cart.length > 0 && (<div className="mt-12 p-6 border-2 border-[#FFD700] bg-[#0A0A0A]"><h3 className="text-2xl font-black mb-4 text-[#FFD700]" style={{ fontFamily: "'Fraunces', serif" }}>YOUR KING'S CART 👑</h3>{cart.map((i, idx) => <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-white/5"><span>{i.name}</span><span className="text-[#FFD700]">{formatKES(i.price)}</span></div>)}<div className="flex justify-between font-black text-xl border-t-2 border-[#FFD700] pt-3 mt-3 text-[#FFD700]"><span>TOTAL</span><span>{formatKES(cartTotal)}</span></div><div className="flex gap-3 mt-5"><button onClick={handleMpesaPay} className="flex-1 bg-[#FFD700] text-black font-black py-4 flex items-center justify-center gap-2 text-sm"><Wallet size={18}/> PAY WITH MPESA</button><button onClick={handleWhatsAppOrder} className="flex-1 bg-[#25D366] text-white font-black py-4 flex items-center justify-center gap-2 text-sm"><Phone size={18}/> ORDER ON WHATSAPP</button></div></div>)}
      </main>

      <footer className="border-t-2 border-[#FFD700] py-10"><div className="max-w-6xl mx-auto px-5 text-xs text-white/60">© {new Date().getFullYear()} {BRAND}. {TAGLINE}. ALL HAIL THE KING.</div></footer>
    </div>
  );
}