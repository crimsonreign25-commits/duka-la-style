import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Flame,
  Wallet,
  Crown,
  Phone,
  MessageCircle,
  X,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  ShieldCheck,
} from "lucide-react";

const BRAND = "BALEKING";
const TAGLINE = "GRADE 1 OR NOTHING";

// WhatsApp number that receives customer messages.
// CHANGE THIS to the owner's real WhatsApp number.
const WHATSAPP_NUMBER = "254710574821";

const PRODUCTS = [
  {
    id: 1,
    name: "BK OVERSIZED HOODIE",
    grade: "Grade 1 · 400GSM",
    category: "Hoodies",
    style: "Streetwear",
    gender: "Male",
    age: "Adult",
    price: 2900,
    was: 3800,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    note: "Heavyweight. Black, Cream, Grey. The king piece",
  },
  {
    id: 2,
    name: "BK CARGO JEANS",
    grade: "Grade 1",
    category: "Jeans",
    style: "Streetwear",
    gender: "Male",
    age: "Adult",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
    note: "6 Pockets. Baggy fit. Waist 30-40",
  },
  {
    id: 3,
    name: "BK VINTAGE TEE",
    grade: "Grade 1 · 100% Cotton",
    category: "T-Shirts",
    style: "Streetwear",
    gender: "Male",
    age: "Adult",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1000&auto=format&fit=crop",
    note: "Faded wash. Sizes M-XXL. Drip tee",
  },
  {
    id: 4,
    name: "BK PUFFER JACKET",
    grade: "Grade 1",
    category: "Jackets",
    style: "Streetwear",
    gender: "Male",
    age: "Adult",
    price: 3500,
    was: 4500,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    note: "Winter drip. Black, Navy. Sizes L-XXL",
  },
  {
    id: 5,
    name: "BK SNAPBACK",
    grade: "Grade 1",
    category: "Caps",
    style: "Streetwear",
    gender: "Male",
    age: "Adult",
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1000&auto=format&fit=crop",
    note: "BK Crown Logo. Flat brim. 1 size",
  },
  {
    id: 6,
    name: "BK MAXI DRESS",
    grade: "Grade 1 · Cotton",
    category: "Dresses",
    style: "Casual",
    gender: "Female",
    age: "Adult",
    price: 1300,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
    note: "Floral, Ankara. Sizes S-XL. Church/Outing",
  },
  {
    id: 7,
    name: "BK MOM JEANS",
    grade: "Grade 1",
    category: "Jeans",
    style: "Casual",
    gender: "Female",
    age: "Adult",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
    note: "High waist. No rips. Sizes 24-32",
  },
  {
    id: 8,
    name: "BK CROP HOODIE",
    grade: "Grade 1",
    category: "Hoodies",
    style: "Streetwear",
    gender: "Female",
    age: "Adult",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
    note: "Cropped. Pink, Black, Cream. Sizes S-L",
  },
  {
    id: 9,
    name: "BK BLAZER SET",
    grade: "Grade 1",
    category: "Jackets",
    style: "Official",
    gender: "Female",
    age: "Adult",
    price: 3200,
    was: 4000,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    note: "Blazer + Trouser. Office queen. Sizes 8-16",
  },
  {
    id: 10,
    name: "BK MINI SKIRT",
    grade: "Grade 1",
    category: "Skirts",
    style: "Streetwear",
    gender: "Female",
    age: "Adult",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop",
    note: "Denim, Pleated. Sizes S-L",
  },
  {
    id: 11,
    name: "BK GRAPHIC TEE",
    grade: "Grade 1",
    category: "Printed T-Shirts",
    style: "Streetwear",
    gender: "Unisex",
    age: "All",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
    note: "Anime, Band, Quote tees. Sizes S-XXL",
  },
  {
    id: 12,
    name: "BK TRACKSUIT",
    grade: "Grade 1",
    category: "Tracksuits",
    style: "Casual",
    gender: "Unisex",
    age: "Adult",
    price: 2800,
    was: 3500,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    note: "Hoodie + Sweatpants. Grey, Black",
  },
  {
    id: 13,
    name: "BK DENIM JACKET",
    grade: "Grade 1",
    category: "Jackets",
    style: "Casual",
    gender: "Unisex",
    age: "Adult",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1000&auto=format&fit=crop",
    note: "Vintage wash. Oversized fit",
  },
  {
    id: 14,
    name: "BK BUCKET HAT",
    grade: "Grade 1",
    category: "Caps",
    style: "Casual",
    gender: "Unisex",
    age: "All",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
    note: "Reversible. Multiple prints",
  },
  {
    id: 15,
    name: "BK OXFORD SHIRT",
    grade: "Grade 1",
    category: "Shirts",
    style: "Official",
    gender: "Male",
    age: "Adult",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
    note: "White, Blue, Pink. Ironed. Sizes M-XXL",
  },
  {
    id: 16,
    name: "BK CHINO PANTS",
    grade: "Grade 1",
    category: "Trousers",
    style: "Official",
    gender: "Male",
    age: "Adult",
    price: 1400,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
    note: "Khaki, Navy, Black. Waist 30-38",
  },
  {
    id: 17,
    name: "BK POLO SHIRT",
    grade: "Grade 1",
    category: "Polos",
    style: "Official",
    gender: "Male",
    age: "Adult",
    price: 1300,
    image:
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab417d9?q=80&w=1000&auto=format&fit=crop",
    note: "Golf/Casual. Sizes M-XXL",
  },
  {
    id: 18,
    name: "BK KIDS HOODIE",
    grade: "Grade 1",
    category: "Hoodies",
    style: "Casual",
    gender: "Unisex",
    age: "Child",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2fa?q=80&w=1000&auto=format&fit=crop",
    note: "Ages 4-12. Cartoon prints",
  },
  {
    id: 19,
    name: "BK SCHOOL SHIRT",
    grade: "Grade 1",
    category: "Shirts",
    style: "Official",
    gender: "Unisex",
    age: "Child",
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
    note: "White. Ages 6-16. Strong fabric",
  },
  {
    id: 20,
    name: "BK KIDS DRESS",
    grade: "Grade 1",
    category: "Dresses",
    style: "Casual",
    gender: "Female",
    age: "Child",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2fa?q=80&w=1000&auto=format&fit=crop",
    note: "Party dress. Ages 4-10",
  },
];

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Printed T-Shirts",
  "Polos",
  "Hoodies",
  "Jackets",
  "Tracksuits",
  "Caps",
  "Jeans",
  "Trousers",
  "Dresses",
  "Skirts",
  "Shirts",
];

const GENDERS = ["All", "Male", "Female", "Unisex"];
const AGES = ["All", "Adult", "Child"];
const STYLES = ["All", "Casual", "Streetwear", "Official"];

function formatKES(n) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);
}

/* -------------------------------------------------------
   SAFE IMAGE
   Prevents broken-image icons.
------------------------------------------------------- */

function SafeImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-[#161616] via-[#0b0b0b] to-black flex items-center justify-center`}
      >
        <div className="text-center">
          <Crown size={42} className="mx-auto text-[#FFD700] mb-3" />
          <p className="text-[#FFD700] text-xs font-black tracking-[0.25em]">
            BALEKING
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* -------------------------------------------------------
   PRODUCT CARD
------------------------------------------------------- */

function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group bg-[#0A0A0A] border border-[#FFD700]/10 overflow-hidden hover:border-[#FFD700] transition-colors"
    >
      <div className="relative h-[420px] overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

        {product.was && (
          <span className="absolute top-3 left-3 text-[10px] bg-[#FFD700] text-black font-black px-2 py-1">
            KING SALE
          </span>
        )}

        <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end max-w-[70%]">
          <span className="text-[9px] bg-[#FFD700] text-black px-2 py-1 font-black">
            {product.style.toUpperCase()}
          </span>

          <span className="text-[9px] bg-black/80 text-[#FFD700] px-2 py-1 font-black">
            {product.gender.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="text-[17px] font-black text-white"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {product.name}
        </h3>

        <p className="text-xs text-white/50 mt-1">
          {product.grade} • {product.category}
        </p>

        <div className="flex items-end justify-between mt-3">
          <div className="text-[20px] font-black text-[#FFD700]">
            {formatKES(product.price)}
          </div>

          {product.was && (
            <div className="text-[12px] line-through text-white/40">
              {formatKES(product.was)}
            </div>
          )}
        </div>

        <p className="text-xs text-white/60 mt-2 min-h-[32px]">
          {product.note}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="w-full mt-3 bg-[#FFD700] text-black font-black py-3 text-xs uppercase tracking-widest hover:bg-white transition-colors"
        >
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------
   MAIN APP
------------------------------------------------------- */

export default function Duka() {
  const [filter, setFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const visible = PRODUCTS.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      (genderFilter === "All" ||
        p.gender === genderFilter ||
        p.gender === "Unisex") &&
      (ageFilter === "All" || p.age === ageFilter || p.age === "All") &&
      (styleFilter === "All" || p.style === styleFilter)
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  /* -------------------------------------------------------
     WHATSAPP CHAT
  ------------------------------------------------------- */

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "👑 Yo BALEKING! I want to ask about your clothes."
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank"
    );
  };

  /* -------------------------------------------------------
     WHATSAPP ORDER
  ------------------------------------------------------- */

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert("CART IS EMPTY KING 👑");
      return;
    }

    const items = cart
      .map((item) => `• ${item.name} - ${formatKES(item.price)}`)
      .join("\n");

    const message = `
👑 BALEKING ORDER

${items}

TOTAL: ${formatKES(cartTotal)}

DELIVERY LOCATION:
`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  /* -------------------------------------------------------
     MPESA
  ------------------------------------------------------- */

  const handleMpesaPay = () => {
    if (cart.length === 0) {
      alert("CART IS EMPTY KING 👑");
      return;
    }

    alert(
      `MPESA PAYMENT\n\nTOTAL: ${formatKES(
        cartTotal
      )}\n\nConnect your real M-Pesa Daraja backend here to send an STK Push.`
    );
  };

  const clearFilters = () => {
    setFilter("All");
    setGenderFilter("All");
    setAgeFilter("All");
    setStyleFilter("All");
  };

  const selectVibe = (vibe) => {
    setStyleFilter(vibe);

    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800;900&family=Inter:wght@400;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050505;
          font-family: 'Inter', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b-2 border-[#FFD700]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-[#FFD700] flex items-center justify-center">
              <Crown size={30} className="text-black" />
            </div>

            <div className="min-w-0">
              <div className="tracking-[0.28em] sm:tracking-[0.4em] text-xl sm:text-2xl font-black text-[#FFD700] truncate">
                {BRAND}
              </div>

              <div className="text-[8px] sm:text-[10px] tracking-[0.35em] text-white/60">
                {TAGLINE}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* CHAT */}
            <button
              onClick={openWhatsApp}
              className="hidden sm:flex items-center gap-2 border-2 border-[#25D366] text-[#25D366] px-5 py-3 font-black hover:bg-[#25D366] hover:text-black transition-colors"
            >
              <MessageCircle size={18} />
              CHAT
            </button>

            {/* CART */}
            <button
              onClick={() =>
                document
                  .getElementById("cart")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 border-2 border-[#FFD700] text-[#FFD700] px-4 sm:px-5 py-3 font-black hover:bg-[#FFD700] hover:text-black transition-colors"
            >
              <ShoppingBag size={18} />
              <span>CART</span>
              {cart.length > 0 && (
                <span className="bg-[#FFD700] text-black px-1.5 text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 pt-16 sm:pt-20 pb-14">
        <div className="flex items-center gap-2 mb-5">
          <Flame size={20} className="text-[#FFD700]" />

          <span
            className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#FFD700]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            NEW BALE. NEW RULES.
          </span>
        </div>

        <h1 className="text-6xl sm:text-8xl leading-[0.9] mb-5 font-black">
          RULE THE{" "}
          <span className="text-[#FFD700]">
            BALE.
          </span>
        </h1>

        <p className="text-white/70 max-w-xl text-base sm:text-lg mb-8 leading-relaxed">
          We don't sell rags. We sell crowns. MPESA.
          Delivery Mombasa & Nairobi. 24hrs.
        </p>

        {/* BIG WHATSAPP BUTTON */}
        <button
          onClick={openWhatsApp}
          className="bg-[#25D366] text-white font-black py-4 px-6 flex items-center justify-center gap-3 text-sm sm:text-base hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
        >
          <MessageCircle size={24} />
          CHAT WITH US ON WHATSAPP
        </button>
      </section>

      {/* KINGDOMS */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <h2
          className="text-sm uppercase tracking-[0.35em] mb-6"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          CHOOSE YOUR KINGDOM
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* CASUAL */}
          <button
            onClick={() => selectVibe("Casual")}
            className="group relative overflow-hidden h-64 sm:h-56 border-2 border-[#FFD700]/20 hover:border-[#FFD700] text-left"
          >
            <SafeImage
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop"
              alt="Casual fashion"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <h3
                className="text-3xl text-[#FFD700] font-black"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                CASUAL
              </h3>

              <p className="text-white text-sm">Everyday King</p>
            </div>
          </button>

          {/* OFFICIAL */}
          <button
            onClick={() => selectVibe("Official")}
            className="group relative overflow-hidden h-64 sm:h-56 border-2 border-[#FFD700]/20 hover:border-[#FFD700] text-left"
          >
            <SafeImage
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop"
              alt="Official fashion"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <h3
                className="text-3xl text-[#FFD700] font-black"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                OFFICIAL
              </h3>

              <p className="text-white text-sm">CEO Energy</p>
            </div>
          </button>

          {/* STREETWEAR */}
          <button
            onClick={() => selectVibe("Streetwear")}
            className="group relative overflow-hidden h-64 sm:h-56 border-2 border-[#FFD700]/20 hover:border-[#FFD700] text-left"
          >
            <SafeImage
              src="https://images.unsplash.com/photo-1529139555592-44c9473e6e5b?q=80&w=1200&auto=format&fit=crop"
              alt="Streetwear fashion"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <h3
                className="text-3xl text-[#FFD700] font-black"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                STREETWEAR
              </h3>

              <p className="text-white text-sm">King Drip</p>
            </div>
          </button>
        </div>
      </section>

      {/* PRODUCTS */}
      <main
        id="products"
        className="max-w-6xl mx-auto px-5 pb-20"
      >
        {/* MOBILE FILTER TOGGLE */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="lg:hidden w-full mb-4 border border-[#FFD700]/30 p-5 flex items-center justify-between text-[#FFD700] font-black"
        >
          <span className="flex items-center gap-3">
            <SlidersHorizontal size={20} />
            FILTER PRODUCTS
          </span>

          <ChevronDown
            className={`transition-transform ${
              filterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* FILTERS */}
        <div
          className={`mb-8 p-5 border border-[#FFD700]/20 ${
            filterOpen ? "block" : "hidden"
          } lg:block`}
        >
          {/* CATEGORY */}
          <FilterRow
            title="CATEGORY"
            options={CATEGORIES}
            value={filter}
            onChange={setFilter}
          />

          {/* GENDER */}
          <FilterRow
            title="GENDER"
            options={GENDERS}
            value={genderFilter}
            onChange={setGenderFilter}
          />

          {/* AGE */}
          <FilterRow
            title="AGE"
            options={AGES}
            value={ageFilter}
            onChange={setAgeFilter}
          />

          {/* VIBE */}
          <FilterRow
            title="VIBE"
            options={STYLES}
            value={styleFilter}
            onChange={setStyleFilter}
            last
          />
        </div>

        {/* ACTIVE FILTERS */}
        {(filter !== "All" ||
          genderFilter !== "All" ||
          ageFilter !== "All" ||
          styleFilter !== "All") && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#FFD700]">
              FILTERING:
            </span>

            {filter !== "All" && (
              <FilterTag text={filter} />
            )}

            {genderFilter !== "All" && (
              <FilterTag text={genderFilter} />
            )}

            {ageFilter !== "All" && (
              <FilterTag text={ageFilter} />
            )}

            {styleFilter !== "All" && (
              <FilterTag text={styleFilter} />
            )}

            <button
              onClick={clearFilters}
              className="text-xs underline flex items-center gap-1 ml-2"
            >
              <X size={12} />
              CLEAR ALL
            </button>
          </div>
        )}

        {/* RESULTS */}
        <div className="mb-5 flex justify-between items-center">
          <p className="text-xs text-white/50">
            SHOWING {visible.length} PRODUCTS
          </p>
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(item) =>
                  setCart((current) => [...current, item])
                }
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[#FFD700]/20">
            <Crown
              size={45}
              className="mx-auto text-[#FFD700] mb-4"
            />

            <h3 className="text-xl font-black">
              NO KING PIECES FOUND
            </h3>

            <button
              onClick={clearFilters}
              className="mt-5 bg-[#FFD700] text-black px-6 py-3 font-black text-sm"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}

        {/* CART */}
        {cart.length > 0 && (
          <section
            id="cart"
            className="mt-14 p-6 border-2 border-[#FFD700] bg-[#0A0A0A]"
          >
            <h3
              className="text-3xl font-black mb-5 text-[#FFD700]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              YOUR KING'S CART 👑
            </h3>

            {cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex justify-between items-center gap-3 text-sm py-3 border-b border-white/10"
              >
                <span>{item.name}</span>

                <div className="flex items-center gap-3">
                  <span className="text-[#FFD700]">
                    {formatKES(item.price)}
                  </span>

                  <button
                    onClick={() =>
                      setCart((current) =>
                        current.filter((_, i) => i !== index)
                      )
                    }
                    className="text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between font-black text-xl border-t-2 border-[#FFD700] pt-4 mt-4 text-[#FFD700]">
              <span>TOTAL</span>
              <span>{formatKES(cartTotal)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <button
                onClick={handleMpesaPay}
                className="bg-[#FFD700] text-black font-black py-4 flex items-center justify-center gap-2"
              >
                <Wallet size={19} />
                PAY WITH MPESA
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="bg-[#25D366] text-white font-black py-4 flex items-center justify-center gap-2"
              >
                <MessageCircle size={19} />
                ORDER ON WHATSAPP
              </button>
            </div>
          </section>
        )}
      </main>

      {/* TRUST SECTION */}
      <section className="border-y border-[#FFD700]/20 py-10">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Trust
            icon={<Truck />}
            title="FAST DELIVERY"
            text="Mombasa & Nairobi"
          />

          <Trust
            icon={<Wallet />}
            title="MPESA READY"
            text="Easy Kenyan payments"
          />

          <Trust
            icon={<ShieldCheck />}
            title="GRADE 1"
            text="Quality over everything"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-[#FFD700] py-10">
        <div className="max-w-6xl mx-auto px-5 text-xs text-white/50">
          © {new Date().getFullYear()} {BRAND}. {TAGLINE}.
          ALL HAIL THE KING.
        </div>
      </footer>

      {/* MOBILE FLOATING WHATSAPP */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-5 right-5 z-40 w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl sm:hidden"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={31} />
      </button>
    </div>
  );
}

/* -------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------- */

function FilterRow({ title, options, value, onChange, last }) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${
        last ? "" : "mb-4"
      }`}
    >
      <span className="text-xs font-black mr-2 pt-2 text-[#FFD700]">
        {title}:
      </span>

      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`text-xs px-4 py-2 border transition-colors ${
            value === option
              ? "bg-[#FFD700] text-black border-[#FFD700] font-black"
              : "border-white/20 hover:border-[#FFD700]"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function FilterTag({ text }) {
  return (
    <span className="text-xs bg-[#FFD700] text-black px-2 py-1 font-black">
      {text}
    </span>
  );
}

function Trust({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-[#FFD700]">{icon}</div>

      <div>
        <div className="text-sm font-black">
          {title}
        </div>

        <div className="text-xs text-white/40">
          {text}
        </div>
      </div>
    </div>
  );
}