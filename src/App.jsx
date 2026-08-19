import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Phone,
  Wallet,
  Crown,
  Flame,
  Truck,
  ShieldCheck,
  X,
  SlidersHorizontal,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const BRAND = "BALEKING";
const TAGLINE = "GRADE 1 OR NOTHING";
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
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "BK Crown Logo. Flat brim. 1 size",
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
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Cropped. Pink, Black, Cream. Sizes S-L",
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
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Anime, Band, Quote tees. Sizes S-XXL",
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
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "High waist. No rips. Sizes 24-32",
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
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Reversible. Multiple prints",
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
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Ages 4-12. Cartoon prints",
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
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2fa?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Party dress. Ages 4-10",
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
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Blazer + Trouser. Office queen. Sizes 8-16",
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
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&h=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab417d9?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "Golf/Casual. Sizes M-XXL",
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
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&h=1200&auto=format&fit=crop",
    note: "White. Ages 6-16. Strong fabric",
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

const VIBES = [
  {
    name: "Casual",
    desc: "Everyday King",
    img: "https://images.unsplash.com/photo-1489987708160-a9753f8ee04b?q=80&w=900&h=700&auto=format&fit=crop",
  },
  {
    name: "Official",
    desc: "CEO Energy",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&h=700&auto=format&fit=crop",
  },
  {
    name: "Streetwear",
    desc: "King Drip",
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&h=700&auto=format&fit=crop",
  },
];

function formatKES(value) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden border border-[#FFD700]/15 bg-[#0A0A0A] hover:border-[#FFD700]/70"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />

        {product.was && (
          <span className="absolute left-3 top-3 bg-[#FFD700] px-2 py-1 text-[10px] font-black text-black">
            KING SALE
          </span>
        )}

        <div className="absolute right-3 top-3 flex max-w-[75%] flex-wrap justify-end gap-1">
          <span className="bg-[#FFD700] px-2 py-1 text-[9px] font-black text-black">
            {product.style.toUpperCase()}
          </span>
          <span className="bg-black/80 px-2 py-1 text-[9px] font-black text-[#FFD700]">
            {product.gender.toUpperCase()}
          </span>
        </div>

        {quantity > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/90 px-2 py-1 text-xs font-black">
            <ShoppingBag size={13} className="text-[#FFD700]" />
            {quantity} IN CART
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="text-[16px] font-black tracking-wide text-white"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-white/50">
          {product.grade} · {product.category}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <span className="text-[19px] font-black text-[#FFD700]">
            {formatKES(product.price)}
          </span>

          {product.was && (
            <span className="text-xs text-white/35 line-through">
              {formatKES(product.was)}
            </span>
          )}
        </div>

        <p className="mt-2 min-h-[40px] text-xs leading-5 text-white/55">
          {product.note}
        </p>

        {quantity === 0 ? (
          <button
            onClick={() => onAdd(product)}
            className="mt-3 flex w-full items-center justify-center gap-2 bg-[#FFD700] py-3 text-xs font-black tracking-widest text-black transition hover:bg-white"
          >
            <ShoppingBag size={15} />
            ADD TO CART
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onRemove(product.id)}
              className="flex h-11 w-11 items-center justify-center border border-white/20 hover:border-[#FFD700]"
              aria-label={`Remove ${product.name}`}
            >
              <Minus size={16} />
            </button>

            <div className="flex h-11 flex-1 items-center justify-center border border-[#FFD700]/40 text-sm font-black">
              {quantity}
            </div>

            <button
              onClick={() => onAdd(product)}
              className="flex h-11 w-11 items-center justify-center bg-[#FFD700] text-black"
              aria-label={`Add another ${product.name}`}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function FilterGroup({ title, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-[#FFD700]">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`border px-3 py-2 text-[10px] font-black transition ${
              value === option
                ? "border-[#FFD700] bg-[#FFD700] text-black"
                : "border-white/15 text-white hover:border-[#FFD700]"
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Duka() {
  const [filter, setFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const visible = useMemo(() => {
    return PRODUCTS.filter(
      (product) =>
        (filter === "All" || product.category === filter) &&
        (genderFilter === "All" ||
          product.gender === genderFilter ||
          product.gender === "Unisex") &&
        (ageFilter === "All" ||
          product.age === ageFilter ||
          product.age === "All") &&
        (styleFilter === "All" || product.style === styleFilter)
    );
  }, [filter, genderFilter, ageFilter, styleFilter]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const deleteFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const clearFilters = () => {
    setFilter("All");
    setGenderFilter("All");
    setAgeFilter("All");
    setStyleFilter("All");
  };

  const activeFilterCount = [
    filter !== "All",
    genderFilter !== "All",
    ageFilter !== "All",
    styleFilter !== "All",
  ].filter(Boolean).length;

  const selectVibe = (vibe) => {
    setStyleFilter(vibe);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleMpesaInfo = () => {
    alert(
      "M-PESA PAYMENT\n\nPlease contact BALEKING for the official M-Pesa payment instructions.\n\nNo payment has been made."
    );
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert("YOUR CART IS EMPTY KING 👑");
      return;
    }

    const items = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - ${formatKES(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message = `👑 YO BALEKING!\n\nI want to order:\n${items}\n\nTOTAL: ${formatKES(
      cartTotal
    )}\n\nDELIVERY LOCATION:`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800;900&family=Inter:wght@700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b-2 border-[#FFD700] bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFD700] sm:h-11 sm:w-11">
              <Crown size={23} className="text-black" />
            </div>

            <div className="min-w-0">
              <span className="block truncate text-lg font-black tracking-[0.25em] text-[#FFD700] sm:text-2xl sm:tracking-[0.4em]">
                {BRAND}
              </span>

              <div className="text-[8px] tracking-[0.3em] text-white/60 sm:text-[10px] sm:tracking-[0.5em]">
                {TAGLINE}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 border border-[#FFD700]/40 px-3 py-2 text-[10px] font-black text-[#FFD700] sm:text-xs"
          >
            <ShoppingBag size={16} />
            CART
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center bg-[#FFD700] px-1 text-[9px] text-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-5 sm:pb-14 sm:pt-16">
        <div className="mb-5 flex items-center gap-2">
          <Flame size={18} className="text-[#FFD700]" />
          <span
            className="text-[10px] uppercase tracking-[0.25em] text-[#FFD700] sm:text-xs sm:tracking-[0.4em]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            NEW BALE. NEW RULES.
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-black leading-[0.9] sm:text-7xl lg:text-8xl">
          RULE THE <span className="text-[#FFD700]">BALE.</span>
        </h1>

        <p className="mb-8 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
          We don't sell rags. We sell crowns. MPESA. Delivery Mombasa & Nairobi.
          24hrs.
        </p>

        {/* VIBES */}
        <div>
          <h2
            className="mb-4 text-xs uppercase tracking-[0.3em] text-white sm:mb-5 sm:text-sm sm:tracking-[0.4em]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            CHOOSE YOUR KINGDOM
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {VIBES.map((vibe) => (
              <button
                key={vibe.name}
                onClick={() => selectVibe(vibe.name)}
                className="group relative h-36 overflow-hidden border-2 border-[#FFD700]/20 text-left transition hover:border-[#FFD700] sm:h-52"
              >
                <img
                  src={vibe.img}
                  alt={vibe.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <h3
                    className="text-xl font-black text-[#FFD700] sm:text-2xl"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {vibe.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-white/90 sm:text-sm">
                    {vibe.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <main
        id="products"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-5"
      >
        {/* FILTER BUTTON */}
        <div className="mb-6 border border-[#FFD700]/20 bg-[#090909]">
          <button
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <span className="flex items-center gap-2 text-xs font-black text-[#FFD700]">
              <SlidersHorizontal size={16} />
              FILTER PRODUCTS
              {activeFilterCount > 0 && (
                <span className="bg-[#FFD700] px-2 py-1 text-[9px] text-black">
                  {activeFilterCount} ACTIVE
                </span>
              )}
            </span>

            <ChevronDown
              size={18}
              className={`transition-transform ${
                filtersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-5 border-t border-[#FFD700]/10 p-4">
                  <FilterGroup
                    title="CATEGORY"
                    options={CATEGORIES}
                    value={filter}
                    onChange={setFilter}
                  />

                  <FilterGroup
                    title="GENDER"
                    options={GENDERS}
                    value={genderFilter}
                    onChange={setGenderFilter}
                  />

                  <FilterGroup
                    title="AGE"
                    options={AGES}
                    value={ageFilter}
                    onChange={setAgeFilter}
                  />

                  <FilterGroup
                    title="VIBE"
                    options={STYLES}
                    value={styleFilter}
                    onChange={setStyleFilter}
                  />

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs font-black text-white underline"
                    >
                      <X size={13} />
                      CLEAR ALL FILTERS
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTIVE FILTERS */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-[#FFD700]">FILTERING:</span>

            {filter !== "All" && (
              <span className="bg-[#FFD700] px-2 py-1 text-[10px] font-black text-black">
                {filter}
              </span>
            )}

            {genderFilter !== "All" && (
              <span className="bg-[#FFD700] px-2 py-1 text-[10px] font-black text-black">
                {genderFilter}
              </span>
            )}

            {ageFilter !== "All" && (
              <span className="bg-[#FFD700] px-2 py-1 text-[10px] font-black text-black">
                {ageFilter}
              </span>
            )}

            {styleFilter !== "All" && (
              <span className="bg-[#FFD700] px-2 py-1 text-[10px] font-black text-black">
                {styleFilter}
              </span>
            )}
          </div>
        )}

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-white/40">SHOWING</p>
            <h2 className="text-2xl font-black text-white">
              {visible.length} KING PICKS
            </h2>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visible.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cartItem?.quantity || 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              );
            })}
          </div>
        ) : (
          <div className="border border-[#FFD700]/20 p-10 text-center">
            <Crown className="mx-auto mb-3 text-[#FFD700]" />
            <h3 className="text-xl font-black">NO KING PICKS FOUND</h3>
            <button
              onClick={clearFilters}
              className="mt-4 bg-[#FFD700] px-5 py-3 text-xs font-black text-black"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}

        {/* TRUST STRIP */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="border border-white/10 p-4">
            <Truck className="mb-2 text-[#FFD700]" size={20} />
            <p className="text-xs font-black">FAST DELIVERY</p>
            <p className="mt-1 text-[10px] text-white/45">
              Mombasa & Nairobi
            </p>
          </div>

          <div className="border border-white/10 p-4">
            <ShieldCheck className="mb-2 text-[#FFD700]" size={20} />
            <p className="text-xs font-black">GRADE 1 QUALITY</p>
            <p className="mt-1 text-[10px] text-white/45">
              Selected bale pieces
            </p>
          </div>

          <div className="border border-white/10 p-4">
            <MessageCircle className="mb-2 text-[#FFD700]" size={20} />
            <p className="text-xs font-black">ORDER ON WHATSAPP</p>
            <p className="mt-1 text-[10px] text-white/45">
              Quick order confirmation
            </p>
          </div>
        </div>
      </main>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#FFD700]/30 bg-[#080808]"
            >
              <div className="flex items-center justify-between border-b border-[#FFD700]/20 p-5">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-[#FFD700]">
                    YOUR
                  </p>
                  <h2
                    className="text-2xl font-black"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    KING'S CART 👑
                  </h2>
                </div>

                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 text-white/60 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag size={45} className="mb-4 text-[#FFD700]" />
                    <h3 className="text-xl font-black">CART IS EMPTY</h3>
                    <p className="mt-2 text-xs text-white/45">
                      Add some king pieces to get started.
                    </p>

                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-5 bg-[#FFD700] px-5 py-3 text-xs font-black text-black"
                    >
                      SHOP NOW
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="border border-white/10 bg-[#0D0D0D] p-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-16 object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-black">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-[#FFD700]">
                              {formatKES(item.price)}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex h-7 w-7 items-center justify-center border border-white/20"
                              >
                                <Minus size={12} />
                              </button>

                              <span className="text-xs font-black">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => addToCart(item)}
                                className="flex h-7 w-7 items-center justify-center bg-[#FFD700] text-black"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteFromCart(item.id)}
                            className="self-start text-white/30 hover:text-red-400"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-[#FFD700]/30 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-white/50">TOTAL</span>
                    <span className="text-2xl font-black text-[#FFD700]">
                      {formatKES(cartTotal)}
                    </span>
                  </div>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="mb-3 flex w-full items-center justify-center gap-2 bg-[#25D366] py-4 text-xs font-black text-white"
                  >
                    <MessageCircle size={18} />
                    ORDER ON WHATSAPP
                  </button>

                  <button
                    onClick={handleMpesaInfo}
                    className="flex w-full items-center justify-center gap-2 border border-[#FFD700] py-4 text-xs font-black text-[#FFD700]"
                  >
                    <Wallet size={18} />
                    M-PESA PAYMENT INFO
                  </button>

                  <p className="mt-3 text-center text-[9px] leading-4 text-white/35">
                    Payment is not processed by this website. Contact BALEKING
                    for official payment instructions.
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING CART */}
      {cartCount > 0 && !cartOpen && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between bg-[#FFD700] px-5 py-4 text-black shadow-2xl sm:left-auto sm:right-6 sm:w-80"
        >
          <span className="flex items-center gap-2 text-xs font-black">
            <ShoppingBag size={18} />
            {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
          </span>

          <span className="text-sm font-black">
            {formatKES(cartTotal)} →
          </span>
        </motion.button>
      )}

      {/* FOOTER */}
      <footer className="border-t-2 border-[#FFD700] py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-black tracking-[0.3em] text-[#FFD700]">
                {BRAND}
              </div>
              <div className="mt-1 text-[9px] tracking-[0.3em] text-white/40">
                {TAGLINE}
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-2 border border-[#25D366] px-4 py-3 text-xs font-black text-[#25D366]"
            >
              <Phone size={15} />
              CONTACT BALEKING
            </a>
          </div>

          <p className="mt-8 text-[10px] text-white/35">
            © {new Date().getFullYear()} {BRAND}. {TAGLINE}. ALL HAIL THE KING.
          </p>
        </div>
      </footer>
    </div>
  );
}