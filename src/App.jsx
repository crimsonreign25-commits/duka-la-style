import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, MessageCircle, Sparkles, Tag, Phone, CheckCircle } from "lucide-react";

const PRODUCTS = [
  // PRINTED T-SHIRTS
  {
    id: 1,
    name: "DLS Graphic Tee",
    grade: "Grade 1 · Cotton",
    category: "Printed T-Shirts",
    price: 2500,
    was: 3200,
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Bold front print. Oversized fit.",
  },
  {
    id: 2,
    name: "Vintage Logo Tee",
    grade: "Grade 1",
    category: "Printed T-Shirts",
    price: 2300,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Washed look. 100% cotton.",
  },
  
  // HOODIES
  {
    id: 3,
    name: "DLS Signature Hoodie",
    grade: "Grade 1 · Heavy",
    category: "Hoodies",
    price: 4500,
    was: 5500,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Oversized. Perfect for Mombasa evenings.",
  },
  {
    id: 4,
    name: "Zip-Up Hoodie Black",
    grade: "Grade 1",
    category: "Hoodies",
    price: 4200,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Thick fleece. Front pockets.",
  },

  // CAPS
  {
    id: 5,
    name: "DLS Black Cap",
    grade: "Grade 1",
    category: "Caps",
    price: 1200,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Embroidered logo. Adjustable.",
  },
  {
    id: 6,
    name: "Dad Cap Cream",
    grade: "Grade 1",
    category: "Caps",
    price: 1300,
    image: "https://images.unsplash.com/photo-1576871396354-1e4e8fae8b2c?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Curved brim. Low profile.",
  },

  // T-SHIRTS
  {
    id: 7,
    name: "Classic Black T-Shirt",
    grade: "Grade 1",
    category: "T-Shirts",
    price: 1800,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Essential. True to size.",
  },

  // JEANS + TROUSERS
  {
    id: 8,
    name: "High-Waist Skinny Jeans",
    grade: "Grade 1",
    category: "Jeans",
    price: 2500,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Stretch fit. No rips.",
  },
  {
    id: 9,
    name: "Smart Office Trousers",
    grade: "Grade 1 · Cream",
    category: "Trousers",
    price: 2000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&h=500&auto=format&fit=crop",
    note: "Tailored fit. Office-ready.",
  },
];

const WHATSAPP_NUMBER = "254710574821";

function formatKES(n) {
  return "KSh " + n.toLocaleString("en-KE");
}

function Tag_({ children, tone = "clay" }) {
  const tones = {
    clay: "bg-[#BC5B39] text-[#F3E9DA]",
    marigold: "bg-[#E8A63D] text-[#1C2541]",
    ink: "bg-[#1C2541] text-[#F3E9DA]",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] tracking-wide uppercase px-2 py-1 ${tones[tone]}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {children}
    </span>
  );
}

function ProductCard({ product, onBuy }) {
  return (
    <div className="group relative bg-[#F3E9DA] border border-[#1C2541]/10 flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-64 flex items-end justify-center overflow-hidden">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.was && (
          <div className="absolute top-3 left-3 bg-[#BC5B39] text-[#F3E9DA] text-[10px] px-2 py-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            SAVE {formatKES(product.was - product.price)}
          </div>
        )}
        <div className="absolute -right-3 top-4 rotate-6 bg-[#F3E9DA] border border-[#1C2541]/20 px-3 py-2 shadow-sm">
          <div className="text-[10px] text-[#1C2541]/60 leading-none mb-0.5">TAG №{String(product.id).padStart(3, "0")}</div>
          <div className="text-sm font-bold text-[#1C2541] leading-none">{formatKES(product.price)}</div>
          {product.was && <div className="text-[10px] text-[#1C2541]/50 line-through leading-none mt-0.5">{formatKES(product.was)}</div>}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag_ tone={product.grade.includes("Cream")? "marigold" : "clay"}>{product.grade}</Tag_>
          <span className="text-[11px] uppercase tracking-wide text-[#1C2541]/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{product.category}</span>
        </div>
        <h3 className="text-lg leading-tight text-[#1C2541]" style={{ fontFamily: "'Fraunces', serif" }}>{product.name}</h3>
        <p className="text-sm text-[#1C2541]/70 flex-1">{product.note}</p>
        <button onClick={() => onBuy(product)} className="mt-2 flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-3 text-sm uppercase tracking-wide hover:bg-[#2B3654] transition-colors rounded">
          <Phone size={15} /> Buy with MPESA - {formatKES(product.price)}
        </button>
      </div>
    </div>
  );
}

export default function Duka() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);

  const categories = useMemo(() => ["All",...new Set(PRODUCTS.map((p) => p.category))], []);
  const visible = filter === "All"? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  async function buyWithMpesa(product) {
    const userPhone = prompt("Enter Safaricom number: 2547XXXXXXXX");
    if (!userPhone ||!userPhone.startsWith("2547")) {
      alert("Please enter valid Safaricom number starting with 2547");
      return;
    }
    setPaying(true);
    try {
      const res = await fetch(`/api/mpesa/stkpush?phone=${userPhone}&amount=${product.price}`);
      const data = await res.json();
      if(data.ResponseCode === "0"){
        alert(`MPESA prompt sent! Enter your PIN to pay ${formatKES(product.price)}`);
      } else {
        alert("Payment failed: " + (data.ResponseDescription || "Try again"));
      }
    } catch(e){
      alert("Error connecting to MPESA. Check internet");
    }
    setPaying(false);
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  function checkoutOnWhatsapp() {
    if (cart.length === 0) return;
    const lines = cart.map((i) => `• ${i.name} x${i.qty} — ${formatKES(i.price * i.qty)}`);
    const msg = [`Hi! I'd like to order:`,...lines, ``, `Total: ${formatKES(total)}`].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#F3E9DA] text-[#2B2620]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />

      <header className="sticky top-0 z-30 bg-[#1C2541] text-[#F3E9DA] shadow-md">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>Duka</span>
              <span className="text-2xl text-[#E8A63D]" style={{ fontFamily: "'Fraunces', serif" }}>la Style</span>
            </div>
            <p className="text-[10px] text-[#F3E9DA]/60 tracking-[0.2em]">CURATED SECONDHAND FASHION</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-xs text-[#E8A63D]"><CheckCircle size={14}/> MPESA Accepted</span>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 border border-[#F3E9DA]/30 px-3 py-2 hover:bg-[#F3E9DA]/10 transition-colors rounded">
              <ShoppingBag size={18} />
              {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-[#E8A63D] text-[#1C2541] text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-14 pb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#BC5B39]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#BC5B39]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Fresh bale, opened this week</span>
        </div>
        <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Curated secondhand,<br/><span className="text-[#BC5B39]">styled for you.</span></h1>
        <p className="text-[#2B2620]/70 max-w-xl mx-auto text-[15px] mb-4">Every piece hand-picked and graded — no digging through piles. Pay with MPESA, deliver in Mombasa.</p>
      </section>

      <div className="max-w-6xl mx-auto px-5 mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`whitespace-nowrap text-xs uppercase tracking-wide px-4 py-2 border rounded transition-colors ${filter === c? "bg-[#1C2541] text-[#F3E9DA] border-[#1C2541]" : "border-[#1C2541]/20 text-[#1C2541]/70 hover:border-[#1C2541]/50"}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {c}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => (<ProductCard key={p.id} product={p} onBuy={buyWithMpesa} />))}
        </div>
      </main>

      <footer className="bg-[#1C2541] text-[#F3E9DA]">
        <div className="max-w-6xl mx-auto px-5 py-12 text-center">
          <h2 className="text-2xl mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Want a full look, not just a piece?</h2>
          <p className="text-[#F3E9DA]/60 text-sm mb-4">Book a styling session and we'll pull pieces for your body and budget.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="inline-flex items-center gap-2 bg-[#E8A63D] text-[#1C2541] px-6 py-3 text-sm uppercase tracking-wide font-medium hover:bg-[#f0b658] transition-colors rounded">
            <MessageCircle size={16} /> Book on WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}