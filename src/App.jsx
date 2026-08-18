import React, { useMemo, useState } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  Tag,
  CreditCard,
  Phone,
  ShieldCheck,
  Search,
  ChevronRight,
  Heart,
  Star,
  Trash2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   STORE SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "254710574821";

/* =========================================================
   IMAGE SYSTEM
   Category-specific images.
========================================================= */

const CLOTHING_IMAGES = {
  menTrousers: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1506629905607-d9f5b5d9b2c8?auto=format&fit=crop&w=800&q=85",
  ],

  menShirts: [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=85",
  ],

  menTshirts: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4e6?auto=format&fit=crop&w=800&q=85",
  ],

  menJackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85",
  ],

  menJeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=85",
  ],

  menShorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=800&q=85",
  ],

  womenDresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85",
  ],

  womenSkirts: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=800&q=85",
  ],

  womenTrousers: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
  ],

  womenTops: [
    "https://images.unsplash.com/photo-1564257577054-0f3f4a1c0c65?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
  ],

  womenJackets: [
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85",
  ],

  womenJeans: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=85",
  ],

  kidsTrousers: [
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=85",
  ],

  kidsTshirts: [
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=85",
  ],

  kidsShorts: [
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85",
  ],

  boys: [
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85",
  ],

  girls: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=800&q=85",
  ],
};

function clothingImage(type, id) {
  const images = CLOTHING_IMAGES[type];

  if (!images || images.length === 0) return "";

  return images[id % images.length];
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
    note: "Smart and comfortable trousers for everyday wear.",
    featured: true,
  },
  {
    id: 2,
    name: "Men's Casual Shirt",
    gender: "Men",
    category: "Shirts",
    price: 600,
    image: clothingImage("menShirts", 2),
    note: "A clean casual shirt with an easy everyday fit.",
    featured: true,
  },
  {
    id: 3,
    name: "Men's Basic T-Shirt",
    gender: "Men",
    category: "T-Shirts",
    price: 400,
    image: clothingImage("menTshirts", 3),
    note: "A simple everyday essential.",
  },
  {
    id: 4,
    name: "Men's Denim Jacket",
    gender: "Men",
    category: "Jackets",
    price: 1200,
    image: clothingImage("menJackets", 4),
    note: "A classic denim layer for casual outfits.",
    featured: true,
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
    note: "A beautiful floral style for different occasions.",
    featured: true,
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
    featured: true,
  },
  {
    id: 10,
    name: "Women's Casual Top",
    gender: "Women",
    category: "Tops",
    price: 450,
    image: clothingImage("womenTops", 10),
    note: "An easy-to-style casual top.",
  },
  {
    id: 11,
    name: "Women's Denim Jacket",
    gender: "Women",
    category: "Jackets",
    price: 1100,
    image: clothingImage("womenJackets", 11),
    note: "A classic denim layer.",
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
    featured: true,
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
    note: "A simple comfortable children's T-shirt.",
  },
  {
    id: 17,
    name: "Kids' Shorts",
    gender: "Kids",
    category: "Shorts",
    price: 350,
    image: clothingImage("kidsShorts", 17),
    note: "Light and comfortable children's shorts.",
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
    note: "Smart and comfortable children's trousers.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatKES(number) {
  return "KSh " + Number(number).toLocaleString("en-KE");
}

/* =========================================================
   TAG
========================================================= */

function Tag_({ children, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-1 font-medium ${
        dark
          ? "bg-[#1C2541] text-[#F3E9DA]"
          : "bg-[#BC5B39] text-[#F3E9DA]"
      }`}
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
  const [liked, setLiked] = useState(false);

  return (
    <article className="group bg-white border border-[#1C2541]/10 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

      {/* IMAGE */}

      <div className="relative h-72 sm:h-80 overflow-hidden bg-[#E8DDCB]">

        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1C2541]/40">
            <Tag size={34} />
            <span className="text-xs mt-2">
              Image unavailable
            </span>
          </div>
        )}

        {/* TOP LABEL */}

        <div className="absolute top-3 left-3 flex gap-2">

          {product.featured && (
            <Tag_>
              <Sparkles size={11} />
              Featured
            </Tag_>
          )}

          {product.was && (
            <Tag_ dark>
              Sale
            </Tag_>
          )}

        </div>

        {/* HEART */}

        <button
          onClick={() => setLiked(!liked)}
          aria-label="Favourite product"
          className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            size={17}
            className={
              liked
                ? "fill-[#BC5B39] text-[#BC5B39]"
                : "text-[#1C2541]"
            }
          />
        </button>

        {/* PRICE */}

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-2 shadow-sm">

          <div className="text-[9px] uppercase tracking-wider opacity-45">
            Price
          </div>

          <div className="font-bold text-[#1C2541]">
            {formatKES(product.price)}
          </div>

          {product.was && (
            <div className="text-[10px] line-through opacity-40">
              {formatKES(product.was)}
            </div>
          )}

        </div>

      </div>

      {/* DETAILS */}

      <div className="p-5">

        <div className="flex items-center justify-between gap-2 mb-2">

          <span className="text-[10px] uppercase tracking-[0.15em] text-[#BC5B39] font-semibold">
            {product.gender}
          </span>

          <span className="text-[10px] uppercase tracking-wider opacity-40">
            {product.category}
          </span>

        </div>

        <h3 className="text-xl text-[#1C2541] font-semibold mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-[#2B2620]/60 leading-relaxed min-h-[42px]">
          {product.note}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#BC5B39] transition-colors"
        >
          <ShoppingBag size={15} />
          Add to bag
        </button>

      </div>
    </article>
  );
}

/* =========================================================
   PAYMENT SECTION
========================================================= */

function PaymentSection({ total, cart }) {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");

  function handlePayment() {
    if (cart.length === 0) {
      alert("Your bag is empty.");
      return;
    }

    if (paymentMethod === "mpesa") {
      if (!phone.trim()) {
        alert("Please enter your M-Pesa phone number.");
        return;
      }

      alert(
        "M-Pesa payment is not connected yet. The store owner needs to connect their Daraja account before live payments can be accepted."
      );
      return;
    }

    if (paymentMethod === "card") {
      alert(
        "Card payments are not connected yet. The store owner needs to connect a secure card payment provider."
      );
      return;
    }

    alert(
      "Cash payment selected. Please contact the store to arrange payment."
    );
  }

  return (
    <section
      id="payment"
      className="bg-[#1C2541] text-[#F3E9DA] scroll-mt-20"
    >

      <div className="max-w-5xl mx-auto px-5 py-14">

        {/* HEADING */}

        <div className="max-w-xl mb-8">

          <div className="flex items-center gap-2 text-[#E8A63D] mb-3">
            <CreditCard size={18} />

            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              Secure checkout
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl mb-3">
            Complete your order
          </h2>

          <p className="text-sm text-[#F3E9DA]/60">
            Choose how you'd like to pay. Your selected
            payment method will determine the next step.
          </p>

        </div>

        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-6">

          {/* LEFT */}

          <div className="bg-[#24304f] p-5 sm:p-6">

            <label className="block text-[10px] uppercase tracking-wider text-[#F3E9DA]/50 mb-2">
              Payment method
            </label>

            <div className="grid grid-cols-3 gap-2 mb-6">

              {[
                ["mpesa", "M-Pesa"],
                ["card", "Card"],
                ["cash", "Cash"],
              ].map(([value, label]) => (

                <button
                  key={value}
                  onClick={() => setPaymentMethod(value)}
                  className={`py-3 px-2 text-xs uppercase tracking-wide border transition ${
                    paymentMethod === value
                      ? "bg-[#E8A63D] text-[#1C2541] border-[#E8A63D]"
                      : "border-[#F3E9DA]/20 text-[#F3E9DA]/70 hover:border-[#F3E9DA]/50"
                  }`}
                >
                  {label}
                </button>

              ))}

            </div>

            {/* M-PESA */}

            {paymentMethod === "mpesa" && (
              <div className="animate-[fadeIn_0.2s_ease-out]">

                <label className="block text-[10px] uppercase tracking-wider text-[#F3E9DA]/50 mb-2">
                  M-Pesa phone number
                </label>

                <div className="relative">

                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C2541]/50"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 12);

                      setPhone(value);
                    }}
                    placeholder="Enter M-Pesa number"
                    inputMode="numeric"
                    autoComplete="tel"
                    className="w-full bg-[#F3E9DA] text-[#1C2541] pl-10 pr-3 py-3.5 outline-none"
                  />

                </div>

                <p className="text-[11px] text-[#F3E9DA]/40 mt-2">
                  Example: 0712345678
                </p>

              </div>
            )}

            {/* CARD */}

            {paymentMethod === "card" && (
              <div className="border border-[#F3E9DA]/15 p-5">

                <CreditCard
                  size={26}
                  className="text-[#E8A63D] mb-3"
                />

                <h3 className="font-semibold mb-1">
                  Card payment
                </h3>

                <p className="text-xs text-[#F3E9DA]/50 leading-relaxed">
                  A secure card payment page will be
                  connected by the store owner before
                  accepting live card payments.
                </p>

              </div>
            )}

            {/* CASH */}

            {paymentMethod === "cash" && (
              <div className="border border-[#F3E9DA]/15 p-5">

                <CheckCircle2
                  size={26}
                  className="text-[#E8A63D] mb-3"
                />

                <h3 className="font-semibold mb-1">
                  Cash payment
                </h3>

                <p className="text-xs text-[#F3E9DA]/50 leading-relaxed">
                  Select this option if you've arranged
                  cash payment with the store.
                </p>

              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={cart.length === 0}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-[#E8A63D] text-[#1C2541] font-bold uppercase tracking-wide text-sm disabled:opacity-30 hover:bg-[#f2b85c] transition"
            >

              {paymentMethod === "mpesa" && (
                <>
                  <Phone size={16} />
                  Pay with M-Pesa
                </>
              )}

              {paymentMethod === "card" && (
                <>
                  <CreditCard size={16} />
                  Pay with Card
                </>
              )}

              {paymentMethod === "cash" && (
                <>
                  <CheckCircle2 size={16} />
                  Choose Cash
                </>
              )}

            </button>

          </div>

          {/* ORDER SUMMARY */}

          <div className="bg-[#F3E9DA] text-[#1C2541] p-5 sm:p-6">

            <div className="flex items-center justify-between mb-5">

              <h3 className="text-xl font-semibold">
                Order summary
              </h3>

              <ShoppingBag size={20} />

            </div>

            <div className="space-y-3 mb-5">

              {cart.length === 0 ? (
                <p className="text-sm opacity-50">
                  Your bag is empty.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="truncate">
                      {item.name} × {item.qty}
                    </span>

                    <span className="font-semibold whitespace-nowrap">
                      {formatKES(item.price * item.qty)}
                    </span>
                  </div>
                ))
              )}

            </div>

            <div className="border-t border-[#1C2541]/10 pt-4 flex justify-between">

              <span className="opacity-60">
                Total
              </span>

              <span className="text-xl font-bold">
                {formatKES(total)}
              </span>

            </div>

            <div className="mt-5 flex items-start gap-2 text-xs opacity-50">

              <ShieldCheck size={15} />

              <span>
                Your payment information should only be
                processed through a secure payment provider.
              </span>

            </div>

          </div>

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

        <div className="bg-[#BC5B39] text-[#F3E9DA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div>

            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={18} />

              <span className="text-[10px] uppercase tracking-[0.2em]">
                Need help?
              </span>
            </div>

            <h2 className="text-3xl mb-2">
              Can't decide what to wear?
            </h2>

            <p className="text-sm text-white/70 max-w-md">
              Message us and we'll help you find something
              that suits your style and budget.
            </p>

          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#1C2541] text-[#F3E9DA] px-5 py-3.5 text-xs uppercase tracking-wide font-semibold whitespace-nowrap hover:bg-[#273253] transition"
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

  const [search, setSearch] = useState("");

  const [showFeatured, setShowFeatured] = useState(false);

  const genders = [
    {
      name: "All",
      icon: "✦",
    },
    {
      name: "Men",
      icon: "♂",
    },
    {
      name: "Women",
      icon: "♀",
    },
    {
      name: "Kids",
      icon: "✿",
    },
  ];

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {

    const filtered =
      gender === "All"
        ? PRODUCTS
        : PRODUCTS.filter(
            (product) =>
              product.gender === gender
          );

    return [
      "All",
      ...new Set(
        filtered.map(
          (product) =>
            product.category
        )
      ),
    ];

  }, [gender]);

  /* =======================================================
     PRODUCTS
  ======================================================= */

  const visibleProducts = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    return PRODUCTS.filter((product) => {

      const genderMatch =
        gender === "All" ||
        product.gender === gender;

      const categoryMatch =
        category === "All" ||
        product.category === category;

      const featuredMatch =
        !showFeatured ||
        product.featured;

      const searchMatch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query) ||
        product.gender
          .toLowerCase()
          .includes(query);

      return (
        genderMatch &&
        categoryMatch &&
        featuredMatch &&
        searchMatch
      );

    });

  }, [
    gender,
    category,
    search,
    showFeatured,
  ]);

  /* =======================================================
     FEATURED
  ======================================================= */

  const featuredProducts = PRODUCTS.filter(
    (product) => product.featured
  ).slice(0, 4);

  /* =======================================================
     CART TOTAL
  ======================================================= */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.qty,
    0
  );

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + item.qty,
    0
  );

  /* =======================================================
     CHANGE GENDER
  ======================================================= */

  function changeGender(value) {
    setGender(value);
    setCategory("All");
    setShowFeatured(false);

    setTimeout(() => {
      document
        .getElementById("shop")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  /* =======================================================
     ADD TO CART
  ======================================================= */

  function addToCart(product) {

    setCart((current) => {

      const existing =
        current.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {

        return current.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  qty:
                    item.qty + 1,
                }
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

  /* =======================================================
     QUANTITY
  ======================================================= */

  function changeQty(id, amount) {

    setCart((current) =>
      current
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
     REMOVE
  ======================================================= */

  function removeItem(id) {

    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  /* =======================================================
     GO TO PAYMENT
  ======================================================= */

  function goToPayment() {

    setCartOpen(false);

    setTimeout(() => {

      document
        .getElementById("payment")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

    }, 150);
  }

  /* =======================================================
     WHATSAPP ORDER
  ======================================================= */

  function orderWhatsApp() {

    if (cart.length === 0) return;

    const lines =
      cart.map(
        (item) =>
          `• ${item.name} x${item.qty} — ${formatKES(
            item.price *
              item.qty
          )}`
      );

    const message = [
      "Hi Duka la Style! I'd like to order:",
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
  }

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
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-40 bg-[#1C2541] text-[#F3E9DA] shadow-lg">

        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between gap-4">

          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex items-baseline"
          >

            <span
              className="text-2xl sm:text-3xl"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Duka
            </span>

            <span
              className="text-2xl sm:text-3xl text-[#E8A63D]"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              {" "}la Style
            </span>

          </button>

          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider">

            <button
              onClick={() =>
                document
                  .getElementById("shop")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="opacity-70 hover:opacity-100"
            >
              Shop
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("payment")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="opacity-70 hover:opacity-100"
            >
              Checkout
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="opacity-70 hover:opacity-100"
            >
              Contact
            </button>

          </div>

          <button
            onClick={() =>
              setCartOpen(true)
            }
            className="relative flex items-center gap-2 border border-[#F3E9DA]/25 px-3 py-2.5 hover:bg-white/10 transition"
          >

            <ShoppingBag size={18} />

            <span className="hidden sm:inline text-xs uppercase tracking-wide">
              Bag
            </span>

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8A63D] text-[#1C2541] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}

          </button>

        </div>

      </header>

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden bg-[#F3E9DA]">

        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-20 lg:py-24">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-[#BC5B39]/10 text-[#BC5B39] px-3 py-2 mb-5">

              <Sparkles size={14} />

              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                Fresh styles • Great prices
              </span>

            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#1C2541] mb-6"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Style that feels
              <br />

              <span className="text-[#BC5B39]">
                good to wear.
              </span>
            </h1>

            <p className="max-w-xl text-[#2B2620]/65 text-base sm:text-lg leading-relaxed mb-8">
              Curated secondhand clothing for men,
              women and children. Find great pieces
              without digging through piles.
            </p>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() =>
                  document
                    .getElementById("shop")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="flex items-center gap-2 bg-[#1C2541] text-[#F3E9DA] px-6 py-3.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#BC5B39] transition"
              >
                Shop collection
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() =>
                  changeGender("Women")
                }
                className="px-6 py-3.5 border border-[#1C2541]/20 text-[#1C2541] text-xs uppercase tracking-wider font-semibold hover:border-[#BC5B39] hover:text-[#BC5B39] transition"
              >
                Women's styles
              </button>

            </div>

          </div>

          {/* MINI TRUST BAR */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-14">

            {[
              ["✦", "Curated pieces"],
              ["KSh", "Friendly prices"],
              ["✓", "Quality checked"],
              ["↗", "Easy ordering"],
            ].map(([icon, text]) => (

              <div
                key={text}
                className="bg-white/60 border border-[#1C2541]/5 p-4"
              >

                <div className="text-[#BC5B39] font-bold mb-1">
                  {icon}
                </div>

                <div className="text-xs uppercase tracking-wide text-[#1C2541]/60">
                  {text}
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ===================================================
          SHOP NAVIGATION
      =================================================== */}

      <section
        id="shop"
        className="max-w-6xl mx-auto px-5 pt-12 scroll-mt-20"
      >

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">

          <div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-[#BC5B39] font-semibold mb-2">
              Browse collection
            </div>

            <h2
              className="text-3xl sm:text-4xl text-[#1C2541]"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Find your next favourite.
            </h2>

          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-80">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C2541]/40"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search clothes..."
              className="w-full bg-white border border-[#1C2541]/10 pl-10 pr-10 py-3.5 outline-none text-sm focus:border-[#BC5B39] transition"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C2541]/40 hover:text-[#BC5B39]"
              >
                <X size={16} />
              </button>
            )}

          </div>

        </div>

        {/* GENDER BUTTONS */}

        <div className="grid grid-cols-4 gap-2 mb-5">

          {genders.map((item) => (

            <button
              key={item.name}
              onClick={() =>
                changeGender(item.name)
              }
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3.5 border text-xs uppercase tracking-wide transition ${
                gender === item.name
                  ? "bg-[#1C2541] text-[#F3E9DA] border-[#1C2541]"
                  : "bg-white border-[#1C2541]/10 text-[#1C2541]/65 hover:border-[#BC5B39] hover:text-[#BC5B39]"
              }`}
            >

              <span className="text-sm">
                {item.icon}
              </span>

              {item.name}

            </button>

          ))}

        </div>

        {/* CATEGORIES */}

        <div className="flex gap-2 overflow-x-auto pb-2">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              className={`whitespace-nowrap px-4 py-2.5 border text-[10px] uppercase tracking-wider transition ${
                category === item
                  ? "bg-[#BC5B39] text-[#F3E9DA] border-[#BC5B39]"
                  : "bg-transparent border-[#1C2541]/15 text-[#1C2541]/60 hover:border-[#BC5B39]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </section>

      {/* ===================================================
          FEATURED STRIP
      =================================================== */}

      {!search &&
        gender === "All" &&
        category === "All" &&
        !showFeatured && (

          <section className="max-w-6xl mx-auto px-5 pt-10">

            <div className="bg-[#1C2541] text-[#F3E9DA] p-6 sm:p-8">

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2 text-[#E8A63D] mb-2">

                    <Sparkles size={15} />

                    <span className="text-[10px] uppercase tracking-[0.2em]">
                      Hand-picked
                    </span>

                  </div>

                  <h2
                    className="text-3xl"
                    style={{
                      fontFamily:
                        "'Fraunces', serif",
                    }}
                  >
                    Featured pieces
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setShowFeatured(true)
                  }
                  className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#E8A63D] hover:text-white"
                >
                  View all featured
                  <ChevronRight size={15} />
                </button>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

                {featuredProducts.map(
                  (product) => (
                    <button
                      key={product.id}
                      onClick={() =>
                        addToCart(product)
                      }
                      className="text-left group"
                    >

                      <div className="aspect-[4/5] overflow-hidden bg-[#F3E9DA]/10 mb-2">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                      </div>

                      <div className="text-xs truncate">
                        {product.name}
                      </div>

                      <div className="text-[#E8A63D] text-xs font-semibold mt-1">
                        {formatKES(
                          product.price
                        )}
                      </div>

                    </button>
                  )
                )}

              </div>

            </div>

          </section>

        )}

      {/* ===================================================
          PRODUCT AREA
      =================================================== */}

      <main className="max-w-6xl mx-auto px-5 py-10 pb-20">

        <div className="flex items-center justify-between mb-5">

          <div>

            <span className="text-sm font-semibold text-[#1C2541]">
              {visibleProducts.length}
            </span>

            <span className="text-sm opacity-50 ml-1">
              {visibleProducts.length === 1
                ? "piece"
                : "pieces"}{" "}
              found
            </span>

          </div>

          {(search ||
            category !== "All" ||
            gender !== "All" ||
            showFeatured) && (

            <button
              onClick={() => {
                setSearch("");
                setGender("All");
                setCategory("All");
                setShowFeatured(false);
              }}
              className="text-[10px] uppercase tracking-wider text-[#BC5B39] flex items-center gap-1"
            >
              Clear filters
              <X size={13} />
            </button>

          )}

        </div>

        {visibleProducts.length === 0 ? (

          <div className="bg-white border border-[#1C2541]/10 py-20 px-5 text-center">

            <Search
              size={35}
              className="mx-auto text-[#BC5B39] mb-4"
            />

            <h2
              className="text-2xl text-[#1C2541] mb-2"
              style={{
                fontFamily:
                  "'Fraunces', serif",
              }}
            >
              Nothing matched your search
            </h2>

            <p className="text-sm opacity-50 mb-5">
              Try another clothing type or clear
              your filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setGender("All");
                setCategory("All");
                setShowFeatured(false);
              }}
              className="bg-[#1C2541] text-[#F3E9DA] px-5 py-3 text-xs uppercase tracking-wide"
            >
              Show everything
            </button>

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
          PAYMENT
      =================================================== */}

      <PaymentSection
        total={total}
        cart={cart}
      />

      {/* ===================================================
          CONTACT
      =================================================== */}

      <div id="contact">
        <ContactSection />
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="bg-[#1C2541] text-[#F3E9DA]">

        <div className="max-w-6xl mx-auto px-5 py-10">

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

            <div>

              <div
                className="text-2xl mb-2"
                style={{
                  fontFamily:
                    "'Fraunces', serif",
                }}
              >
                Duka{" "}
                <span className="text-[#E8A63D]">
                  la Style
                </span>
              </div>

              <p className="text-xs text-[#F3E9DA]/45 leading-relaxed max-w-xs">
                Curated secondhand clothing for
                everyone, at prices that make sense.
              </p>

            </div>

            <div>

              <h3 className="text-xs uppercase tracking-wider text-[#E8A63D] mb-3">
                Shop
              </h3>

              <div className="space-y-2 text-sm text-[#F3E9DA]/60">

                <button
                  onClick={() =>
                    changeGender("Men")
                  }
                  className="block hover:text-white"
                >
                  Men
                </button>

                <button
                  onClick={() =>
                    changeGender("Women")
                  }
                  className="block hover:text-white"
                >
                  Women
                </button>

                <button
                  onClick={() =>
                    changeGender("Kids")
                  }
                  className="block hover:text-white"
                >
                  Kids
                </button>

              </div>

            </div>

            <div>

              <h3 className="text-xs uppercase tracking-wider text-[#E8A63D] mb-3">
                Contact
              </h3>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#F3E9DA]/60 hover:text-white"
              >
                <MessageCircle size={15} />
                WhatsApp us
              </a>

            </div>

          </div>

          <div className="border-t border-[#F3E9DA]/10 mt-8 pt-5 text-[11px] text-[#F3E9DA]/35 flex flex-col sm:flex-row justify-between gap-2">

            <span>
              © {new Date().getFullYear()} Duka la Style
            </span>

            <span>
              Quality • Style • Value
            </span>

          </div>

        </div>

      </footer>

      {/* ===================================================
          CART DRAWER
      =================================================== */}

      {cartOpen && (

        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() =>
              setCartOpen(false)
            }
          />

          {/* DRAWER */}

          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#F3E9DA] flex flex-col shadow-2xl">

            {/* HEADER */}

            <div className="px-5 py-5 border-b border-[#1C2541]/10 flex items-center justify-between">

              <div>

                <div className="text-[10px] uppercase tracking-wider text-[#BC5B39] mb-1">
                  Your selection
                </div>

                <h2
                  className="text-2xl text-[#1C2541]"
                  style={{
                    fontFamily:
                      "'Fraunces', serif",
                  }}
                >
                  Shopping bag
                </h2>

              </div>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="w-9 h-9 flex items-center justify-center border border-[#1C2541]/10 hover:bg-white"
              >
                <X size={19} />
              </button>

            </div>

            {/* ITEMS */}

            <div className="flex-1 overflow-y-auto p-5">

              {cart.length === 0 ? (

                <div className="text-center py-16">

                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">

                    <ShoppingBag
                      size={26}
                      className="text-[#BC5B39]"
                    />

                  </div>

                  <h3
                    className="text-xl text-[#1C2541] mb-2"
                    style={{
                      fontFamily:
                        "'Fraunces', serif",
                    }}
                  >
                    Your bag is empty
                  </h3>

                  <p className="text-sm opacity-50 mb-5">
                    Add something you love and it
                    will appear here.
                  </p>

                  <button
                    onClick={() =>
                      setCartOpen(false)
                    }
                    className="bg-[#1C2541] text-[#F3E9DA] px-5 py-3 text-xs uppercase tracking-wide"
                  >
                    Continue shopping
                  </button>

                </div>

              ) : (

                <div className="space-y-4">

                  {cart.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="bg-white p-3 flex gap-3"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">

                          <div className="flex justify-between gap-2">

                            <h3 className="text-sm font-semibold text-[#1C2541] leading-tight">
                              {item.name}
                            </h3>

                            <button
                              onClick={() =>
                                removeItem(
                                  item.id
                                )
                              }
                              className="text-[#1C2541]/30 hover:text-[#BC5B39]"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>

                          </div>

                          <div className="text-xs text-[#BC5B39] mt-1">
                            {formatKES(
                              item.price
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">

                            <div className="flex items-center border border-[#1C2541]/15">

                              <button
                                onClick={() =>
                                  changeQty(
                                    item.id,
                                    -1
                                  )
                                }
                                className="p-2 hover:bg-[#F3E9DA]"
                              >
                                <Minus size={12} />
                              </button>

                              <span className="w-7 text-center text-xs font-semibold">
                                {item.qty}
                              </span>

                              <button
                                onClick={() =>
                                  changeQty(
                                    item.id,
                                    1
                                  )
                                }
                                className="p-2 hover:bg-[#F3E9DA]"
                              >
                                <Plus size={12} />
                              </button>

                            </div>

                            <span className="text-sm font-bold text-[#1C2541]">
                              {formatKES(
                                item.price *
                                  item.qty
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* TOTAL */}

            {cart.length > 0 && (

              <div className="border-t border-[#1C2541]/10 p-5 bg-white">

                <div className="flex justify-between mb-4">

                  <span className="text-sm opacity-60">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#1C2541]">
                    {formatKES(total)}
                  </span>

                </div>

                <button
                  onClick={goToPayment}
                  className="w-full bg-[#1C2541] text-[#F3E9DA] py-3.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#BC5B39] transition flex items-center justify-center gap-2"
                >
                  Continue to payment
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={orderWhatsApp}
                  className="w-full mt-2 bg-[#25D366] text-white py-3.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#20bd5a] transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Order via WhatsApp
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] opacity-40 mt-4">
                  <ShieldCheck size={13} />
                  Secure checkout
                </div>

              </div>

            )}

          </aside>

        </div>

      )}

    </div>
  );
}