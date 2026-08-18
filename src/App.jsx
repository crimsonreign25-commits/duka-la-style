import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  Tag,
} from "lucide-react";

/* =========================================================
   STORE DETAILS
   ========================================================= */

const WHATSAPP_NUMBER = "254710574821";

const STORE_DETAILS = {
  phone: "0710574821",
  whatsapp: "254710574821",

  location: "Your store location",
  hours: "Mon – Sat: 8:00 AM – 6:00 PM",

  // Replace this when you have your actual Till/Paybill
  mpesaNumber: "YOUR TILL / PAYBILL",
};

/* =========================================================
   REFRESH IMAGE SYSTEM
   ========================================================= */

const REFRESH_SEED = Math.floor(Math.random() * 1000000);

/*
  Every category has its own image collection.
  The image can change after refreshing the website,
  but it stays inside that category's collection.
*/

const CLOTHING_IMAGES = {
  /* ================= MEN ================= */

  menTrousers: [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80",
  ],

  menShirts: [
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=80",
  ],

  menTshirts: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4e6?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=700&q=80",
  ],

  menJackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=700&q=80",
  ],

  menJeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
  ],

  menShorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=700&q=80",
  ],

  /* ================= WOMEN ================= */

  womenDresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
  ],

  womenSkirts: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=700&q=80",
  ],

  womenTrousers: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1506629905607-d9f5b5d9b2c8?auto=format&fit=crop&w=700&q=80",
  ],

  womenTops: [
    "https://images.unsplash.com/photo-1564257577054-0f3f4a1c0c65?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
  ],

  womenJackets: [
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  ],

  womenJeans: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=700&q=80",
  ],

  /* ================= KIDS ================= */

  boys: [
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
  ],

  girls: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=700&q=80",
  ],

  kidsTrousers: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
  ],

  kidsTshirts: [
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80",
  ],

  kidsShorts: [
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
  ],
};

/* =========================================================
   IMAGE SELECTOR
   ========================================================= */

function clothingImage(type, id) {
  const images = CLOTHING_IMAGES[type];

  if (!images || images.length === 0) {
    return "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=80";
  }

  const index =
    Math.abs(REFRESH_SEED + id * 17) % images.length;

  return images[index];
}

/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [
  /* ================= MEN ================= */

  {
    id: 1,
    name: "Classic Men's Trousers",
    gender: "Men",
    category: "Trousers",
    grade: "Grade 1",
    price: 700,
    image: clothingImage("menTrousers", 1),
    note: "Smart comfortable trousers for everyday wear.",
  },

  {
    id: 2,
    name: "Men's Casual Shirt",
    gender: "Men",
    category: "Shirts",
    grade: "Grade 1",
    price: 600,
    image: clothingImage("menShirts", 2),
    note: "A clean casual shirt with a comfortable fit.",
  },

  {
    id: 3,
    name: "Men's Basic T-Shirt",
    gender: "Men",
    category: "T-Shirts",
    grade: "Grade 1",
    price: 400,
    image: clothingImage("menTshirts", 3),
    note: "Simple everyday T-shirt.",
  },

  {
    id: 4,
    name: "Men's Denim Jacket",
    gender: "Men",
    category: "Jackets",
    grade: "Grade 1",
    price: 1200,
    image: clothingImage("menJackets", 4),
    note: "Classic denim jacket for a casual look.",
  },

  {
    id: 5,
    name: "Men's Jeans",
    gender: "Men",
    category: "Jeans",
    grade: "Grade 1",
    price: 800,
    image: clothingImage("menJeans", 5),
    note: "Comfortable everyday denim.",
  },

  {
    id: 6,
    name: "Men's Casual Shorts",
    gender: "Men",
    category: "Shorts",
    grade: "Grade 1",
    price: 450,
    image: clothingImage("menShorts", 6),
    note: "Light and comfortable casual shorts.",
  },

  /* ================= WOMEN ================= */

  {
    id: 7,
    name: "Floral Wrap Dress",
    gender: "Women",
    category: "Dresses",
    grade: "Grade 1",
    price: 800,
    was: 1200,
    image: clothingImage("womenDresses", 7),
    note: "Soft floral style suitable for different occasions.",
  },

  {
    id: 8,
    name: "Ankara Print Skirt",
    gender: "Women",
    category: "Skirts",
    grade: "Grade 1",
    price: 600,
    image: clothingImage("womenSkirts", 8),
    note: "Bold print with a stylish finish.",
  },

  {
    id: 9,
    name: "Women's Tailored Trousers",
    gender: "Women",
    category: "Trousers",
    grade: "Grade 1",
    price: 650,
    image: clothingImage("womenTrousers", 9),
    note: "Smart and comfortable everyday trousers.",
  },

  {
    id: 10,
    name: "Women's Casual Top",
    gender: "Women",
    category: "Tops",
    grade: "Grade 1",
    price: 450,
    image: clothingImage("womenTops", 10),
    note: "Easy-to-style casual top.",
  },

  {
    id: 11,
    name: "Women's Denim Jacket",
    gender: "Women",
    category: "Jackets",
    grade: "Grade 1",
    price: 1100,
    image: clothingImage("womenJackets", 11),
    note: "Classic denim layer.",
  },

  {
    id: 12,
    name: "Women's Jeans",
    gender: "Women",
    category: "Jeans",
    grade: "Grade 1",
    price: 750,
    image: clothingImage("womenJeans", 12),
    note: "Comfortable everyday jeans.",
  },

  /* ================= KIDS ================= */

  {
    id: 13,
    name: "Boys' Casual Outfit",
    gender: "Kids",
    category: "Boys",
    grade: "Grade 1",
    price: 500,
    image: clothingImage("boys", 13),
    note: "Comfortable everyday clothing for boys.",
  },

  {
    id: 14,
    name: "Girls' Casual Outfit",
    gender: "Kids",
    category: "Girls",
    grade: "Grade 1",
    price: 550,
    image: clothingImage("girls", 14),
    note: "Comfortable everyday clothing for girls.",
  },

  {
    id: 15,
    name: "Kids' Trousers",
    gender: "Kids",
    category: "Trousers",
    grade: "Grade 1",
    price: 400,
    image: clothingImage("kidsTrousers", 15),
    note: "Comfortable trousers for everyday activities.",
  },

  {
    id: 16,
    name: "Kids' T-Shirt",
    gender: "Kids",
    category: "T-Shirts",
    grade: "Grade 1",
    price: 300,
    image: clothingImage("kidsTshirts", 16),
    note: "Simple comfortable children's T-shirt.",
  },

  {
    id: 17,
    name: "Kids' Shorts",
    gender: "Kids",
    category: "Shorts",
    grade: "Grade 1",
    price: 350,
    image: clothingImage("kidsShorts", 17),
    note: "Light and comfortable children's shorts.",
  },

  /* ================= EXTRA ================= */

  {
    id: 18,
    name: "Men's Smart Trousers",
    gender: "Men",
    category: "Trousers",
    grade: "Grade 1",
    price: 850,
    image: clothingImage("menTrousers", 18),
    note: "Smart trousers suitable for work and occasions.",
  },

  {
    id: 19,
    name: "Women's Straight Trousers",
    gender: "Women",
    category: "Trousers",
    grade: "Grade 1",
    price: 700,
    image: clothingImage("womenTrousers", 19),
    note: "Simple straight-cut trousers.",
  },

  {
    id: 20,
    name: "Kids' Smart Trousers",
    gender: "Kids",
    category: "Trousers",
    grade: "Grade 1",
    price: 450,
    image: clothingImage("kidsTrousers", 20),
    note: "Smart comfortable trousers for children.",
  },
];

/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatKES(number) {
  return "KSh " + number.toLocaleString("en-KE");
}

/* =========================================================
   TAG
   ========================================================= */

function Tag_({ children, tone = "clay" }) {
  const tones = {
    clay: "bg-[#BC5B39] text-[#F3E9DA]",
    marigold: "bg-[#E8A63D] text-[#1C2541]",
    ink: "bg-[#1C2541] text-[#F3E9DA]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] tracking-wide uppercase px-2 py-1 ${tones[tone]}`}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {children}
    </span>
  );
}

/* =========================================================
   PRODUCT CARD
   ========================================================= */

function ProductCard({ product, onAdd }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-[#F3E9DA] border border-[#1C2541]/10 flex flex-col overflow-hidden">

      <div className="relative h-64 overflow-hidden bg-[#E8DDCB]">

        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1C2541]/50">
            <Tag size={30} />

            <span className="text-xs mt-2 uppercase tracking-wide">
              Image unavailable
            </span>
          </div>
        )}

        <div
          className="absolute right-3 top-4 rotate-3 bg-[#F3E9DA] border border-[#1C2541]/20 px-3 py-2 shadow-sm"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <div className="text-[10px] text-[#1C2541]/60 mb-1">
            TAG №{String(product.id).padStart(3, "0")}
          </div>

          <div className="text-sm font-bold text-[#1C2541]">
            {formatKES(product.price)}
          </div>

          {product.was && (
            <div className="text-[10px] text-[#1C2541]/50 line-through">
              {formatKES(product.was)}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">

        <div className="flex gap-2 flex-wrap">

          <Tag_>
            {product.grade}
          </Tag_>

          <span
            className="text-[11px] uppercase tracking-wide text-[#1C2541]/50"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {product.category}
          </span>

        </div>

        <h3
          className="text-lg leading-tight text-[#1C2541]"
          style={{
            fontFamily: "'Fraunces', serif",
          }}
        >
          {product.name}
        </h3>

        <p className="text-sm text-[#1C2541]/70 flex-1">
          {product.note}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="mt-2 flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-2.5 text-sm uppercase tracking-wide hover:bg-[#2B3654] transition-colors"
        >
          <Plus size={15} />
          Add to bag
        </button>

      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
   ========================================================= */

export default function Duka() {

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");

  /* PAYMENT */

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("SEND MONEY");

  const [transactionCode, setTransactionCode] =
    useState("");

  const genders = [
    "All",
    "Men",
    "Women",
    "Kids",
  ];

  /* =======================================================
     CATEGORY FILTER
     ======================================================= */

  const categories = useMemo(() => {

    const filteredProducts =
      gender === "All"
        ? PRODUCTS
        : PRODUCTS.filter(
            (product) =>
              product.gender === gender
          );

    const uniqueCategories = [
      ...new Set(
        filteredProducts.map(
          (product) => product.category
        )
      ),
    ];

    return [
      "All",
      ...uniqueCategories,
    ];

  }, [gender]);

  /* =======================================================
     VISIBLE PRODUCTS
     ======================================================= */

  const visibleProducts = useMemo(() => {

    return PRODUCTS.filter((product) => {

      const matchesGender =
        gender === "All" ||
        product.gender === gender;

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesGender &&
        matchesCategory
      );
    });

  }, [gender, category]);

  /* =======================================================
     CHANGE GENDER
     ======================================================= */

  function changeGender(newGender) {

    setGender(newGender);

    setCategory("All");
  }

  /* =======================================================
     ADD TO CART
     ======================================================= */

  function addToCart(product) {

    setCart((currentCart) => {

      const existing =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {

        return currentCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  qty: item.qty + 1,
                }
              : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          qty: 1,
        },
      ];
    });

    setCartOpen(true);
  }

  /* =======================================================
     QUANTITY
     ======================================================= */

  function changeQty(id, amount) {

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty:
                  item.qty + amount,
              }
            : item
        )
        .filter(
          (item) =>
            item.qty > 0
        )
    );
  }

  /* =======================================================
     TOTAL
     ======================================================= */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price *
        item.qty,
    0
  );

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );

  /* =======================================================
     PAYMENT / WHATSAPP
     ======================================================= */

  function confirmPaymentOrder() {

    if (cart.length === 0)
      return;

    const lines =
      cart.map(
        (item) =>
          `• ${item.name} x${item.qty} — ${formatKES(
            item.price *
              item.qty
          )}`
      );

    let paymentDetails = "";

    if (
      paymentMethod ===
      "SEND MONEY"
    ) {

      paymentDetails =
        `Send Money number: ${STORE_DETAILS.phone}`;

    } else {

      paymentDetails =
        `M-PESA Till/Paybill: ${STORE_DETAILS.mpesaNumber}`;
    }

    const message = [
      "Hi Duka la Style! I'd like to place an order.",
      "",
      ...lines,
      "",
      `Total: ${formatKES(total)}`,
      "",
      `Payment method: ${paymentMethod}`,
      paymentDetails,
      transactionCode
        ? `Transaction code: ${transactionCode}`
        : "Transaction code: Pending",
    ].join("\n");

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank"
    );
  }

  /* =======================================================
     GENERAL WHATSAPP
     ======================================================= */

  function contactWhatsApp() {

    const message =
      "Hi! I'd like some help choosing clothes.";

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank"
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div
      className="min-h-screen bg-[#F3E9DA] text-[#2B2620]"
      style={{
        fontFamily:
          "'Work Sans', sans-serif",
      }}
    >

      {/* ===================================================
          FONTS
          =================================================== */}

      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap"
        rel="stylesheet"
      />

      {/* ===================================================
          HEADER
          =================================================== */}

      <header className="sticky top-0 z-30 bg-[#1C2541] text-[#F3E9DA]">

        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">

          <div className="flex items-baseline gap-2">

            <span
              className="text-2xl"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Duka
            </span>

            <span
              className="text-2xl text-[#E8A63D]"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              la Style
            </span>

          </div>

          <button
            onClick={() =>
              setCartOpen(true)
            }
            className="relative flex items-center gap-2 border border-[#F3E9DA]/30 px-3 py-2 hover:bg-[#F3E9DA]/10 transition-colors"
          >

            <ShoppingBag size={18} />

            <span className="text-sm hidden sm:inline">
              Bag
            </span>

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8A63D] text-[#1C2541] text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}

          </button>

        </div>

      </header>

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="max-w-5xl mx-auto px-5 pt-14 pb-10">

        <div className="flex items-center gap-2 mb-4">

          <Sparkles
            size={16}
            className="text-[#BC5B39]"
          />

          <span
            className="text-xs uppercase tracking-[0.2em] text-[#BC5B39]"
            style={{
              fontFamily:
                "'JetBrains Mono', monospace",
            }}
          >
            Fresh bale, opened this week
          </span>

        </div>

        <h1
          className="text-4xl sm:text-5xl leading-[1.05] mb-4"
          style={{
            fontFamily:
              "'Fraunces', serif",
          }}
        >
          Curated secondhand,
          <br />

          <span className="text-[#BC5B39]">
            styled for everyone.
          </span>

        </h1>

        <p className="text-[#2B2620]/70 max-w-md text-[15px]">
          Quality secondhand clothing for
          men, women and children —
          hand-picked and graded so you
          don't have to dig through piles.
        </p>

      </section>

      {/* ===================================================
          GENDER
          =================================================== */}

      <div className="max-w-5xl mx-auto px-5 mb-5">

        <div className="flex gap-2 overflow-x-auto pb-1">

          {genders.map((item) => (

            <button
              key={item}
              onClick={() =>
                changeGender(item)
              }
              className={`whitespace-nowrap px-5 py-3 text-sm uppercase tracking-wide border transition-colors ${
                gender === item
                  ? "bg-[#1C2541] text-[#F3E9DA] border-[#1C2541]"
                  : "border-[#1C2541]/20 text-[#1C2541]/70 hover:border-[#1C2541]/50"
              }`}
              style={{
                fontFamily:
                  "'JetBrains Mono', monospace",
              }}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* ===================================================
          CATEGORIES
          =================================================== */}

      <div className="max-w-5xl mx-auto px-5 mb-7">

        <div className="flex gap-2 overflow-x-auto pb-1">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              className={`whitespace-nowrap text-xs uppercase tracking-wide px-3 py-2 border transition-colors ${
                category === item
                  ? "bg-[#BC5B39] text-[#F3E9DA] border-[#BC5B39]"
                  : "border-[#1C2541]/20 text-[#1C2541]/70 hover:border-[#1C2541]/50"
              }`}
              style={{
                fontFamily:
                  "'JetBrains Mono', monospace",
              }}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* ===================================================
          PRODUCT COUNT
          =================================================== */}

      <div className="max-w-5xl mx-auto px-5 mb-4">

        <p
          className="text-xs uppercase tracking-wide text-[#1C2541]/50"
          style={{
            fontFamily:
              "'JetBrains Mono', monospace",
          }}
        >
          {visibleProducts.length}{" "}
          {visibleProducts.length ===
          1
            ? "item"
            : "items"}{" "}
          available
        </p>

      </div>

      {/* ===================================================
          PRODUCTS
          =================================================== */}

      <main className="max-w-5xl mx-auto px-5 pb-24">

        {visibleProducts.length ===
        0 ? (

          <div className="py-20 text-center">

            <Tag
              size={30}
              className="mx-auto mb-3 text-[#BC5B39]"
            />

            <h2
              className="text-2xl text-[#1C2541]"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Nothing here yet
            </h2>

            <p className="text-sm text-[#1C2541]/60 mt-2">
              Try another category.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {visibleProducts.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                />

              )
            )}

          </div>

        )}

      </main>

      {/* ===================================================
          CONTACT US
          =================================================== */}

      <footer
        id="contact"
        className="bg-[#1C2541] text-[#F3E9DA]"
      >

        <div className="max-w-5xl mx-auto px-5 py-14">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-2 mb-4">

                <MessageCircle
                  size={18}
                  className="text-[#E8A63D]"
                />

                <span
                  className="text-xs uppercase tracking-[0.2em] text-[#E8A63D]"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', monospace",
                  }}
                >
                  Contact us
                </span>

              </div>

              <h2
                className="text-3xl mb-3"
                style={{
                  fontFamily:
                    "'Fraunces', serif",
                }}
              >
                Need help finding
                <br />
                your next look?
              </h2>

              <p className="text-[#F3E9DA]/60 text-sm max-w-sm">
                Have a question about sizing,
                availability, payment or
                delivery? We're happy to help.
              </p>

              <button
                onClick={contactWhatsApp}
                className="mt-6 flex items-center gap-2 bg-[#E8A63D] text-[#1C2541] px-5 py-3 text-sm uppercase tracking-wide font-medium hover:bg-[#f0b658] transition-colors"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </button>

            </div>

            {/* RIGHT */}

            <div className="flex flex-col gap-3">

              {/* WHATSAPP */}

              <a
                href={`https://wa.me/${STORE_DETAILS.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 border border-[#F3E9DA]/15 p-4 hover:bg-[#F3E9DA]/10 transition-colors"
              >

                <MessageCircle
                  size={20}
                  className="text-[#E8A63D]"
                />

                <div>

                  <div className="text-xs text-[#F3E9DA]/50 uppercase">
                    WhatsApp
                  </div>

                  <div className="text-sm mt-1">
                    Chat with us
                  </div>

                </div>

              </a>

              {/* PHONE */}

              <a
                href={`tel:${STORE_DETAILS.phone}`}
                className="flex items-center gap-4 border border-[#F3E9DA]/15 p-4 hover:bg-[#F3E9DA]/10 transition-colors"
              >

                <span className="text-xl">
                  📞
                </span>

                <div>

                  <div className="text-xs text-[#F3E9DA]/50 uppercase">
                    Phone
                  </div>

                  <div className="text-sm mt-1">
                    {STORE_DETAILS.phone}
                  </div>

                </div>

              </a>

              {/* LOCATION */}

              <div className="flex items-center gap-4 border border-[#F3E9DA]/15 p-4">

                <span className="text-xl">
                  📍
                </span>

                <div>

                  <div className="text-xs text-[#F3E9DA]/50 uppercase">
                    Location
                  </div>

                  <div className="text-sm mt-1">
                    {STORE_DETAILS.location}
                  </div>

                </div>

              </div>

              {/* HOURS */}

              <div className="flex items-center gap-4 border border-[#F3E9DA]/15 p-4">

                <span className="text-xl">
                  🕐
                </span>

                <div>

                  <div className="text-xs text-[#F3E9DA]/50 uppercase">
                    Opening hours
                  </div>

                  <div className="text-sm mt-1">
                    {STORE_DETAILS.hours}
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER BOTTOM */}

          <div className="border-t border-[#F3E9DA]/10 mt-10 pt-6">

            <div className="flex flex-col sm:flex-row justify-between gap-3">

              <p className="text-xs text-[#F3E9DA]/40">
                © {new Date().getFullYear()} Duka la Style
              </p>

              <p className="text-xs text-[#F3E9DA]/40">
                Quality secondhand. Styled for everyone.
              </p>

            </div>

          </div>

        </div>

      </footer>

      {/* ===================================================
          CART
          =================================================== */}

      {cartOpen && (

        <div className="fixed inset-0 z-40 flex justify-end">

          {/* OVERLAY */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setCartOpen(false)
            }
          />

          {/* CART PANEL */}

          <div className="relative w-full max-w-sm h-full bg-[#F3E9DA] flex flex-col">

            {/* CART HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2541]/10">

              <h3
                className="text-lg"
                style={{
                  fontFamily:
                    "'Fraunces', serif",
                }}
              >
                Your bag
              </h3>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="p-1 hover:bg-[#1C2541]/5"
              >
                <X size={20} />
              </button>

            </div>

            {/* CART CONTENT */}

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

              {cart.length === 0 && (

                <p className="text-sm text-[#2B2620]/50 flex items-center gap-2 mt-4">

                  <Tag size={14} />

                  Nothing here yet —
                  add a piece to get started.

                </p>

              )}

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0">

                    <div className="text-sm font-medium truncate">
                      {item.name}
                    </div>

                    <div
                      className="text-xs text-[#2B2620]/60"
                      style={{
                        fontFamily:
                          "'JetBrains Mono', monospace",
                      }}
                    >
                      {formatKES(item.price)}
                    </div>

                  </div>

                  <div className="flex items-center gap-2 border border-[#1C2541]/20">

                    <button
                      onClick={() =>
                        changeQty(
                          item.id,
                          -1
                        )
                      }
                      className="p-1.5 hover:bg-[#1C2541]/5"
                    >
                      <Minus size={12} />
                    </button>

                    <span className="text-sm w-4 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        changeQty(
                          item.id,
                          1
                        )
                      }
                      className="p-1.5 hover:bg-[#1C2541]/5"
                    >
                      <Plus size={12} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* CART TOTAL */}

            <div className="px-5 py-4 border-t border-[#1C2541]/10">

              <div className="flex items-center justify-between mb-3 text-sm">

                <span className="text-[#2B2620]/70">
                  Total
                </span>

                <span
                  className="font-semibold"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', monospace",
                  }}
                >
                  {formatKES(total)}
                </span>

              </div>

              <button
                onClick={() =>
                  setPaymentOpen(true)
                }
                disabled={
                  cart.length === 0
                }
                className="w-full flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-3 text-sm uppercase tracking-wide font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2B3654] transition-colors"
              >

                <ShoppingBag size={16} />

                Continue to Payment

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          PAYMENT MODAL
          =================================================== */}

      {paymentOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* OVERLAY */}

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() =>
              setPaymentOpen(false)
            }
          />

          {/* PAYMENT BOX */}

          <div className="relative w-full max-w-md bg-[#F3E9DA] shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* PAYMENT HEADER */}

            <div className="flex items-center justify-between px-5 py-4 bg-[#1C2541] text-[#F3E9DA]">

              <div>

                <h3
                  className="text-xl"
                  style={{
                    fontFamily:
                      "'Fraunces', serif",
                  }}
                >
                  Payment
                </h3>

                <p className="text-xs text-[#F3E9DA]/60 mt-1">
                  Complete your order
                </p>

              </div>

              <button
                onClick={() =>
                  setPaymentOpen(false)
                }
                className="p-1 hover:bg-white/10"
              >
                <X size={20} />
              </button>

            </div>

            {/* PAYMENT CONTENT */}

            <div className="p-5">

              {/* ORDER TOTAL */}

              <div className="border border-[#1C2541]/10 p-4 mb-5">

                <div className="text-xs uppercase tracking-wide text-[#1C2541]/50">
                  Order total
                </div>

                <div
                  className="text-2xl font-semibold mt-1"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', monospace",
                  }}
                >
                  {formatKES(total)}
                </div>

              </div>

              {/* PAYMENT METHOD */}

              <label
                className="text-xs uppercase tracking-wide text-[#1C2541]/60"
                style={{
                  fontFamily:
                    "'JetBrains Mono', monospace",
                }}
              >
                Choose payment method
              </label>

              <div className="grid grid-cols-2 gap-2 mt-2">

                {/* M-PESA */}

                <button
                  onClick={() =>
                    setPaymentMethod(
                      "M-PESA"
                    )
                  }
                  className={`p-4 border text-left transition-colors ${
                    paymentMethod ===
                    "M-PESA"
                      ? "border-[#BC5B39] bg-[#BC5B39]/10"
                      : "border-[#1C2541]/15"
                  }`}
                >

                  <div className="font-semibold text-[#1C2541]">
                    M-PESA
                  </div>

                  <div className="text-xs text-[#1C2541]/60 mt-1">
                    Till / Paybill
                  </div>

                </button>

                {/* SEND MONEY */}

                <button
                  onClick={() =>
                    setPaymentMethod(
                      "SEND MONEY"
                    )
                  }
                  className={`p-4 border text-left transition-colors ${
                    paymentMethod ===
                    "SEND MONEY"
                      ? "border-[#BC5B39] bg-[#BC5B39]/10"
                      : "border-[#1C2541]/15"
                  }`}
                >

                  <div className="font-semibold text-[#1C2541]">
                    Send Money
                  </div>

                  <div className="text-xs text-[#1C2541]/60 mt-1">
                    Phone number
                  </div>

                </button>

              </div>

              {/* =================================================
                  M-PESA TILL / PAYBILL
                  ================================================= */}

              {paymentMethod ===
                "M-PESA" && (

                <div className="mt-4 bg-[#E8DDCB] p-4">

                  <div
                    className="text-xs uppercase tracking-wide text-[#BC5B39] mb-2"
                    style={{
                      fontFamily:
                        "'JetBrains Mono', monospace",
                    }}
                  >
                    M-PESA payment
                  </div>

                  <p className="text-sm text-[#1C2541]/80">
                    Pay using M-PESA:
                  </p>

                  <p
                    className="text-lg font-bold mt-1"
                    style={{
                      fontFamily:
                        "'JetBrains Mono', monospace",
                    }}
                  >
                    {
                      STORE_DETAILS.mpesaNumber
                    }
                  </p>

                </div>

              )}

              {/* =================================================
                  SEND MONEY
                  ================================================= */}

              {paymentMethod ===
                "SEND MONEY" && (

                <div className="mt-4 bg-[#E8DDCB] p-4">

                  <div
                    className="text-xs uppercase tracking-wide text-[#BC5B39] mb-2"
                    style={{
                      fontFamily:
                        "'JetBrains Mono', monospace",
                    }}
                  >
                    Send Money
                  </div>

                  <p className="text-sm text-[#1C2541]/80">
                    Send the payment to:
                  </p>

                  <p
                    className="text-xl font-bold mt-2"
                    style={{
                      fontFamily:
                        "'JetBrains Mono', monospace",
                    }}
                  >
                    0710574821
                  </p>

                  <div className="mt-3 text-xs text-[#1C2541]/60">

                    Amount to send:

                    <strong className="ml-1 text-[#1C2541]">

                      {formatKES(total)}

                    </strong>

                  </div>

                </div>

              )}

              {/* =================================================
                  TRANSACTION CODE
                  ================================================= */}

              <div className="mt-5">

                <label
                  className="text-xs uppercase tracking-wide text-[#1C2541]/60"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', monospace",
                  }}
                >
                  M-PESA transaction code
                </label>

                <input
                  type="text"
                  value={transactionCode}
                  onChange={(e) =>
                    setTransactionCode(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. QWE123ABC"
                  className="w-full mt-2 border border-[#1C2541]/20 bg-white/40 px-3 py-3 outline-none focus:border-[#BC5B39]"
                />

              </div>

              {/* =================================================
                  ORDER BUTTON
                  ================================================= */}

              <button
                onClick={
                  confirmPaymentOrder
                }
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm uppercase tracking-wide font-medium hover:bg-[#20bd5a] transition-colors"
              >

                <MessageCircle size={16} />

                Confirm Order on WhatsApp

              </button>

              <p className="text-[11px] text-center text-[#1C2541]/50 mt-3">

                Your order details and
                payment information will
                be sent to us on WhatsApp.

              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}