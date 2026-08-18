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
   RANDOM IMAGE SYSTEM
   Images can change whenever the website is refreshed.
========================================================= */

const REFRESH_SEED = Math.floor(Math.random() * 999999);

function clothingImage(type, id) {
  const queries = {
    menTrousers: "men,trousers,fashion",
    menShirts: "men,shirt,fashion",
    menTshirts: "men,tshirt,fashion",
    menJackets: "men,jacket,fashion",
    menJeans: "men,jeans,fashion",
    menShorts: "men,shorts,fashion",

    womenDresses: "women,dress,fashion",
    womenSkirts: "women,skirt,fashion",
    womenTrousers: "women,trousers,fashion",
    womenTops: "women,top,fashion",
    womenJackets: "women,jacket,fashion",
    womenJeans: "women,jeans,fashion",

    boys: "boys,clothing,fashion",
    girls: "girls,clothing,fashion",
    kidsTrousers: "children,trousers,fashion",
    kidsTshirts: "children,tshirt,fashion",
    kidsShorts: "children,shorts,fashion",
  };

  const query = queries[type] || "clothing,fashion";

  return `https://loremflickr.com/600/700/${query}?lock=${
    REFRESH_SEED + id
  }`;
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
    grade: "Grade 1 · Cream",
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
];

const WHATSAPP_NUMBER = "254710574821";

/* =========================================================
   PRICE FORMAT
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

      {/* IMAGE */}

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

        {/* PRICE */}

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

      {/* DETAILS */}

      <div className="p-4 flex flex-col gap-2 flex-1">

        <div className="flex gap-2 flex-wrap">

          <Tag_
            tone={
              product.grade.includes("Cream")
                ? "marigold"
                : "clay"
            }
          >
            {product.grade}
          </Tag>

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

  /* =======================================================
     GENDER FILTERS
  ======================================================= */

  const genders = ["All", "Men", "Women", "Kids"];

  /* =======================================================
     CATEGORY FILTERS
  ======================================================= */

  const categories = useMemo(() => {
    const products =
      gender === "All"
        ? PRODUCTS
        : PRODUCTS.filter(
            (product) => product.gender === gender
          );

    return [
      "All",
      ...new Set(
        products.map(
          (product) => product.category
        )
      ),
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

      return matchesGender && matchesCategory;
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
      const found = currentCart.find(
        (item) => item.id === product.id
      );

      if (found) {
        return currentCart.map((item) =>
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
     CHANGE QUANTITY
  ======================================================= */

  function changeQty(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty + amount,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  /* =======================================================
     CART TOTAL
  ======================================================= */

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );

  /* =======================================================
     WHATSAPP CHECKOUT
  ======================================================= */

  function checkoutOnWhatsapp() {
    if (cart.length === 0) return;

    const lines = cart.map(
      (item) =>
        `• ${item.name} x${item.qty} — ${formatKES(
          item.price * item.qty
        )}`
    );

    const message = [
      "Hi! I'd like to order:",
      ...lines,
      "",
      `Total: ${formatKES(total)}`,
    ].join("\n");

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="min-h-screen bg-[#F3E9DA] text-[#2B2620]"
      style={{
        fontFamily: "'Work Sans', sans-serif",
      }}
    >

      {/* FONTS */}

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
                fontFamily: "'Fraunces', serif",
              }}
            >
              Duka
            </span>

            <span
              className="text-2xl text-[#E8A63D]"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              la Style
            </span>

          </div>

          <button
            onClick={() => setCartOpen(true)}
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
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Fresh bale, opened this week
          </span>

        </div>

        <h1
          className="text-4xl sm:text-5xl leading-[1.05] mb-4"
          style={{
            fontFamily: "'Fraunces', serif",
          }}
        >
          Curated secondhand,
          <br />

          <span className="text-[#BC5B39]">
            styled for everyone.
          </span>
        </h1>

        <p className="text-[#2B2620]/70 max-w-md text-[15px]">
          Quality secondhand clothing for men,
          women and children — hand-picked and
          graded so you don't have to dig through piles.
        </p>

      </section>

      {/* ===================================================
          MEN / WOMEN / KIDS
      =================================================== */}

      <div className="max-w-5xl mx-auto px-5 mb-5">

        <div className="flex gap-2 overflow-x-auto pb-1">

          {genders.map((item) => (
            <button
              key={item}
              onClick={() => changeGender(item)}
              className={`whitespace-nowrap px-5 py-3 text-sm uppercase tracking-wide border transition-colors ${
                gender === item
                  ? "bg-[#1C2541] text-[#F3E9DA] border-[#1C2541]"
                  : "border-[#1C2541]/20 text-[#1C2541]/70 hover:border-[#1C2541]/50"
              }`}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* ===================================================
          CLOTHING CATEGORIES
      =================================================== */}

      <div className="max-w-5xl mx-auto px-5 mb-7">

        <div className="flex gap-2 overflow-x-auto pb-1">

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap text-xs uppercase tracking-wide px-3 py-2 border transition-colors ${
                category === item
                  ? "bg-[#BC5B39] text-[#F3E9DA] border-[#BC5B39]"
                  : "border-[#1C2541]/20 text-[#1C2541]/70 hover:border-[#1C2541]/50"
              }`}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      <main className="max-w-5xl mx-auto px-5 pb-24">

        {visibleProducts.length === 0 ? (
          <div className="py-20 text-center">

            <Tag
              size={30}
              className="mx-auto mb-3 text-[#BC5B39]"
            />

            <h2
              className="text-2xl text-[#1C2541]"
              style={{
                fontFamily: "'Fraunces', serif",
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

            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}

          </div>
        )}

      </main>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="bg-[#1C2541] text-[#F3E9DA]">

        <div className="max-w-5xl mx-auto px-5 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div>

            <h2
              className="text-2xl mb-1"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              Need help finding a look?
            </h2>

            <p className="text-[#F3E9DA]/60 text-sm">
              Message us and we'll help you find
              something within your style and budget.
            </p>

          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi! I'd like some help choosing clothes."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#E8A63D] text-[#1C2541] px-5 py-3 text-sm uppercase tracking-wide font-medium hover:bg-[#f0b658] transition-colors whitespace-nowrap"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>

        </div>

      </footer>

      {/* ===================================================
          CART
      =================================================== */}

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
          />

          <div className="relative w-full max-w-sm h-full bg-[#F3E9DA] flex flex-col">

            {/* CART HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2541]/10">

              <h3
                className="text-lg"
                style={{
                  fontFamily: "'Fraunces', serif",
                }}
              >
                Your bag
              </h3>

              <button
                onClick={() => setCartOpen(false)}
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
                  Nothing here yet — add a piece to get started.
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
                        changeQty(item.id, -1)
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
                        changeQty(item.id, 1)
                      }
                      className="p-1.5 hover:bg-[#1C2541]/5"
                    >
                      <Plus size={12} />
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* TOTAL */}

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
                onClick={checkoutOnWhatsapp}
                disabled={cart.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 text-sm uppercase tracking-wide font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={16} />
                Order via WhatsApp
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}