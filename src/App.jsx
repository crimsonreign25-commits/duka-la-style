import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, MessageCircle, Sparkles, Tag } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Emerald Wrap Dress",
    grade: "Grade 1 · Cream",
    category: "Dresses",
    price: 1200,
    was: 1800,
    color: "#2F5233",
    note: "First pick of the bale — barely worn.",
  },
  {
    id: 2,
    name: "Rust Midi Skirt",
    grade: "Grade 1",
    category: "Skirts",
    price: 700,
    color: "#BC5B39",
    note: "Pairs well with a plain white top.",
  },
  {
    id: 3,
    name: "Denim Straight Jeans",
    grade: "Grade 2",
    category: "Denim",
    price: 900,
    color: "#3A4A63",
    note: "True to size, no fading.",
  },
  {
    id: 4,
    name: "Mustard Blazer",
    grade: "Grade 1 · Cream",
    category: "Outerwear",
    price: 1600,
    was: 2200,
    color: "#E8A63D",
    note: "Sharp shoulders — great for interviews.",
  },
  {
    id: 5,
    name: "Ivory Slip Dress",
    grade: "Grade 1",
    category: "Dresses",
    price: 1000,
    color: "#EDE3D0",
    note: "Dress up or down with layering.",
  },
  {
    id: 6,
    name: "Charcoal Wide-Leg Trousers",
    grade: "Grade 2",
    category: "Trousers",
    price: 750,
    color: "#2B2620",
    note: "Office-ready, breathable fabric.",
  },
];

const WHATSAPP_NUMBER = "254700000000"; // placeholder — swap for the real business number

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
    <span
      className={`inline-flex items-center gap-1 text-[11px] tracking-wide uppercase px-2 py-1 ${tones[tone]}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </span>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <div className="group relative bg-[#F3E9DA] border border-[#1C2541]/10 flex flex-col">
      <div
        className="relative h-56 flex items-end justify-center overflow-hidden"
        style={{ backgroundColor: product.color }}
      >
        <div
          className="absolute -right-3 top-4 rotate-6 bg-[#F3E9DA] border border-[#1C2541]/20 px-3 py-2 shadow-sm"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="text-[10px] text-[#1C2541]/60 leading-none mb-0.5">TAG №{String(product.id).padStart(3, "0")}</div>
          <div className="text-sm font-bold text-[#1C2541] leading-none">{formatKES(product.price)}</div>
          {product.was && (
            <div className="text-[10px] text-[#1C2541]/50 line-through leading-none mt-0.5">
              {formatKES(product.was)}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag_ tone={product.grade.includes("Cream") ? "marigold" : "clay"}>{product.grade}</Tag_>
          <span className="text-[11px] uppercase tracking-wide text-[#1C2541]/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {product.category}
          </span>
        </div>
        <h3 className="text-lg leading-tight text-[#1C2541]" style={{ fontFamily: "'Fraunces', serif" }}>
          {product.name}
        </h3>
        <p className="text-sm text-[#1C2541]/70 flex-1">{product.note}</p>
        <button
          onClick={() => onAdd(product)}
          className="mt-2 flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-2.5 text-sm uppercase tracking-wide hover:bg-[#2B3654] transition-colors"
        >
          <Plus size={15} /> Add to bag
        </button>
      </div>
    </div>
  );
}

export default function Duka() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(PRODUCTS.map((p) => p.category))], []);
  const visible = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  function addToCart(product) {
    setCart((c) => {
      const found = c.find((i) => i.id === product.id);
      if (found) return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function changeQty(id, delta) {
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  function checkoutOnWhatsapp() {
    if (cart.length === 0) return;
    const lines = cart.map((i) => `• ${i.name} x${i.qty} — ${formatKES(i.price * i.qty)}`);
    const msg = [`Hi! I'd like to order:`, ...lines, ``, `Total: ${formatKES(total)}`].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#F3E9DA] text-[#2B2620]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap"
        rel="stylesheet"
      />

      <header className="sticky top-0 z-30 bg-[#1C2541] text-[#F3E9DA]">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>
              Duka
            </span>
            <span className="text-2xl text-[#E8A63D]" style={{ fontFamily: "'Fraunces', serif" }}>
              la Style
            </span>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 border border-[#F3E9DA]/30 px-3 py-2 hover:bg-[#F3E9DA]/10 transition-colors"
          >
            <ShoppingBag size={18} />
            <span className="text-sm hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8A63D] text-[#1C2541] text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-5 pt-14 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#BC5B39]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#BC5B39]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Fresh bale, opened this week
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
          Curated secondhand,
          <br />
          <span className="text-[#BC5B39]">styled for you.</span>
        </h1>
        <p className="text-[#2B2620]/70 max-w-md text-[15px]">
          Every piece hand-picked and graded — no digging through piles. Not sure what fits you? Message us for a
          free styling tip with any order.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-5 mb-6 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`whitespace-nowrap text-xs uppercase tracking-wide px-3 py-2 border transition-colors ${
              filter === c
                ? "bg-[#1C2541] text-[#F3E9DA] border-[#1C2541]"
                : "border-[#1C2541]/20 text-[#1C2541]/70 hover:border-[#1C2541]/50"
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {c}
          </button>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-[#1C2541] text-[#F3E9DA]">
        <div className="max-w-5xl mx-auto px-5 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
              Want a full look, not just a piece?
            </h2>
            <p className="text-[#F3E9DA]/60 text-sm">Book a styling session and we'll pull pieces for your body and budget.</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to book a styling session.")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#E8A63D] text-[#1C2541] px-5 py-3 text-sm uppercase tracking-wide font-medium hover:bg-[#f0b658] transition-colors whitespace-nowrap"
          >
            <MessageCircle size={16} /> Book on WhatsApp
          </a>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm h-full bg-[#F3E9DA] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2541]/10">
              <h3 className="text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                Your bag
              </h3>
              <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-[#1C2541]/5">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {cart.length === 0 && (
                <p className="text-sm text-[#2B2620]/50 flex items-center gap-2 mt-4">
                  <Tag size={14} /> Nothing here yet — add a piece to get started.
                </p>
              )}
              {cart.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 flex-shrink-0" style={{ backgroundColor: i.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{i.name}</div>
                    <div className="text-xs text-[#2B2620]/60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatKES(i.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border border-[#1C2541]/20">
                    <button onClick={() => changeQty(i.id, -1)} className="p-1.5 hover:bg-[#1C2541]/5">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-4 text-center">{i.qty}</span>
                    <button onClick={() => changeQty(i.id, 1)} className="p-1.5 hover:bg-[#1C2541]/5">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[#1C2541]/10">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-[#2B2620]/70">Total</span>
                <span className="font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatKES(total)}
                </span>
              </div>
              <button
                onClick={checkoutOnWhatsapp}
                disabled={cart.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm uppercase tracking-wide font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={16} /> Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
