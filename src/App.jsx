import React, { useMemo, useState } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  Tag,
  Copy,
  Check,
  CreditCard,
  Phone,
} from "lucide-react";

/* =========================================================
   SETTINGS
========================================================= */

const PAYMENT_NUMBER = "0710574821";
const WHATSAPP_NUMBER = "254710574821";

/* =========================================================
   REFRESH IMAGE SYSTEM
   Each category has its OWN image pool.
========================================================= */

const REFRESH_SEED = Math.floor(Math.random() * 1000000);

const CLOTHING_IMAGES = {
  menTrousers: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1506629905607-d9f5b5d9b2c8?auto=format&fit=crop&w=700&q=80",
  ],

  menShirts: [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=80",
  ],

  menTshirts: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4e6?auto=format&fit=crop&w=700&q=80",
  ],

  menJackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=700&q=80",
  ],

  menJeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=700&q=80",
  ],

  menShorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=700&q=80",
  ],

  womenDresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=80",
  ],

  womenSkirts: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=700&q=80",
  ],

  womenTrousers: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
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

  kidsTrousers: [
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80",
  ],

  kidsTshirts: [
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80",
  ],

  kidsShorts: [
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
  ],

  boys: [
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
  ],

  girls: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=700&q=80",
  ],
};

function clothingImage(type, id) {
  const images = CLOTHING_IMAGES[type];

  if (!images?.length) return "";

  return images[(REFRESH_SEED + id) % images.length];
}

/* =========================================================
   PRODUCTS
========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Men's Trousers",
    gender: "Men",
    category: "Trousers",
    price: 700,
    image: clothingImage("menTrousers", 1),
    note: "Smart comfortable trousers for everyday wear.",
  },
  {
    id: 2,
    name: "Men's Casual Shirt",
    gender: "Men",
    category: "Shirts",
    price: 600,
    image: clothingImage("menShirts", 2),
    note: "A clean casual shirt with a comfortable fit.",
  },
  {
    id: 3,
    name: "Men's Basic T-Shirt",
    gender: "Men",
    category: "T-Shirts",
    price: 400,
    image: clothingImage("menTshirts", 3),
    note: "Simple everyday T-shirt.",
  },
  {
    id: 4,
    name: "Men's Denim Jacket",
    gender: "Men",
    category: "Jackets",
    price: 1200,
    image: clothingImage("menJackets", 4),
    note: "Classic denim jacket.",
  },
  {
    id: 5,
    name: "Men's Jeans",
    gender: "Men",
    category: "Jeans",
    price: 800,
    image: clothingImage("menJeans", 5),
    note: "Comfortable everyday denim.",
  },
  {
    id: 6,
    name: "Men's Casual Shorts",
    gender: "Men",
    category: "Shorts",
    price: 450,
    image: clothingImage("menShorts", 6),
    note: "Light and comfortable casual shorts.",
  },

  {
    id: 7,
    name: "Floral Wrap Dress",
    gender: "Women",
    category: "Dresses",
    price: 800,
    was: 1200,
    image: clothingImage("womenDresses", 7),
    note: "Soft floral style.",
  },
  {
    id: 8,
    name: "Ankara Print Skirt",
    gender: "Women",
    category: "Skirts",
    price: 600,
    image: clothingImage("womenSkirts", 8),
    note: "Bold print with a stylish finish.",
  },
  {
    id: 9,
    name: "Women's Tailored Trousers",
    gender: "Women",
    category: "Trousers",
    price: 650,
    image: clothingImage("womenTrousers", 9),
    note: "Smart everyday trousers.",
  },
  {
    id: 10,
    name: "Women's Casual Top",
    gender: "Women",
    category: "Tops",
    price: 450,
    image: clothingImage("womenTops", 10),
    note: "Easy-to-style casual top.",
  },
  {
    id: 11,
    name: "Women's Denim Jacket",
    gender: "Women",
    category: "Jackets",
    price: 1100,
    image: clothingImage("womenJackets", 11),
    note: "Classic denim layer.",
  },
  {
    id: 12,
    name: "Women's Jeans",
    gender: "Women",
    category: "Jeans",
    price: 750,
    image: clothingImage("womenJeans", 12),
    note: "Comfortable everyday jeans.",
  },

  {
    id: 13,
    name: "Boys' Casual Outfit",
    gender: "Kids",
    category: "Boys",
    price: 500,
    image: clothingImage("boys", 13),
    note: "Comfortable everyday clothing for boys.",
  },
  {
    id: 14,
    name: "Girls' Casual Outfit",
    gender: "Kids",
    category: "Girls",
    price: 550,
    image: clothingImage("girls", 14),
    note: "Comfortable everyday clothing for girls.",
  },
  {
    id: 15,
    name: "Kids' Trousers",
    gender: "Kids",
    category: "Trousers",
    price: 400,
    image: clothingImage("kidsTrousers", 15),
    note: "Comfortable children's trousers.",
  },
  {
    id: 16,
    name: "Kids' T-Shirt",
    gender: "Kids",
    category: "T-Shirts",
    price: 300,
    image: clothingImage("kidsTshirts", 16),
    note: "Simple comfortable children's T-shirt.",
  },
  {
    id: 17,
    name: "Kids' Shorts",
    gender: "Kids",
    category: "Shorts",
    price: 350,
    image: clothingImage("kidsShorts", 17),
    note: "Light children's shorts.",
  },

  {
    id: 18,
    name: "Men's Smart Trousers",
    gender: "Men",
    category: "Trousers",
    price: 850,
    image: clothingImage("menTrousers", 18),
    note: "Smart trousers for work and occasions.",
  },
  {
    id: 19,
    name: "Women's Straight Trousers",
    gender: "Women",
    category: "Trousers",
    price: 700,
    image: clothingImage("womenTrousers", 19),
    note: "Simple straight-cut trousers.",
  },
  {
    id: 20,
    name: "Kids' Smart Trousers",
    gender: "Kids",
    category: "Trousers",
    price: 450,
    image: clothingImage("kidsTrousers", 20),
    note: "Smart comfortable trousers.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatKES(number) {
  return "KSh " + Number(number).toLocaleString("en-KE");
}

function Tag_({ children }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] uppercase px-2 py-1 bg-[#BC5B39] text-[#F3E9DA]">
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
    <div className="group bg-[#F3E9DA] border border-[#1C2541]/10 flex flex-col overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center">
            <Tag size={30} />
          </div>
        )}

        <div className="absolute right-3 top-4 rotate-3 bg-[#F3E9DA] border px-3 py-2 shadow-sm">
          <div className="text-[10px] opacity-50">
            TAG №{String(product.id).padStart(3, "0")}
          </div>
          <div className="text-sm font-bold">
            {formatKES(product.price)}
          </div>
          {product.was && (
            <div className="text-[10px] opacity-50 line-through">
              {formatKES(product.was)}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex gap-2 flex-wrap">
          <Tag_>{product.gender}</Tag_>
          <span className="text-[11px] uppercase tracking-wide opacity-50">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg leading-tight">{product.name}</h3>

        <p className="text-sm opacity-70 flex-1">
          {product.note}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="mt-2 flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-2.5 text-sm uppercase hover:bg-[#2B3654]"
        >
          <Plus size={15} />
          Add to bag
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT SECTION
========================================================= */

function PaymentSection({
  total,
  cart,
  transactionCode,
  setTransactionCode,
  onConfirm,
}) {
  const [copied, setCopied] = useState(false);

  function copyNumber() {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <section className="max-w-5xl mx-auto px-5 pb-16">
      <div className="bg-[#1C2541] text-[#F3E9DA] p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={20} className="text-[#E8A63D]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#E8A63D]">
            Secure payment
          </span>
        </div>

        <h2 className="text-3xl mb-2">
          Pay for your order
        </h2>

        <p className="text-sm text-[#F3E9DA]/60 mb-6">
          Send the exact amount below, then enter your M-Pesa transaction code.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">

          {/* NUMBER */}
          <div className="border border-[#F3E9DA]/20 p-5">
            <div className="text-xs uppercase opacity-50 mb-2">
              Send Money
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Phone size={19} />
                {PAYMENT_NUMBER}
              </div>

              <button
                onClick={copyNumber}
                className="p-2 bg-[#F3E9DA]/10 hover:bg-[#F3E9DA]/20"
                title="Copy number"
              >
                {copied ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </button>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="border border-[#F3E9DA]/20 p-5">
            <div className="text-xs uppercase opacity-50 mb-2">
              Amount to pay
            </div>

            <div className="text-2xl font-bold text-[#E8A63D]">
              {formatKES(total)}
            </div>
          </div>
        </div>

        {/* PAY BUTTON */}
        <div className="mt-5">
          <a
            href={`tel:*334#`}
            className={`w-full flex items-center justify-center gap-2 py-3.5 bg-[#E8A63D] text-[#1C2541] font-semibold uppercase tracking-wide ${
              cart.length === 0
                ? "pointer-events-none opacity-40"
                : "hover:bg-[#f0b658]"
            }`}
          >
            <Phone size={17} />
            Pay {formatKES(total)}
          </a>

          <p className="text-xs text-[#F3E9DA]/50 mt-2">
            Complete the M-Pesa payment on your phone using the number above.
          </p>
        </div>

        {/* TRANSACTION CODE */}
        <div className="mt-6 border-t border-[#F3E9DA]/10 pt-6">
          <label className="text-xs uppercase tracking-wide text-[#F3E9DA]/60">
            M-Pesa Transaction Code
          </label>

          <input
            value={transactionCode}
            onChange={(e) =>
              setTransactionCode(
                e.target.value.toUpperCase()
              )
            }
            placeholder="e.g. QAB12CD34"
            className="mt-2 w-full bg-[#F3E9DA] text-[#1C2541] px-4 py-3 outline-none"
          />

          <button
            onClick={onConfirm}
            disabled={
              cart.length === 0 ||
              transactionCode.trim().length < 5
            }
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white uppercase font-medium disabled:opacity-40"
          >
            <Check size={17} />
            Confirm Payment
          </button>

          <p className="text-xs text-[#F3E9DA]/40 mt-3">
            Your transaction code is used to identify your payment.
            The store should verify payment before treating the order as paid.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT SECTION
========================================================= */

function ContactSection() {
  const message = encodeURIComponent(
    "Hi Duka la Style! I'd like some help choosing clothes."
  );

  return (
    <section className="bg-[#E8DDCB]">
      <div className="max-w-5xl mx-auto px-5 py-14">
        <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={18} className="text-[#BC5B39]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#BC5B39]">
                Contact us
              </span>
            </div>

            <h2 className="text-3xl mb-2">
              Need help finding a look?
            </h2>

            <p className="text-sm opacity-60 max-w-md">
              Message us and we'll help you find something
              that fits your style and budget.
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#1C2541] text-[#F3E9DA] px-5 py-3 uppercase text-sm"
          >
            <MessageCircle size={17} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
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

  const [transactionCode, setTransactionCode] = useState("");

  const genders = ["All", "Men", "Women", "Kids"];

  const categories = useMemo(() => {
    const products =
      gender === "All"
        ? PRODUCTS
        : PRODUCTS.filter(
            (p) => p.gender === gender
          );

    return [
      "All",
      ...new Set(
        products.map((p) => p.category)
      ),
    ];
  }, [gender]);

  const visibleProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const genderMatch =
        gender === "All" ||
        product.gender === gender;

      const categoryMatch =
        category === "All" ||
        product.category === category;

      return genderMatch && categoryMatch;
    });
  }, [gender, category]);

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const itemCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  function changeGender(value) {
    setGender(value);
    setCategory("All");
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          qty: 1,
        },
      ];
    });

    setCartOpen(true);
  }

  function changeQty(id, amount) {
    setCart((current) =>
      current
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

  function confirmPayment() {
    if (!transactionCode.trim()) {
      alert("Please enter your M-Pesa transaction code.");
      return;
    }

    const items = cart
      .map(
        (item) =>
          `• ${item.name} x${item.qty} — ${formatKES(
            item.price * item.qty
          )}`
      )
      .join("\n");

    const message = [
      "NEW DUKA LA STYLE ORDER",
      "",
      items,
      "",
      `TOTAL: ${formatKES(total)}`,
      `PAYMENT NUMBER: ${PAYMENT_NUMBER}`,
      `TRANSACTION CODE: ${transactionCode}`,
      "",
      "Please verify the payment.",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <div
      className="min-h-screen bg-[#F3E9DA] text-[#2B2620]"
      style={{
        fontFamily: "'Work Sans', sans-serif",
      }}
    >

      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Work+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#1C2541] text-[#F3E9DA]">
        <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">

          <div className="text-2xl">
            <span>Duka </span>
            <span className="text-[#E8A63D]">
              la Style
            </span>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 border border-[#F3E9DA]/30 px-3 py-2"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">
              Bag
            </span>

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8A63D] text-[#1C2541] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-5 pt-14 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#BC5B39]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#BC5B39]">
            Fresh bale, opened this week
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl leading-[1.05] mb-4">
          Curated secondhand,
          <br />
          <span className="text-[#BC5B39]">
            styled for everyone.
          </span>
        </h1>

        <p className="opacity-70 max-w-md text-[15px]">
          Quality secondhand clothing for men,
          women and children — hand-picked and
          graded so you don't have to dig through piles.
        </p>
      </section>

      {/* GENDER */}
      <div className="max-w-5xl mx-auto px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {genders.map((item) => (
            <button
              key={item}
              onClick={() => changeGender(item)}
              className={`whitespace-nowrap px-5 py-3 text-sm uppercase border ${
                gender === item
                  ? "bg-[#1C2541] text-[#F3E9DA]"
                  : "border-[#1C2541]/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-5xl mx-auto px-5 mb-7">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap text-xs uppercase px-3 py-2 border ${
                category === item
                  ? "bg-[#BC5B39] text-[#F3E9DA]"
                  : "border-[#1C2541]/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <main className="max-w-5xl mx-auto px-5 pb-16">

        <p className="text-xs uppercase tracking-wide opacity-50 mb-4">
          {visibleProducts.length} items available
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))}
        </div>
      </main>

      {/* PAYMENT */}
      <PaymentSection
        total={total}
        cart={cart}
        transactionCode={transactionCode}
        setTransactionCode={setTransactionCode}
        onConfirm={confirmPayment}
      />

      {/* CONTACT */}
      <ContactSection />

      {/* FOOTER */}
      <footer className="bg-[#1C2541] text-[#F3E9DA]">
        <div className="max-w-5xl mx-auto px-5 py-8 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Duka la Style
        </div>
      </footer>

      {/* CART */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
          />

          <div className="relative w-full max-w-sm h-full bg-[#F3E9DA] flex flex-col">

            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-xl">
                Your bag
              </h3>

              <button
                onClick={() => setCartOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">

              {cart.length === 0 && (
                <p className="text-sm opacity-50">
                  Your bag is empty.
                </p>
              )}

              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.name}
                      </div>

                      <div className="text-xs opacity-60">
                        {formatKES(item.price)}
                      </div>
                    </div>

                    <div className="flex items-center border">
                      <button
                        onClick={() =>
                          changeQty(item.id, -1)
                        }
                        className="p-1.5"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="w-5 text-center text-sm">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          changeQty(item.id, 1)
                        }
                        className="p-1.5"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t px-5 py-5">

              <div className="flex justify-between mb-4">
                <span className="opacity-60">
                  Total
                </span>

                <strong>
                  {formatKES(total)}
                </strong>
              </div>

              <button
                onClick={() => {
                  setCartOpen(false);

                  setTimeout(() => {
                    window.scrollTo({
                      top:
                        document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 100);
                }}
                disabled={cart.length === 0}
                className="w-full bg-[#BC5B39] text-white py-3 uppercase disabled:opacity-40"
              >
                Go to Payment
              </button>

              <button
                onClick={() => {
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

                  window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      message
                    )}`,
                    "_blank"
                  );
                }}
                disabled={cart.length === 0}
                className="w-full mt-2 bg-[#25D366] text-white py-3 uppercase disabled:opacity-40"
              >
                Order via WhatsApp
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}