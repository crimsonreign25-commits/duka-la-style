import React, { useMemo, useState } from "react";
import {
  ShoppingBag, X, Plus, Minus, MessageCircle, Sparkles,
  CreditCard, Phone, ShieldCheck, Heart, ArrowRight, Star,
  ChevronLeft, ChevronRight, Search, SlidersHorizontal
} from "lucide-react";

/* =========================================================
   DUKA LA STYLE — COMPLETE APP
   Replace your current src/App.jsx with this file.
========================================================= */

const WHATSAPP_NUMBER = "254710574821";

const IMG = {
  menTrousers: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=85",
  ],
  menShirts: [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=900&q=85",
  ],
  menTshirts: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1583743814966-8936f37f4e6?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",
  ],
  menJackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=85",
  ],
  menJeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=85",
  ],
  menShorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85",
  ],
  womenDresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=900&q=85",
  ],
  womenSkirts: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=900&q=85",
  ],
  womenTrousers: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
  ],
  womenTops: [
    "https://images.unsplash.com/photo-1564257577054-0f3f4a1c0c65?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=900&q=85",
  ],
  womenJackets: [
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  ],
  womenJeans: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=900&q=85",
  ],
  kidsTrousers: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=85",
  ],
  kidsTshirts: [
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=85",
  ],
  kidsShorts: [
    "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=85",
  ],
  girls: [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=900&q=85",
  ],
};

const products = [
  ["Classic Chino Trousers","Men","Trousers","Classic",700,"menTrousers",4.8],
  ["Smart Office Trousers","Men","Trousers","Formal",850,"menTrousers",4.9],
  ["Relaxed Fit Trousers","Men","Trousers","Relaxed",750,"menTrousers",4.7],
  ["Premium Casual Shirt","Men","Shirts","Smart Casual",750,"menShirts",4.9],
  ["Classic Button Shirt","Men","Shirts","Classic",650,"menShirts",4.8],
  ["Weekend Shirt","Men","Shirts","Casual",600,"menShirts",4.7],
  ["Essential T-Shirt","Men","T-Shirts","Essential",400,"menTshirts",4.6],
  ["Oversized Street T-Shirt","Men","T-Shirts","Oversized",500,"menTshirts",4.8],
  ["Classic Polo T-Shirt","Men","T-Shirts","Polo",550,"menTshirts",4.8],
  ["Denim Jacket","Men","Jackets","Denim",1200,"menJackets",4.9],
  ["Everyday Jeans","Men","Jeans","Classic",800,"menJeans",4.8],
  ["Slim Denim Jeans","Men","Jeans","Slim",850,"menJeans",4.8],
  ["Casual Shorts","Men","Shorts","Casual",450,"menShorts",4.6],
  ["Premium Shorts","Men","Shorts","Premium",550,"menShorts",4.7],

  ["Floral Wrap Dress","Women","Dresses","Floral",800,"womenDresses",4.9],
  ["Elegant Evening Dress","Women","Dresses","Elegant",1100,"womenDresses",4.9],
  ["Maxi Dress","Women","Dresses","Maxi",950,"womenDresses",4.8],
  ["Ankara Print Skirt","Women","Skirts","Ankara",600,"womenSkirts",4.8],
  ["Elegant Midi Skirt","Women","Skirts","Midi",650,"womenSkirts",4.7],
  ["Pleated Skirt","Women","Skirts","Pleated",700,"womenSkirts",4.8],
  ["Tailored Trousers","Women","Trousers","Tailored",650,"womenTrousers",4.8],
  ["Wide-Leg Trousers","Women","Trousers","Wide Leg",750,"womenTrousers",4.9],
  ["Casual Women's Top","Women","Tops","Casual",450,"womenTops",4.7],
  ["Elegant Women's Top","Women","Tops","Elegant",550,"womenTops",4.8],
  ["Statement Top","Women","Tops","Statement",600,"womenTops",4.8],
  ["Denim Jacket","Women","Jackets","Denim",1100,"womenJackets",4.9],
  ["Classic Women's Jeans","Women","Jeans","Classic",750,"womenJeans",4.8],
  ["High-Rise Jeans","Women","Jeans","High Rise",850,"womenJeans",4.9],

  ["Boys' Casual Outfit","Kids","Boys","Casual",500,"kidsTshirts",4.7],
  ["Boys' Smart Outfit","Kids","Boys","Smart",650,"kidsTrousers",4.8],
  ["Girls' Casual Outfit","Kids","Girls","Casual",550,"girls",4.8],
  ["Girls' Stylish Outfit","Kids","Girls","Stylish",650,"girls",4.9],
  ["Kids' Everyday Trousers","Kids","Trousers","Everyday",400,"kidsTrousers",4.7],
  ["Kids' Smart Trousers","Kids","Trousers","Smart",450,"kidsTrousers",4.8],
  ["Kids' Essential T-Shirt","Kids","T-Shirts","Essential",300,"kidsTshirts",4.6],
  ["Kids' Graphic T-Shirt","Kids","T-Shirts","Graphic",350,"kidsTshirts",4.8],
  ["Kids' Casual Shorts","Kids","Shorts","Casual",350,"kidsShorts",4.7],
].map((p,i)=>({
  id:i+1,name:p[0],gender:p[1],category:p[2],style:p[3],price:p[4],
  images:IMG[p[5]],rating:p[6],
  note:`Stylish ${p[3].toLowerCase()} ${p[2].toLowerCase()} selected for everyday confidence and easy styling.`
}));

const money = n => `KSh ${Number(n).toLocaleString("en-KE")}`;

function SafeImage({images,alt,className=""}) {
  const [i,setI]=useState(0);
  const list=images?.length ? images : [IMG.menShirts[0]];
  return <img src={list[i]} alt={alt} loading="lazy"
    onError={()=>i<list.length-1 && setI(i+1)}
    className={className}/>;
}

function ImageSlider({product}) {
  const [i,setI]=useState(0);
  const imgs=product.images;
  return <div className="relative h-full bg-[#e8ddcb] overflow-hidden">
    <SafeImage images={[imgs[i]]} alt={product.name} className="w-full h-full object-cover"/>
    {imgs.length>1 && <>
      <button onClick={(e)=>{e.stopPropagation();setI((i-1+imgs.length)%imgs.length)}} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"><ChevronLeft size={17}/></button>
      <button onClick={(e)=>{e.stopPropagation();setI((i+1)%imgs.length)}} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"><ChevronRight size={17}/></button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {imgs.map((_,n)=><span key={n} className={`w-1.5 h-1.5 rounded-full ${n===i?"bg-white":"bg-white/50"}`}/>)}
      </div>
    </>}
  </div>
}

function Card({p,onAdd,onView}) {
  const [liked,setLiked]=useState(false);
  return <article className="group bg-white border border-[#1c2541]/10 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="relative h-72 cursor-pointer" onClick={()=>onView(p)}>
      <ImageSlider product={p}/>
      <span className="absolute top-3 left-3 bg-[#bc5b39] text-white text-[10px] uppercase tracking-wider px-2.5 py-1">{p.style}</span>
      <button onClick={e=>{e.stopPropagation();setLiked(!liked)}} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
        <Heart size={17} fill={liked?"#bc5b39":"none"} className={liked?"text-[#bc5b39]":"text-[#1c2541]"}/>
      </button>
    </div>
    <div className="p-4">
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#bc5b39]">
        <span>{p.gender} · {p.category}</span><span className="flex items-center gap-1"><Star size={11} fill="#e8a63d" className="text-[#e8a63d]"/>{p.rating}</span>
      </div>
      <h3 className="font-semibold text-lg text-[#1c2541] mt-2">{p.name}</h3>
      <p className="text-sm opacity-55 mt-1 h-10 overflow-hidden">{p.note}</p>
      <div className="flex items-center justify-between mt-4">
        <strong className="text-[#bc5b39] text-lg">{money(p.price)}</strong>
        <button onClick={()=>onAdd(p)} className="bg-[#1c2541] text-white px-4 py-2.5 rounded-lg text-xs uppercase flex items-center gap-1 hover:bg-[#bc5b39]"><Plus size={15}/> Add</button>
      </div>
    </div>
  </article>
}

function Modal({p,onClose,onAdd}) {
  if(!p)return null;
  return <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4">
    <div className="relative bg-[#f3e9da] rounded-2xl overflow-hidden max-w-4xl w-full max-h-[92vh] overflow-y-auto">
      <button onClick={onClose} className="absolute right-4 top-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow"><X size={19}/></button>
      <div className="grid md:grid-cols-2">
        <div className="h-[430px] md:h-[600px]"><ImageSlider product={p}/></div>
        <div className="p-7 md:p-10 flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-widest text-[#bc5b39]">{p.gender} · {p.category}</span>
          <h2 className="font-semibold text-3xl text-[#1c2541] mt-2">{p.name}</h2>
          <div className="flex items-center gap-1 mt-3"><Star size={15} fill="#e8a63d" className="text-[#e8a63d]"/>{p.rating}/5</div>
          <p className="opacity-65 leading-relaxed mt-5">{p.note}</p>
          <div className="text-3xl font-bold text-[#bc5b39] mt-6">{money(p.price)}</div>
          <button onClick={()=>{onAdd(p);onClose()}} className="mt-7 bg-[#1c2541] text-white py-4 rounded-xl flex items-center justify-center gap-2 uppercase hover:bg-[#bc5b39]"><ShoppingBag size={18}/> Add to Bag</button>
        </div>
      </div>
    </div>
  </div>
}

function Payment({total,cart}) {
  const [phone,setPhone]=useState("");
  const [method,setMethod]=useState("mpesa");
  const [msg,setMsg]=useState("");
  const pay=()=>{
    if(!cart.length)return setMsg("Add an item to your bag first.");
    if(!phone.trim())return setMsg("Enter your phone number.");
    if(method==="card") return setMsg("Card checkout is ready for the store owner to connect to their chosen payment gateway.");
    setMsg("M-Pesa checkout is ready for the store owner to connect to Daraja/STK Push securely.");
  };
  return <section id="payment" className="max-w-6xl mx-auto px-5 py-14">
    <div className="bg-[#1c2541] text-white rounded-2xl p-6 md:p-9 shadow-2xl">
      <div className="flex items-center gap-2 text-[#e8a63d] text-xs uppercase tracking-[.2em]"><CreditCard size={18}/> Secure checkout</div>
      <h2 className="font-semibold text-3xl mt-3">Choose how you'd like to pay</h2>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <button onClick={()=>setMethod("mpesa")} className={`p-4 border rounded-xl text-left ${method==="mpesa"?"border-[#e8a63d] bg-white/10":"border-white/15"}`}><b>M-Pesa</b><div className="text-xs opacity-60 mt-1">STK Push / mobile payment</div></button>
        <button onClick={()=>setMethod("card")} className={`p-4 border rounded-xl text-left ${method==="card"?"border-[#e8a63d] bg-white/10":"border-white/15"}`}><b>Card</b><div className="text-xs opacity-60 mt-1">Visa / Mastercard gateway</div></button>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <div><label className="text-xs opacity-60 block mb-2">{method==="mpesa"?"M-Pesa number":"Phone number"}</label>
          <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1c2541]"/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XXXXXXXX" className="w-full rounded-lg py-3 pl-10 text-[#1c2541] outline-none"/></div>
        </div>
        <div className="border border-white/15 rounded-lg p-4"><div className="text-xs opacity-55">Order total</div><div className="text-2xl font-bold text-[#e8a63d]">{money(total)}</div></div>
      </div>
      <button onClick={pay} disabled={!cart.length} className="w-full mt-5 bg-[#e8a63d] text-[#1c2541] font-bold py-4 rounded-xl disabled:opacity-40 hover:bg-[#f4bf6d]">PAY {money(total)}</button>
      {msg&&<div className="mt-4 p-4 bg-white/10 rounded-lg text-sm">{msg}</div>}
      <div className="flex gap-2 mt-5 text-xs opacity-60"><ShieldCheck size={18} className="text-[#e8a63d] shrink-0"/> Payment credentials must be kept on the secure server, never inside App.jsx.</div>
    </div>
  </section>
}

export default function Duka(){
  const [gender,setGender]=useState("All");
  const [category,setCategory]=useState("All");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState([]);
  const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState(null);

  const categories=useMemo(()=>{
    const list=products.filter(p=>gender==="All"||p.gender===gender).map(p=>p.category);
    return ["All",...new Set(list)];
  },[gender]);

  const shown=useMemo(()=>products.filter(p=>
    (gender==="All"||p.gender===gender)&&
    (category==="All"||p.category===category)&&
    p.name.toLowerCase().includes(search.toLowerCase())
  ),[gender,category,search]);

  const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
  const count=cart.reduce((s,p)=>s+p.qty,0);

  const add=p=>setCart(c=>{
    const found=c.find(x=>x.id===p.id);
    return found?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{...p,qty:1}];
  });
  const qty=(id,n)=>setCart(c=>c.map(x=>x.id===id?{...x,qty:x.qty+n}:x).filter(x=>x.qty>0));
  const pay=()=>{setOpen(false);setTimeout(()=>document.getElementById("payment")?.scrollIntoView({behavior:"smooth"}),100)};
  const whatsapp=()=>{
    const text=["Hi Duka la Style! I'd like to order:",...cart.map(x=>`• ${x.name} x${x.qty} — ${money(x.price*x.qty)}`),"",`Total: ${money(total)}`].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
  };

  return <div className="min-h-screen bg-[#f3e9da] text-[#2b2620]" style={{fontFamily:"'Work Sans',sans-serif"}}>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

    <header className="sticky top-0 z-50 bg-[#1c2541] text-[#f3e9da] shadow-lg">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className="text-left">
          <div className="text-2xl font-semibold">Duka <span className="text-[#e8a63d]">la Style</span></div>
          <div className="text-[9px] uppercase tracking-[.25em] text-white/50">Curated secondhand fashion</div>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})} className="hidden sm:flex px-4 py-2 text-xs border border-white/20">Shop</button>
          <button onClick={()=>setOpen(true)} className="relative flex items-center gap-2 border border-white/20 px-4 py-2 rounded-lg"><ShoppingBag size={18}/><span className="hidden sm:inline">My Bag</span>{count>0&&<b className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#e8a63d] text-[#1c2541] text-xs flex items-center justify-center">{count}</b>}</button>
        </div>
      </div>
    </header>

    <section className="max-w-6xl mx-auto px-5 pt-14 pb-10">
      <div className="grid md:grid-cols-[1.2fr_.8fr] gap-9 items-center">
        <div>
          <div className="flex items-center gap-2 text-[#bc5b39] text-xs uppercase tracking-[.2em]"><Sparkles size={16}/> Fresh styles · New finds</div>
          <h1 className="text-5xl sm:text-7xl font-semibold leading-[.92] text-[#1c2541] mt-5" style={{fontFamily:"Fraunces,serif"}}>Wear it.<br/><span className="text-[#bc5b39]">Love it.</span></h1>
          <p className="max-w-lg mt-6 opacity-65 leading-relaxed">Discover stylish secondhand fashion for men, women and children — carefully selected for great looks without the premium price.</p>
          <button onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})} className="mt-7 inline-flex items-center gap-2 bg-[#1c2541] text-white px-6 py-3.5 rounded-lg text-sm hover:bg-[#bc5b39]">Shop the collection <ArrowRight size={16}/></button>
        </div>
        <div className="hidden md:block h-[430px] rounded-2xl overflow-hidden shadow-xl"><ImageSlider product={{images:IMG.womenDresses,name:"Featured"}}/></div>
      </div>
    </section>

    <section id="shop" className="max-w-6xl mx-auto px-5">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-45"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clothes..." className="w-full bg-white border border-[#1c2541]/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-[#bc5b39]"/></div>
        <div className="flex items-center gap-2 text-xs opacity-55"><SlidersHorizontal size={16}/> Filter your style</div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3">
        {["All","Men","Women","Kids"].map(x=><button key={x} onClick={()=>{setGender(x);setCategory("All")}} className={`whitespace-nowrap px-5 py-3 rounded-lg text-xs uppercase tracking-wide border ${gender===x?"bg-[#1c2541] text-white border-[#1c2541]":"border-[#1c2541]/15 bg-white/40"}`}>{x}</button>)}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-7">
        {categories.map(x=><button key={x} onClick={()=>setCategory(x)} className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] uppercase tracking-wider border ${category===x?"bg-[#bc5b39] text-white border-[#bc5b39]":"border-[#1c2541]/15"}`}>{x}</button>)}
      </div>

      <div className="flex items-end justify-between mb-5">
        <div><div className="text-xs uppercase tracking-widest text-[#bc5b39]">Collection</div><h2 className="text-3xl text-[#1c2541] font-semibold" style={{fontFamily:"Fraunces,serif"}}>{category==="All"?(gender==="All"?"All styles":`${gender}'s collection`):category}</h2></div>
        <span className="text-xs opacity-50">{shown.length} pieces</span>
      </div>

      {shown.length===0?<div className="py-20 text-center opacity-60">No items found. Try another search or category.</div>:
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">{shown.map(p=><Card key={p.id} p={p} onAdd={add} onView={setSelected}/>)}</div>}
    </section>

    <Payment total={total} cart={cart}/>

    <section className="bg-[#e8ddcb]"><div className="max-w-6xl mx-auto px-5 py-14 flex flex-col md:flex-row justify-between gap-6 md:items-center">
      <div><div className="flex items-center gap-2 text-[#bc5b39] text-xs uppercase tracking-[.2em]"><MessageCircle size={17}/> Personal styling</div><h2 className="text-3xl text-[#1c2541] mt-2" style={{fontFamily:"Fraunces,serif"}}>Need help choosing?</h2><p className="text-sm opacity-60 mt-2">Message us and we'll help you find something within your style and budget.</p></div>
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Duka la Style! I'd like help choosing clothes.")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1c2541] text-white px-6 py-3 rounded-lg text-sm hover:bg-[#bc5b39]"><MessageCircle size={17}/> Chat on WhatsApp</a>
    </div></section>

    <footer className="bg-[#1c2541] text-white"><div className="max-w-6xl mx-auto px-5 py-10 flex justify-between gap-4"><div><div className="text-xl font-semibold">Duka <span className="text-[#e8a63d]">la Style</span></div><p className="text-xs text-white/40 mt-1">Curated secondhand fashion.</p></div><div className="text-xs text-white/40">© {new Date().getFullYear()} Duka la Style</div></div></footer>

    {selected&&<Modal p={selected} onClose={()=>setSelected(null)} onAdd={add}/>}

    {open&&<div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={()=>setOpen(false)}/>
      <aside className="relative w-full max-w-md bg-[#f3e9da] h-full flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[#1c2541]/10"><div><div className="text-xs uppercase tracking-widest text-[#bc5b39]">Shopping</div><h2 className="text-2xl text-[#1c2541]">Your Bag</h2></div><button onClick={()=>setOpen(false)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center"><X size={18}/></button></div>
        <div className="flex-1 overflow-y-auto p-5">{!cart.length?<div className="text-center py-20 opacity-60"><ShoppingBag size={40} className="mx-auto text-[#bc5b39]"/><h3 className="text-xl mt-4">Your bag is empty</h3><p className="text-sm mt-2">Find something you love and add it here.</p></div>:
          <div className="flex flex-col gap-4">{cart.map(item=><div key={item.id} className="flex gap-3 items-center bg-white/50 p-3 rounded-lg">
            <SafeImage images={item.images} alt={item.name} className="w-16 h-16 object-cover rounded"/>
            <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{item.name}</div><div className="text-xs opacity-50 mt-1">{money(item.price)}</div><div className="flex items-center mt-2 border border-[#1c2541]/20 w-fit rounded"><button onClick={()=>qty(item.id,-1)} className="p-1.5"><Minus size={12}/></button><span className="w-7 text-center text-xs">{item.qty}</span><button onClick={()=>qty(item.id,1)} className="p-1.5"><Plus size={12}/></button></div></div>
            <div className="font-semibold text-sm">{money(item.price*item.qty)}</div>
          </div>)}</div>}
        </div>
        <div className="border-t border-[#1c2541]/10 p-5"><div className="flex justify-between mb-4"><span className="text-sm opacity-60">Total</span><strong className="text-xl text-[#1c2541]">{money(total)}</strong></div><button onClick={pay} disabled={!cart.length} className="w-full bg-[#bc5b39] text-white py-3.5 rounded-lg uppercase text-sm disabled:opacity-40">Go to Payment</button><button onClick={whatsapp} disabled={!cart.length} className="w-full mt-2 bg-[#25d366] text-white py-3.5 rounded-lg uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-40"><MessageCircle size={17}/> Order via WhatsApp</button></div>
      </aside>
    </div>}
  </div>
}
