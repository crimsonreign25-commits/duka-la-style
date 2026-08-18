import React, { useMemo, useState } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Search,
  Heart,
  MessageCircle,
  Sparkles,
  CreditCard,
  Phone,
  ShieldCheck,
  ChevronRight,
  Check,
} from "lucide-react";

/* =========================================================
   DUKA LA STYLE
   Complete App.jsx
========================================================= */

/* Store WhatsApp number only.
   This is NOT displayed in the M-Pesa payment section. */
const WHATSAPP_NUMBER = "254710574821";

/* =========================================================
   TEMPORARY CATEGORY-MATCHED IMAGES

   These are temporary images.
   Replace them with the owner's real product photos later.
========================================================= */

const IMAGES = {
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

  menJeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=85",
  ],

  menJackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85",
  ],

  menShorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=800&q=85",
  ],

  menHoodies: [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=85",
  ],

  menSweaters: [
    "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=800&q=85",
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

  womenJeans: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=85",
  ],

  womenJackets: [
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85",
  ],

  womenBlouses: [
    "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=85",
  ],

  womenJumpsuits: [
    "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=85",
  ],

  kidsBoys: [
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85",
  ],

  kidsGirls: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=800&q=85",
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

  kidsDresses: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=800&q=85",
  ],

  kidsSweaters: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=85",
  ],
};

function getImage(type, id) {
  const list = IMAGES[type] || [];
  if (!list.length) return "";
  return list[id % list.length];
}

/* =========================================================
   PRODUCT DATA
========================================================= */

const PRODUCTS = [
  /* ================= MEN ================= */

  {
    id: 1,
    name: "Classic Smart Trousers",
    gender: "Men",
    category: "Trousers",
    price: 700,
    image: getImage("menTrousers", 1),
    note: "Clean-cut trousers for everyday smart dressing.",
    colours: ["Black", "Navy", "Grey", "Khaki"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    styles: ["Slim", "Regular"],
  },

  {
    id: 2,
    name: "Premium Casual Shirt",
    gender: "Men",
    category: "Shirts",
    price: 600,
    image: getImage("menShirts", 2),
    note: "Easy-going shirt that works for casual occasions.",
    colours: ["White", "Blue", "Black", "Cream"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    styles: ["Regular", "Relaxed"],
  },

  {
    id: 3,
    name: "Essential Cotton T-Shirt",
    gender: "Men",
    category: "T-Shirts",
    price: 400,
    image: getImage("menTshirts", 3),
    note: "Simple everyday cotton T-shirt.",
    colours: ["Black", "White", "Grey", "Navy", "Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    styles: ["Classic", "Oversized"],
  },

  {
    id: 4,
    name: "Urban Denim Jacket",
    gender: "Men",
    category: "Jackets",
    price: 1200,
    image: getImage("menJackets", 4),
    note: "Classic denim layer with an urban finish.",
    colours: ["Blue", "Black", "Light Blue"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Classic", "Oversized"],
  },

  {
    id: 5,
    name: "Everyday Denim Jeans",
    gender: "Men",
    category: "Jeans",
    price: 800,
    image: getImage("menJeans", 5),
    note: "Versatile denim for everyday outfits.",
    colours: ["Dark Blue", "Blue", "Black"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    styles: ["Slim", "Straight"],
  },

  {
    id: 6,
    name: "Weekend Casual Shorts",
    gender: "Men",
    category: "Shorts",
    price: 450,
    image: getImage("menShorts", 6),
    note: "Lightweight shorts for relaxed days.",
    colours: ["Black", "Khaki", "Navy", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Regular", "Relaxed"],
  },

  {
    id: 7,
    name: "Streetwear Hoodie",
    gender: "Men",
    category: "Hoodies",
    price: 950,
    image: getImage("menHoodies", 7),
    note: "Comfortable hoodie with a modern streetwear feel.",
    colours: ["Black", "Grey", "Navy", "Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    styles: ["Classic", "Oversized"],
  },

  {
    id: 8,
    name: "Classic Knit Sweater",
    gender: "Men",
    category: "Sweaters",
    price: 850,
    image: getImage("menSweaters", 8),
    note: "Warm knitwear for a polished casual look.",
    colours: ["Brown", "Grey", "Black", "Cream"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Classic", "Relaxed"],
  },

  /* ================= WOMEN ================= */

  {
    id: 9,
    name: "Floral Wrap Dress",
    gender: "Women",
    category: "Dresses",
    price: 800,
    was: 1200,
    image: getImage("womenDresses", 9),
    note: "Elegant floral wrap dress for different occasions.",
    colours: ["Floral", "Black", "Red", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Midi", "Long"],
  },

  {
    id: 10,
    name: "Statement Print Skirt",
    gender: "Women",
    category: "Skirts",
    price: 600,
    image: getImage("womenSkirts", 10),
    note: "Stylish print designed to stand out.",
    colours: ["Ankara", "Black", "Brown", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Midi", "Long"],
  },

  {
    id: 11,
    name: "Tailored Women's Trousers",
    gender: "Women",
    category: "Trousers",
    price: 650,
    image: getImage("womenTrousers", 11),
    note: "Smart trousers with a clean tailored shape.",
    colours: ["Black", "Navy", "Beige", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Straight", "Wide Leg"],
  },

  {
    id: 12,
    name: "Everyday Women's Top",
    gender: "Women",
    category: "Tops",
    price: 450,
    image: getImage("womenTops", 12),
    note: "Easy-to-style top for everyday outfits.",
    colours: ["White", "Black", "Pink", "Blue", "Cream"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Fitted", "Relaxed"],
  },

  {
    id: 13,
    name: "Classic Women's Jeans",
    gender: "Women",
    category: "Jeans",
    price: 750,
    image: getImage("womenJeans", 13),
    note: "Comfortable denim with a stylish everyday fit.",
    colours: ["Blue", "Dark Blue", "Black"],
    sizes: ["26", "28", "30", "32", "34", "36"],
    styles: ["Straight", "Wide Leg", "Slim"],
  },

  {
    id: 14,
    name: "Women's Denim Jacket",
    gender: "Women",
    category: "Jackets",
    price: 1100,
    image: getImage("womenJackets", 14),
    note: "A versatile layer for casual outfits.",
    colours: ["Blue", "Black", "Light Blue"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Classic", "Oversized"],
  },

  {
    id: 15,
    name: "Elegant Casual Blouse",
    gender: "Women",
    category: "Blouses",
    price: 550,
    image: getImage("womenBlouses", 15),
    note: "Polished blouse suitable for casual or smart looks.",
    colours: ["White", "Cream", "Black", "Pink"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Classic", "Relaxed"],
  },

  {
    id: 16,
    name: "Modern Jumpsuit",
    gender: "Women",
    category: "Jumpsuits",
    price: 950,
    image: getImage("womenJumpsuits", 16),
    note: "A stylish one-piece outfit with a modern finish.",
    colours: ["Black", "Navy", "Brown"],
    sizes: ["S", "M", "L", "XL"],
    styles: ["Straight", "Wide Leg"],
  },

  /* ================= KIDS ================= */

  {
    id: 17,
    name: "Boys' Casual Outfit",
    gender: "Kids",
    category: "Boys",
    price: 500,
    image: getImage("kidsBoys", 17),
    note: "Comfortable everyday outfit for boys.",
    colours: ["Blue", "Black", "Green", "Grey"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Casual", "Smart Casual"],
  },

  {
    id: 18,
    name: "Girls' Casual Outfit",
    gender: "Kids",
    category: "Girls",
    price: 550,
    image: getImage("kidsGirls", 18),
    note: "Comfortable and playful everyday clothing.",
    colours: ["Pink", "Purple", "Blue", "Yellow"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Casual", "Smart Casual"],
  },

  {
    id: 19,
    name: "Kids' Comfortable Trousers",
    gender: "Kids",
    category: "Trousers",
    price: 400,
    image: getImage("kidsTrousers", 19),
    note: "Comfortable trousers for active children.",
    colours: ["Black", "Navy", "Grey", "Khaki"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Regular", "Cargo"],
  },

  {
    id: 20,
    name: "Kids' Colourful T-Shirt",
    gender: "Kids",
    category: "T-Shirts",
    price: 300,
    image: getImage("kidsTshirts", 20),
    note: "Simple colourful T-shirt for everyday wear.",
    colours: ["Blue", "Red", "Green", "Yellow", "Black"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Classic", "Relaxed"],
  },

  {
    id: 21,
    name: "Kids' Summer Shorts",
    gender: "Kids",
    category: "Shorts",
    price: 350,
    image: getImage("kidsShorts", 21),
    note: "Lightweight shorts for active days.",
    colours: ["Blue", "Black", "Khaki", "Green"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Regular", "Relaxed"],
  },

  {
    id: 22,
    name: "Girls' Pretty Dress",
    gender: "Kids",
    category: "Dresses",
    price: 650,
    image: getImage("kidsDresses", 22),
    note: "Cute everyday dress for girls.",
    colours: ["Pink", "Blue", "Purple", "Floral"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Short", "Midi"],
  },

  {
    id: 23,
    name: "Kids' Warm Sweater",
    gender: "Kids",
    category: "Sweaters",
    price: 500,
    image: getImage("kidsSweaters", 23),
    note: "Warm and comfortable sweater for children.",
    colours: ["Grey", "Blue", "Black", "Brown"],
    sizes: ["2–3", "4–5", "6–7", "8–10", "11–13"],
    styles: ["Classic", "Relaxed"],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatKES(number) {
  return `KSh ${Number(number).toLocaleString("en-KE")}`;
}

/* =========================================================
   TAG
========================================================= */

function Tag_({ children, gold = false }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-wider ${
        gold
          ? "bg-[#E8A63D] text-[#1C2541]"
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

function ProductCard({
  product,
  onOpen,
  favourite,
  onFavourite,
}) {
  return (
    <article className="group bg-white border border-[#1C2541]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

      <div className="relative h-72 overflow-hidden bg-[#E8DDCB]">

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3">
          <Tag_>
            {product.category}
          </Tag_>
        </div>

        <button
          onClick={() => onFavourite(product.id)}
          aria-label="Favourite product"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <Heart
            size={18}
            fill={favourite ? "#BC5B39" : "none"}
            className={
              favourite
                ? "text-[#BC5B39]"
                : "text-[#1C2541]"
            }
          />
        </button>

        {product.was && (
          <div className="absolute bottom-3 left-3">
            <Tag_ gold>Special price</Tag_>
          </div>
        )}

      </div>

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-[#BC5B39] mb-1">
              {product.gender}
            </p>

            <h3 className="text-xl text-[#1C2541]">
              {product.name}
            </h3>

          </div>

          <div className="text-right shrink-0">

            <div className="font-semibold text-[#1C2541]">
              {formatKES(product.price)}
            </div>

            {product.was && (
              <div className="text-xs opacity-40 line-through">
                {formatKES(product.was)}
              </div>
            )}

          </div>

        </div>

        <p className="text-sm text-[#1C2541]/60 mt-2 min-h-[40px]">
          {product.note}
        </p>

        <button
          onClick={() => onOpen(product)}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1C2541] text-[#F3E9DA] py-3 text-sm uppercase tracking-wide hover:bg-[#BC5B39] transition-colors"
        >
          View options
          <ChevronRight size={16} />
        </button>

      </div>
    </article>
  );
}

/* =========================================================
   PRODUCT OPTIONS MODAL
========================================================= */

function ProductOptions({
  product,
  onClose,
  onAdd,
}) {
  const [colour, setColour] = useState(
    product.colours[0]
  );

  const [size, setSize] = useState(
    product.sizes[0]
  );

  const [style, setStyle] = useState(
    product.styles[0]
  );

  const [qty, setQty] = useState(1);

  function add() {
    onAdd({
      ...product,
      selectedColour: colour,
      selectedSize: size,
      selectedStyle: style,
      qty,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#F3E9DA] w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">

          {/* IMAGE */}

          <div className="min-h-[400px] md:min-h-[600px] bg-[#E8DDCB]">

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />

          </div>

          {/* DETAILS */}

          <div className="p-6 sm:p-9">

            <Tag_>
              {product.category}
            </Tag_>

            <h2 className="text-3xl sm:text-4xl text-[#1C2541] mt-4">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mt-3">

              <span className="text-2xl font-semibold text-[#BC5B39]">
                {formatKES(product.price)}
              </span>

              {product.was && (
                <span className="line-through opacity-40">
                  {formatKES(product.was)}
                </span>
              )}

            </div>

            <p className="text-sm text-[#1C2541]/60 mt-4">
              {product.note}
            </p>

            {/* COLOUR */}

            <div className="mt-7">

              <div className="flex justify-between mb-3">

                <span className="text-sm font-medium">
                  Colour
                </span>

                <span className="text-sm text-[#BC5B39]">
                  {colour}
                </span>

              </div>

              <div className="flex flex-wrap gap-2">

                {product.colours.map((item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setColour(item)
                    }
                    className={`px-4 py-2 text-sm border ${
                      colour === item
                        ? "border-[#BC5B39] bg-[#BC5B39] text-white"
                        : "border-[#1C2541]/20"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            {/* SIZE */}

            <div className="mt-6">

              <div className="flex justify-between mb-3">

                <span className="text-sm font-medium">
                  Size
                </span>

                <span className="text-sm text-[#BC5B39]">
                  {size}
                </span>

              </div>

              <div className="flex flex-wrap gap-2">

                {product.sizes.map((item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setSize(item)
                    }
                    className={`min-w-[48px] px-3 py-2 text-sm border ${
                      size === item
                        ? "border-[#1C2541] bg-[#1C2541] text-white"
                        : "border-[#1C2541]/20"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            {/* STYLE */}

            <div className="mt-6">

              <div className="text-sm font-medium mb-3">
                Style
              </div>

              <div className="flex flex-wrap gap-2">

                {product.styles.map((item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setStyle(item)
                    }
                    className={`px-4 py-2 text-sm border ${
                      style === item
                        ? "border-[#E8A63D] bg-[#E8A63D] text-[#1C2541]"
                        : "border-[#1C2541]/20"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            {/* QUANTITY */}

            <div className="mt-7">

              <div className="text-sm font-medium mb-3">
                Quantity
              </div>

              <div className="flex items-center border border-[#1C2541]/20 w-fit">

                <button
                  onClick={() =>
                    setQty((v) =>
                      Math.max(1, v - 1)
                    )
                  }
                  className="p-3"
                >
                  <Minus size={15} />
                </button>

                <span className="w-12 text-center">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty((v) => v + 1)
                  }
                  className="p-3"
                >
                  <Plus size={15} />
                </button>

              </div>

            </div>

            {/* SUMMARY */}

            <div className="mt-7 p-4 bg-white border border-[#1C2541]/10">

              <div className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-[#BC5B39]" />
                {colour}
              </div>

              <div className="flex items-center gap-2 text-sm mt-2">
                <Check size={16} className="text-[#BC5B39]" />
                Size {size}
              </div>

              <div className="flex items-center gap-2 text-sm mt-2">
                <Check size={16} className="text-[#BC5B39]" />
                {style} style
              </div>

            </div>

            <button
              onClick={add}
              className="w-full mt-5 bg-[#1C2541] text-white py-4 uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#BC5B39] transition-colors"
            >
              <ShoppingBag size={18} />
              Add to bag
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PAYMENT SECTION
========================================================= */

function PaymentSection({ total, cart }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handlePayment() {
    if (!cart.length) {
      setMessage("Your bag is empty.");
      return;
    }

    if (!phone.trim()) {
      setMessage(
        "Please enter your M-Pesa phone number."
      );
      return;
    }

    setMessage(
      "M-Pesa connection is ready for the store owner's Daraja API. The live payment request will be sent once the owner connects their secure Vercel API."
    );
  }

  return (
    <section
      id="payment"
      className="max-w-5xl mx-auto px-5 py-10"
    >

      <div className="bg-[#1C2541] text-[#F3E9DA] overflow-hidden">

        <div className="p-6 sm:p-9">

          <div className="flex items-center gap-2 text-[#E8A63D] text-xs uppercase tracking-[0.2em]">
            <CreditCard size={17} />
            Secure checkout
          </div>

          <h2 className="text-3xl sm:text-4xl mt-3">
            Pay for your order
          </h2>

          <p className="text-sm text-white/60 mt-2 max-w-xl">
            Enter the M-Pesa number that should receive
            the payment request. Your number is only used
            when you choose to pay.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-7">

            {/* TOTAL */}

            <div className="border border-white/15 p-5">

              <div className="text-xs uppercase text-white/50">
                Order total
              </div>

              <div className="text-3xl font-semibold text-[#E8A63D] mt-2">
                {formatKES(total)}
              </div>

              <div className="text-xs text-white/50 mt-2">
                {cart.reduce(
                  (sum, item) =>
                    sum + item.qty,
                  0
                )}{" "}
                item(s)
              </div>

            </div>

            {/* PHONE */}

            <div className="border border-white/15 p-5">

              <label className="text-xs uppercase text-white/50 block mb-3">
                Customer M-Pesa number
              </label>

              <div className="relative">

                <Phone
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C2541]/50"
                />

                <input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setMessage("");
                  }}
                  type="tel"
                  inputMode="numeric"
                  placeholder="07XXXXXXXX"
                  className="w-full py-3 pl-10 pr-3 bg-[#F3E9DA] text-[#1C2541] outline-none"
                />

              </div>

            </div>

          </div>

          <button
            onClick={handlePayment}
            disabled={!cart.length}
            className="w-full mt-5 bg-[#E8A63D] text-[#1C2541] py-4 font-semibold uppercase tracking-wide disabled:opacity-40 hover:bg-[#f3b95b] transition-colors"
          >
            Pay {formatKES(total)}
          </button>

          {message && (
            <div className="mt-4 p-4 border border-[#E8A63D]/30 bg-[#E8A63D]/10 text-sm">
              {message}
            </div>
          )}

          <div className="mt-5 flex gap-3 text-xs text-white/50">

            <ShieldCheck
              size={18}
              className="text-[#E8A63D] shrink-0"
            />

            <p>
              Payment credentials must be stored on the
              secure server. Never place Safaricom Daraja
              secrets inside this React file.
            </p>

          </div>

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

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [favourites, setFavourites] =
    useState([]);

  const genders = [
    "All",
    "Men",
    "Women",
    "Kids",
  ];

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {

    const source =
      gender === "All"
        ? PRODUCTS
        : PRODUCTS.filter(
            (p) =>
              p.gender === gender
          );

    return [
      "All",
      ...new Set(
        source.map(
          (p) => p.category
        )
      ),
    ];

  }, [gender]);

  /* =======================================================
     PRODUCTS
  ======================================================= */

  const visibleProducts = useMemo(() => {

    const term =
      search.trim().toLowerCase();

    return PRODUCTS.filter((product) => {

      const genderMatch =
        gender === "All" ||
        product.gender === gender;

      const categoryMatch =
        category === "All" ||
        product.category === category;

      const searchMatch =
        !term ||
        product.name
          .toLowerCase()
          .includes(term) ||
        product.category
          .toLowerCase()
          .includes(term) ||
        product.colours.some(
          (c) =>
            c.toLowerCase().includes(term)
        );

      return (
        genderMatch &&
        categoryMatch &&
        searchMatch
      );

    });

  }, [gender, category, search]);

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
     GENDER
  ======================================================= */

  function changeGender(value) {
    setGender(value);
    setCategory("All");
  }

  /* =======================================================
     ADD TO CART
  ======================================================= */

  function addToCart(product) {

    setCart((current) => {

      const existing =
        current.find(
          (item) =>
            item.id === product.id &&
            item.selectedColour ===
              product.selectedColour &&
            item.selectedSize ===
              product.selectedSize &&
            item.selectedStyle ===
              product.selectedStyle
        );

      if (existing) {

        return current.map(
          (item) =>
            item.id === product.id &&
            item.selectedColour ===
              product.selectedColour &&
            item.selectedSize ===
              product.selectedSize &&
            item.selectedStyle ===
              product.selectedStyle
              ? {
                  ...item,
                  qty:
                    item.qty +
                    product.qty,
                }
              : item
        );

      }

      return [
        ...current,
        product,
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
          item.cartId === id ||
          item.id === id
            ? {
                ...item,
                qty:
                  item.qty +
                  amount,
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
     FAVOURITES
  ======================================================= */

  function toggleFavourite(id) {

    setFavourites((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );

  }

  /* =======================================================
     PAYMENT SCROLL
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
     WHATSAPP
  ======================================================= */

  function checkoutWhatsApp() {

    if (!cart.length) return;

    const lines =
      cart.map(
        (item) =>
          `• ${item.name} — ${item.selectedColour}, Size ${item.selectedSize}, ${item.selectedStyle} x${item.qty} — ${formatKES(
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

      {/* =====================================================
          FONTS
      ===================================================== */}

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
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Work+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 bg-[#1C2541] text-[#F3E9DA] shadow-lg">

        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between gap-4">

          <button
            onClick={() => {
              setGender("All");
              setCategory("All");
              setSearch("");
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="text-left"
          >

            <div className="text-2xl sm:text-3xl font-semibold">

              Duka{" "}

              <span className="text-[#E8A63D]">
                la Style
              </span>

            </div>

            <div className="text-[9px] uppercase tracking-[0.25em] text-white/50 mt-1">
              Curated secondhand fashion
            </div>

          </button>

          <button
            onClick={() =>
              setCartOpen(true)
            }
            className="relative flex items-center gap-2 border border-white/20 px-3 sm:px-4 py-2.5 hover:bg-white/10"
          >

            <ShoppingBag size={19} />

            <span className="hidden sm:inline text-sm">
              My Bag
            </span>

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#E8A63D] text-[#1C2541] text-[11px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}

          </button>

        </div>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-5 pt-14 sm:pt-20 pb-10">

        <div className="max-w-3xl">

          <div className="flex items-center gap-2 text-[#BC5B39] text-xs uppercase tracking-[0.2em] mb-5">

            <Sparkles size={16} />

            Fresh styles • Affordable prices

          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#1C2541]">

            Find your

            <br />

            <span className="text-[#BC5B39]">
              next favourite.
            </span>

          </h1>

          <p className="mt-6 text-[#1C2541]/65 max-w-xl leading-relaxed">

            Curated secondhand clothing for men,
            women and children. Choose your style,
            colour and size — then add it to your bag.

          </p>

        </div>

        {/* SEARCH */}

        <div className="relative max-w-2xl mt-8">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C2541]/40"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search trousers, dresses, jeans..."
            className="w-full bg-white border border-[#1C2541]/10 shadow-sm pl-12 pr-4 py-4 outline-none focus:border-[#BC5B39]"
          />

          {search && (
            <button
              onClick={() =>
                setSearch("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={17} />
            </button>
          )}

        </div>

      </section>

      {/* =====================================================
          GENDER FILTER
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-5 mb-5">

        <div className="flex gap-2 overflow-x-auto pb-2">

          {genders.map((item) => (

            <button
              key={item}
              onClick={() =>
                changeGender(item)
              }
              className={`shrink-0 px-6 py-3 text-xs uppercase tracking-wider border ${
                gender === item
                  ? "bg-[#1C2541] text-[#F3E9DA] border-[#1C2541]"
                  : "border-[#1C2541]/20 hover:border-[#BC5B39]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </section>

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-5 mb-8">

        <div className="flex gap-2 overflow-x-auto pb-2">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-wide border ${
                category === item
                  ? "bg-[#BC5B39] text-white border-[#BC5B39]"
                  : "border-[#1C2541]/15 hover:border-[#BC5B39]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </section>

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <main className="max-w-6xl mx-auto px-5 pb-20">

        <div className="flex items-end justify-between mb-5">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#BC5B39]">
              Collection
            </p>

            <h2 className="text-2xl sm:text-3xl text-[#1C2541] mt-1">
              {gender === "All"
                ? "Everything"
                : `${gender}'s collection`}
            </h2>

          </div>

          <span className="text-xs opacity-50">
            {visibleProducts.length} items
          </span>

        </div>

        {visibleProducts.length === 0 ? (

          <div className="py-24 text-center bg-white/50">

            <Search
              size={32}
              className="mx-auto mb-4 opacity-30"
            />

            <h3 className="text-2xl text-[#1C2541]">
              Nothing found
            </h3>

            <p className="text-sm opacity-50 mt-2">
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {visibleProducts.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={
                    setSelectedProduct
                  }
                  favourite={favourites.includes(
                    product.id
                  )}
                  onFavourite={
                    toggleFavourite
                  }
                />

              )
            )}

          </div>

        )}

      </main>

      {/* =====================================================
          PAYMENT
      ===================================================== */}

      <PaymentSection
        total={total}
        cart={cart}
      />

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section className="bg-[#E8DDCB]">

        <div className="max-w-6xl mx-auto px-5 py-14 flex flex-col md:flex-row justify-between gap-7 items-start md:items-center">

          <div>

            <div className="text-[#BC5B39] text-xs uppercase tracking-[0.2em]">
              Need help?
            </div>

            <h2 className="text-3xl text-[#1C2541] mt-2">
              Not sure what to choose?
            </h2>

            <p className="text-sm text-[#1C2541]/60 mt-2 max-w-md">
              Chat with us and we'll help you find
              something within your style and budget.
            </p>

          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi Duka la Style! I'd like help choosing clothes."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#1C2541] text-white px-6 py-3.5 uppercase text-xs tracking-wider hover:bg-[#BC5B39]"
          >

            <MessageCircle size={17} />

            Chat on WhatsApp

          </a>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#1C2541] text-[#F3E9DA]">

        <div className="max-w-6xl mx-auto px-5 py-10 text-center">

          <div className="text-2xl">
            Duka{" "}
            <span className="text-[#E8A63D]">
              la Style
            </span>
          </div>

          <p className="text-xs text-white/40 mt-3">
            Curated secondhand fashion for everyone.
          </p>

          <p className="text-[10px] text-white/30 mt-6">
            © {new Date().getFullYear()} Duka la Style
          </p>

        </div>

      </footer>

      {/* =====================================================
          PRODUCT OPTIONS
      ===================================================== */}

      {selectedProduct && (

        <ProductOptions
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
          onAdd={addToCart}
        />

      )}

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      {cartOpen && (

        <div className="fixed inset-0 z-[80] flex justify-end">

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() =>
              setCartOpen(false)
            }
          />

          <aside className="relative w-full max-w-md h-full bg-[#F3E9DA] flex flex-col shadow-2xl">

            {/* HEADER */}

            <div className="px-5 py-5 border-b border-[#1C2541]/10 flex justify-between items-center">

              <div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-[#BC5B39]">
                  Your selection
                </div>

                <h2 className="text-2xl text-[#1C2541]">
                  My Bag
                </h2>

              </div>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              >
                <X size={20} />
              </button>

            </div>

            {/* ITEMS */}

            <div className="flex-1 overflow-y-auto p-5">

              {!cart.length ? (

                <div className="text-center py-20">

                  <ShoppingBag
                    size={35}
                    className="mx-auto opacity-25"
                  />

                  <h3 className="text-xl mt-4">
                    Your bag is empty
                  </h3>

                  <p className="text-sm opacity-50 mt-2">
                    Choose something you love.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {cart.map(
                    (item, index) => {

                      const cartKey =
                        `${item.id}-${item.selectedColour}-${item.selectedSize}-${item.selectedStyle}-${index}`;

                      return (

                        <div
                          key={cartKey}
                          className="bg-white p-3 flex gap-3"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-24 object-cover shrink-0"
                          />

                          <div className="flex-1 min-w-0">

                            <div className="font-medium text-[#1C2541]">
                              {item.name}
                            </div>

                            <div className="text-xs text-[#BC5B39] mt-1">
                              {item.selectedColour}
                            </div>

                            <div className="text-xs opacity-50 mt-1">
                              Size {item.selectedSize} •{" "}
                              {item.selectedStyle}
                            </div>

                            <div className="font-semibold text-sm mt-2">
                              {formatKES(
                                item.price *
                                  item.qty
                              )}
                            </div>

                            <div className="flex items-center border w-fit mt-2">

                              <button
                                onClick={() =>
                                  setCart(
                                    (current) =>
                                      current
                                        .map(
                                          (x) =>
                                            x ===
                                            item
                                              ? {
                                                  ...x,
                                                  qty:
                                                    x.qty -
                                                    1,
                                                }
                                              : x
                                        )
                                        .filter(
                                          (x) =>
                                            x.qty >
                                            0
                                        )
                                  )
                                }
                                className="p-1.5"
                              >
                                <Minus
                                  size={12}
                                />
                              </button>

                              <span className="w-6 text-center text-xs">
                                {item.qty}
                              </span>

                              <button
                                onClick={() =>
                                  setCart(
                                    (current) =>
                                      current.map(
                                        (x) =>
                                          x ===
                                          item
                                            ? {
                                                ...x,
                                                qty:
                                                  x.qty +
                                                  1,
                                              }
                                            : x
                                      )
                                  )
                                }
                                className="p-1.5"
                              >
                                <Plus
                                  size={12}
                                />
                              </button>

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

            </div>

            {/* BOTTOM */}

            <div className="border-t border-[#1C2541]/10 p-5 bg-[#F3E9DA]">

              <div className="flex justify-between mb-4">

                <span className="text-sm opacity-60">
                  Total
                </span>

                <strong className="text-lg">
                  {formatKES(total)}
                </strong>

              </div>

              <button
                onClick={goToPayment}
                disabled={!cart.length}
                className="w-full bg-[#BC5B39] text-white py-3.5 uppercase text-sm disabled:opacity-40 hover:bg-[#a94f31]"
              >
                Go to payment
              </button>

              <button
                onClick={checkoutWhatsApp}
                disabled={!cart.length}
                className="w-full mt-2 bg-[#25D366] text-white py-3.5 uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <MessageCircle size={17} />
                Order via WhatsApp
              </button>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}