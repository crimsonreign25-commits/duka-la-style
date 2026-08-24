import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag, Search, X, Plus, Minus, Trash2, Edit3, LogIn, LogOut,
  Package, CreditCard, CheckCircle, RefreshCw, Upload, Menu, User, Phone,
  Copy, Gift, Sparkles, ChevronRight, Palette, MessageCircle, Heart,
  Crown, Shirt, Baby, BriefcaseBusiness, Tags, Star, SlidersHorizontal, Eye, EyeOff
} from "lucide-react";
import { supabase } from "./supabaseClient";

/* =========================================================
   BALEKING — PREMIUM STORE
   Existing Supabase tables expected:
   products, orders, order_items, referral_codes, referral_events
   Storage bucket expected: product-images
========================================================= */

const WHATSAPP_NUMBER = "254710574821";
const MPESA_NUMBER = "0710574821";

const REFERRAL_DISCOUNT_PERCENT = 5;
const REFERRAL_THRESHOLD = 3;

// Orders that stay unpaid beyond this period are automatically cancelled
// while the owner dashboard is active. Change this value to suit the store.
const UNPAID_ORDER_TIMEOUT_MINUTES = 30;

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  old_price: "",
  category: "Tops",
  style: "Casual",
  gender: "Unisex",
  age_group: "Adult",
  stock: "",
  image_url: "",
};

const PRODUCT_CATEGORIES = [
  "Tops", "Trousers", "Dresses", "Skirts", "Shorts",
  "Shoes", "Jackets", "Kids", "Accessories"
];

const THEMES = {
  midnight: {
    name: "Midnight Luxe",
    accent: "#c9a86a",
    accentSoft: "#f4ead8",
    hero: "from-[#08090d] via-[#151821] to-[#252018]",
    button: "bg-[#c9a86a] text-[#111]",
    label: "Gold & Obsidian",
  },
  royal: {
    name: "Royal Velvet",
    accent: "#8b5cf6",
    accentSoft: "#eee7ff",
    hero: "from-[#0d0717] via-[#24103f] to-[#13091e]",
    button: "bg-[#8b5cf6] text-white",
    label: "Purple & Black",
  },
  pearl: {
    name: "Pearl Atelier",
    accent: "#8a6b4b",
    accentSoft: "#f2e8dc",
    hero: "from-[#f7f2ea] via-[#efe4d4] to-[#d8c4ad]",
    button: "bg-[#201a16] text-white",
    label: "Warm Pearl",
  },
  emerald: {
    name: "Emerald Society",
    accent: "#0f9f75",
    accentSoft: "#dff8ef",
    hero: "from-[#03130f] via-[#063d30] to-[#071b17]",
    button: "bg-[#0f9f75] text-white",
    label: "Emerald & Onyx",
  },
};

function money(value) {
  return `KSh ${Number(value || 0).toLocaleString()}`;
}

const COUNTDOWN_UNIT_SECONDS = { seconds: 1, minutes: 60, hours: 3600 };

function secondsToBestUnit(totalSeconds) {
  if (totalSeconds > 0 && totalSeconds % 3600 === 0) {
    return { value: totalSeconds / 3600, unit: "hours" };
  }
  if (totalSeconds > 0 && totalSeconds % 60 === 0) {
    return { value: totalSeconds / 60, unit: "minutes" };
  }
  return { value: totalSeconds, unit: "seconds" };
}

function makeReferralCode(name) {
  const clean = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return `${clean || "BALEKING"}${Math.floor(1000 + Math.random() * 9000)}`;
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [referralCodes, setReferralCodes] = useState([]);
  const [ownerSection, setOwnerSection] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All");
  const [category, setCategory] = useState("All");

  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem("baleking-theme") || "midnight";
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [mpesaReceipt, setMpesaReceipt] = useState("");
  const [stkLoading, setStkLoading] = useState(false);
  const [stkSent, setStkSent] = useState(false);
  const [stkMessage, setStkMessage] = useState("");
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(60);
  const [paymentCountdownDuration, setPaymentCountdownDuration] = useState(60);
  const [countdownInput, setCountdownInput] = useState("");
  const [countdownUnit, setCountdownUnit] = useState("seconds");
  const [savingCountdown, setSavingCountdown] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [referralInfo, setReferralInfo] = useState(null);
  const [checkingReferral, setCheckingReferral] = useState(false);

  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerPasswordVisible, setOwnerPasswordVisible] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER);
  const [whatsappInput, setWhatsappInput] = useState("");
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [storeSettingsId, setStoreSettingsId] = useState(null);

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newReferralName, setNewReferralName] = useState("");
  const [creatingReferral, setCreatingReferral] = useState(false);

  const theme = THEMES[themeKey];

  useEffect(() => {
    localStorage.setItem("baleking-theme", themeKey);
  }, [themeKey]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Could not load products.");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items (*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const now = Date.now();
    const timeoutMs = UNPAID_ORDER_TIMEOUT_MINUTES * 60 * 1000;
    const stalePending = (data || []).filter((order) =>
      order.payment_status === "pending" &&
      order.order_status !== "cancelled" &&
      order.created_at &&
      now - new Date(order.created_at).getTime() >= timeoutMs
    );

    if (stalePending.length) {
      await Promise.all(
        stalePending.map((order) =>
          supabase
            .from("orders")
            .update({ order_status: "cancelled" })
            .eq("id", order.id)
            .eq("payment_status", "pending")
        )
      );

      stalePending.forEach((order) => {
        order.order_status = "cancelled";
      });
    }

    setOrders(data || []);
  }

  async function loadReferralData() {
    const { data, error } = await supabase
      .from("referral_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setReferralCodes(data || []);
  }

  async function loadStoreSettings() {
    const { data, error } = await supabase
      .from("store_settings")
      .select("id, whatsapp_number, payment_countdown_seconds")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setStoreSettingsId(data.id);
      if (data.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number);
        setWhatsappInput(data.whatsapp_number);
      }
      if (data.payment_countdown_seconds) {
        setPaymentCountdownDuration(data.payment_countdown_seconds);
        const best = secondsToBestUnit(data.payment_countdown_seconds);
        setCountdownInput(String(best.value));
        setCountdownUnit(best.unit);
      }
    }
  }

  async function saveWhatsappNumber() {
    const cleaned = whatsappInput.trim().replace(/[^0-9]/g, "");
    if (!cleaned) return setMessage("Enter a valid WhatsApp number.");
    if (!storeSettingsId) return setMessage("Store settings not loaded yet.");

    setSavingWhatsapp(true);

    const { error } = await supabase
      .from("store_settings")
      .update({ whatsapp_number: cleaned, updated_at: new Date().toISOString() })
      .eq("id", storeSettingsId);

    if (error) {
      setMessage(error.message);
    } else {
      setWhatsappNumber(cleaned);
      setWhatsappInput(cleaned);
      setMessage("WhatsApp number updated.");
    }

    setSavingWhatsapp(false);
  }

  async function saveCountdownDuration() {
    const rawValue = parseFloat(countdownInput);
    if (!rawValue || rawValue <= 0) {
      return setMessage("Enter a duration greater than 0.");
    }

    const seconds = Math.round(rawValue * COUNTDOWN_UNIT_SECONDS[countdownUnit]);

    if (seconds < 5 || seconds > 21600) {
      return setMessage("Duration must be between 5 seconds and 6 hours.");
    }
    if (!storeSettingsId) return setMessage("Store settings not loaded yet.");

    setSavingCountdown(true);

    const { error } = await supabase
      .from("store_settings")
      .update({ payment_countdown_seconds: seconds, updated_at: new Date().toISOString() })
      .eq("id", storeSettingsId);

    if (error) {
      setMessage(error.message);
    } else {
      setPaymentCountdownDuration(seconds);
      setMessage("Payment confirmation duration updated.");
    }

    setSavingCountdown(false);
  }

  async function checkOwner() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setOwnerLoggedIn(true);
      await Promise.all([loadOrders(), loadReferralData()]);
    }
  }

  useEffect(() => {
    loadProducts();
    loadStoreSettings();
    checkOwner();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const loggedIn = !!session;
        setOwnerLoggedIn(loggedIn);

        if (loggedIn) {
          await Promise.all([loadOrders(), loadReferralData()]);
        } else {
          setOrders([]);
          setReferralCodes([]);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ownerLoggedIn) return;
    const timer = setInterval(loadOrders, 60 * 1000);
    return () => clearInterval(timer);
  }, [ownerLoggedIn]);

  useEffect(() => {
    if (!showPaymentConfirmation) return;
    if (paymentCountdown <= 0) {
      setShowPaymentConfirmation(false);
      return;
    }
    const timer = setTimeout(() => setPaymentCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showPaymentConfirmation, paymentCountdown]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        [product.name, product.description, product.category, product.gender,
         product.age_group, product.style]
          .some((v) => String(v || "").toLowerCase().includes(term));

      const matchesGender =
        genderFilter === "All" ||
        String(product.gender || "").toLowerCase() === genderFilter.toLowerCase();

      const matchesAge =
        ageFilter === "All" ||
        String(product.age_group || "").toLowerCase() === ageFilter.toLowerCase();

      const matchesStyle =
        styleFilter === "All" ||
        String(product.style || "").toLowerCase() === styleFilter.toLowerCase();

      const matchesCategory =
        category === "All" ||
        String(product.category || "").toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesGender && matchesAge && matchesStyle && matchesCategory;
    });
  }, [products, search, genderFilter, ageFilter, styleFilter, category]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity, 0
  );

  const referralDiscount =
    referralInfo?.qualifies
      ? Number((cartSubtotal * (REFERRAL_DISCOUNT_PERCENT / 100)).toFixed(2))
      : 0;

  const finalTotal = Math.max(0, cartSubtotal - referralDiscount);

  function chooseGender(value) {
    setGenderFilter(value);
    setAgeFilter("All");
    setCategory("All");
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseStyle(value) {
    setStyleFilter(value);
    setGenderFilter("All");
    setCategory("All");
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  }

  function resetFilters() {
    setGenderFilter("All");
    setAgeFilter("All");
    setStyleFilter("All");
    setCategory("All");
    setSearch("");
  }

  function addToCart(product) {
    if (Number(product.stock) <= 0) {
      setMessage("This item is currently sold out.");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          setMessage("You've reached the available stock.");
          return current;
        }
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function increaseCart(id) {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (item.quantity >= Number(item.stock)) {
          setMessage("Maximum available stock reached.");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  }

  function decreaseCart(id) {
    setCart((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function openCheckout() {
    if (!cart.length) {
      setMessage("Your cart is empty.");
      return;
    }
    setCustomerOpen(true);
  }

  async function checkReferralCode() {
    const code = referralCodeInput.trim().toUpperCase();
    if (!code) {
      setReferralInfo(null);
      setMessage("Enter a referral code first.");
      return;
    }

    setCheckingReferral(true);

    try {
      const { data: referral, error } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;
      if (!referral) throw new Error("Invalid or inactive referral code.");

      const { count, error: countError } = await supabase
        .from("referral_events")
        .select("*", { count: "exact", head: true })
        .eq("referral_code", referral.code);

      if (countError) throw countError;

      const successfulReferrals = Number(count || 0);
      const qualifies = successfulReferrals >= REFERRAL_THRESHOLD;

      setReferralInfo({ ...referral, successfulReferrals, qualifies });

      setMessage(
        qualifies
          ? `${REFERRAL_DISCOUNT_PERCENT}% referral discount applied.`
          : `Code accepted. ${Math.max(0, REFERRAL_THRESHOLD - successfulReferrals)} more successful referral(s) needed.`
      );
    } catch (error) {
      console.error(error);
      setReferralInfo(null);
      setMessage(error.message || "Could not verify referral code.");
    } finally {
      setCheckingReferral(false);
    }
  }

  async function startMpesaPayment() {
    if (!customerName.trim()) return setMessage("Please enter your name first.");
    if (!customerPhone.trim()) return setMessage("Please enter your M-Pesa phone number.");
    if (!cart.length) return setMessage("Your cart is empty.");

    setStkLoading(true);
    setStkMessage("");

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customerPhone.trim(), amount: finalTotal }),
      });

      const raw = await response.text();
      let data = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        const looksLikeHtml = /<!doctype html|<html/i.test(raw);
        throw new Error(
          looksLikeHtml
            ? `M-Pesa server returned an HTML error page (HTTP ${response.status}). Redeploy the API and make sure /api/mpesa/stkpush is deployed.`
            : `M-Pesa server returned an invalid response (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.errorMessage ||
          data.ResponseDescription ||
          "Could not start M-Pesa payment."
        );
      }

      if (data.ResponseCode && String(data.ResponseCode) !== "0") {
        throw new Error(data.ResponseDescription || "M-Pesa STK Push was not accepted.");
      }

      setStkSent(true);
      setStkMessage(data.CustomerMessage || data.ResponseDescription || "M-Pesa payment request sent. Check your phone and enter your M-Pesa PIN.");
      setMessage("M-Pesa payment prompt sent to your phone.");
      setPaymentCountdown(paymentCountdownDuration);
      setShowPaymentConfirmation(true);
    } catch (error) {
      console.error(error);
      setStkSent(false);
      setStkMessage("");
      setMessage(error.message || "Could not start M-Pesa payment.");
    } finally {
      setStkLoading(false);
    }
  }

  async function placeOrder() {
    if (!customerName.trim()) return setMessage("Please enter your name.");
    if (!customerPhone.trim()) return setMessage("Please enter your phone number.");
    if (!stkSent) return setMessage("Please tap Pay with M-Pesa first.");
    if (!mpesaReceipt.trim()) return setMessage("Enter the M-Pesa receipt after completing the payment.");
    if (!cart.length) return setMessage("Your cart is empty.");

    setOwnerLoading(true);

    try {
      let verifiedReferral = null;
      let verifiedDiscount = 0;

      if (referralCodeInput.trim()) {
        const code = referralCodeInput.trim().toUpperCase();

        const { data: referral, error } = await supabase
          .from("referral_codes")
          .select("*")
          .eq("code", code)
          .eq("active", true)
          .maybeSingle();

        if (error) throw error;
        if (!referral) throw new Error("The referral code is invalid.");

        const { count, error: countError } = await supabase
          .from("referral_events")
          .select("*", { count: "exact", head: true })
          .eq("referral_code", referral.code);

        if (countError) throw countError;

        const qualifies = Number(count || 0) >= REFERRAL_THRESHOLD;
        verifiedReferral = referral;

        if (qualifies) {
          verifiedDiscount = Number(
            (cartSubtotal * REFERRAL_DISCOUNT_PERCENT / 100).toFixed(2)
          );
        }
      }

      const orderTotal = Math.max(0, cartSubtotal - verifiedDiscount);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          total: orderTotal,
          payment_status: "pending",
          order_status: "new",
          mpesa_receipt: mpesaReceipt.trim(),
          referred_by: verifiedReferral?.owner_name || null,
          referral_code: verifiedReferral?.code || null,
          referral_discount: verifiedDiscount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(items);

      if (itemError) throw itemError;

      if (verifiedReferral) {
        await supabase.from("referral_events").insert({
          referrer_name: verifiedReferral.owner_name,
          referred_customer_name: customerName.trim(),
          referred_customer_phone: customerPhone.trim(),
          order_id: order.id,
          referral_code: verifiedReferral.code,
          discount_awarded: verifiedDiscount,
        });

        await supabase
          .from("referral_codes")
          .update({
            total_referrals: Number(verifiedReferral.total_referrals || 0) + 1,
            total_discount_awarded:
              Number(verifiedReferral.total_discount_awarded || 0) + verifiedDiscount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", verifiedReferral.id);
      }

      const whatsappMessage = [
        "Hello Baleking 👋",
        "",
        `Order ID: ${order.id}`,
        `Customer: ${customerName.trim()}`,
        `Phone: ${customerPhone.trim()}`,
        "",
        "ORDER:",
        ...cart.map(
          (item) => `${item.name} x${item.quantity} = ${money(Number(item.price) * item.quantity)}`
        ),
        "",
        `SUBTOTAL: ${money(cartSubtotal)}`,
        `REFERRAL DISCOUNT: ${verifiedDiscount ? "-" + money(verifiedDiscount) : "KSh 0"}`,
        `TOTAL TO PAY: ${money(orderTotal)}`,
        `M-Pesa Receipt: ${mpesaReceipt.trim()}`,
        verifiedReferral ? `Referral Code: ${verifiedReferral.code}` : "Referral Code: None",
        "",
        "Please confirm my order.",
      ].join("\n");

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      setCart([]);
      setCartOpen(false);
      setCustomerOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setMpesaReceipt("");
      setStkSent(false);
      setStkMessage("");
      setReferralCodeInput("");
      setReferralInfo(null);

      setMessage("Order placed successfully. Opening WhatsApp...");
      window.open(whatsappUrl, "_blank");

      if (ownerLoggedIn) await Promise.all([loadOrders(), loadReferralData()]);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not place the order.");
    } finally {
      setOwnerLoading(false);
    }
  }

  async function ownerLogin() {
    if (!ownerEmail || !ownerPassword) {
      setMessage("Enter your email and password.");
      return;
    }

    setOwnerLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: ownerEmail,
      password: ownerPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setOwnerEmail("");
      setOwnerPassword("");
      setShowOwnerPassword(false);
      setOwnerOpen(false);
      setMessage("Owner login successful.");
    }

    setOwnerLoading(false);
  }

  async function ownerLogout() {
    await supabase.auth.signOut();
    setOwnerLoggedIn(false);
    setOrders([]);
    setReferralCodes([]);
  }

  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setProductFormOpen(true);
  }

  function openEditProduct(product) {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      old_price: product.old_price ?? "",
      category: product.category || "Tops",
      style: product.style || "Casual",
      gender: product.gender || "Unisex",
      age_group: product.age_group || "Adult",
      stock: product.stock ?? "",
      image_url: product.image_url || "",
    });
    setProductFormOpen(true);
  }

  function updateProductForm(field, value) {
    setProductForm((current) => ({ ...current, [field]: value }));
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ownerLoggedIn) {
      setMessage("Owner login required.");
      return;
    }

    setUploadingImage(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `products/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      updateProductForm("image_url", data.publicUrl);
      setMessage("Image uploaded.");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();

    if (!ownerLoggedIn) return setMessage("Owner login required.");
    if (!productForm.name.trim()) return setMessage("Product name is required.");
    if (!productForm.price) return setMessage("Product price is required.");

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      price: Number(productForm.price),
      old_price: productForm.old_price ? Number(productForm.old_price) : null,
      category: productForm.category,
      style: productForm.style,
      gender: productForm.gender,
      age_group: productForm.age_group,
      stock: Number(productForm.stock || 0),
      image_url: productForm.image_url || null,
      updated_at: new Date().toISOString(),
    };

    setOwnerLoading(true);

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
        setMessage("Product updated.");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        setMessage("Product added.");
      }

      setProductFormOpen(false);
      setEditingProduct(null);
      setProductForm(EMPTY_PRODUCT);
      await loadProducts();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not save product.");
    } finally {
      setOwnerLoading(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) return setMessage(error.message);

    setMessage("Product deleted.");
    await loadProducts();
  }

  async function updateOrder(orderId, field, value) {
    const { error } = await supabase
      .from("orders")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) return setMessage(error.message);

    setMessage("Order updated.");
    await loadOrders();
  }

  async function acceptPayment(order) {
    if (!ownerLoggedIn) return setMessage("Owner login required.");
    if (!order.mpesa_receipt) return setMessage("This payment has no M-Pesa receipt to verify.");

    setOwnerLoading(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: order.order_status === "new" ? "confirmed" : order.order_status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) throw error;
      setMessage(`Payment for order #${order.id.slice(0, 8)} accepted.`);
      await loadOrders();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not accept payment.");
    } finally {
      setOwnerLoading(false);
    }
  }

  async function rejectPayment(order) {
    if (!ownerLoggedIn) return setMessage("Owner login required.");
    if (!window.confirm(`Reject payment for order #${order.id.slice(0, 8)}?`)) return;

    setOwnerLoading(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          order_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) throw error;
      setMessage(`Payment for order #${order.id.slice(0, 8)} rejected.`);
      await loadOrders();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not reject payment.");
    } finally {
      setOwnerLoading(false);
    }
  }

  async function createReferralCode() {
    if (!newReferralName.trim()) {
      setMessage("Enter the referrer's name.");
      return;
    }

    setCreatingReferral(true);

    try {
      const { data, error } = await supabase
        .from("referral_codes")
        .insert({
          code: makeReferralCode(newReferralName),
          owner_name: newReferralName.trim(),
          total_referrals: 0,
          total_discount_awarded: 0,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setReferralCodes((current) => [data, ...current]);
      setNewReferralName("");
      setMessage(`Referral code ${data.code} created.`);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not create referral code.");
    } finally {
      setCreatingReferral(false);
    }
  }

  async function toggleReferralCode(referral) {
    const { error } = await supabase
      .from("referral_codes")
      .update({
        active: !referral.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referral.id);

    if (error) return setMessage(error.message);

    await loadReferralData();
    setMessage(referral.active ? "Referral deactivated." : "Referral activated.");
  }

  async function copyReferralCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Referral code copied.");
    } catch {
      setMessage(`Referral code: ${code}`);
    }
  }

  const activeFilter =
    genderFilter !== "All" || ageFilter !== "All" ||
    styleFilter !== "All" || category !== "All" || search;

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#161616]">
      {/* TOP ANNOUNCEMENT */}
      <div
        className="px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em]"
        style={{ background: theme.accent, color: themeKey === "pearl" ? "#fff" : "#111" }}
      >
        Complimentary style. Elevated everyday.
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button
            onClick={resetFilters}
            className="group flex items-center gap-3 text-left"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: theme.accent }}
            >
              <Crown size={21} />
            </div>
            <div>
              <div className="text-xl font-black tracking-[-0.04em]">BALEKING</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-black/45">
                Where style meets elegance
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {[
              ["Male", "gender", Shirt],
              ["Female", "gender", Sparkles],
              ["Children", "age", Baby],
              ["Casual", "style", Tags],
              ["Official", "style", BriefcaseBusiness],
              ["Streetwear", "style", Shirt],
            ].map(([label, type, Icon]) => (
              <button
                key={label}
                onClick={() =>
                  type === "gender"
                    ? chooseGender(label === "Male" ? "Male" : "Female")
                    : type === "age"
                    ? setAgeFilter("Children")
                    : chooseStyle(label === "Official" ? "Formal" : label)
                }
                className="rounded-full px-4 py-2 text-xs font-black transition hover:bg-black hover:text-white"
              >
                <Icon size={14} className="mr-1 inline" />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setThemeOpen(true)}
              className="hidden rounded-full border border-black/10 p-3 sm:block"
              title="Change theme"
            >
              <Palette size={17} />
            </button>

            <button
              onClick={() => setOwnerOpen(true)}
              className="hidden rounded-full border border-black/10 px-4 py-2 text-xs font-black md:block"
            >
              Owner
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full px-4 py-3 text-xs font-black text-white shadow-lg"
              style={{ background: "#111" }}
            >
              <ShoppingBag size={16} className="mr-1 inline" />
              Cart
              {cartCount > 0 && (
                <span
                  className="ml-1 rounded-full px-2 py-0.5"
                  style={{ background: theme.accent, color: "#111" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenu((v) => !v)}
              className="rounded-full border border-black/10 p-3 lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-black/5 bg-white p-4 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Male", () => chooseGender("Male")],
                ["Female", () => chooseGender("Female")],
                ["Children", () => setAgeFilter("Children")],
                ["Casual", () => chooseStyle("Casual")],
                ["Official", () => chooseStyle("Formal")],
                ["Streetwear", () => chooseStyle("Streetwear")],
              ].map(([label, fn]) => (
                <button
                  key={label}
                  onClick={() => { fn(); setMobileMenu(false); }}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-left text-sm font-black"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => { setThemeOpen(true); setMobileMenu(false); }}
                className="rounded-2xl bg-black px-4 py-3 text-sm font-black text-white"
              >
                <Palette size={16} className="mr-2 inline" />
                Themes
              </button>
              <button
                onClick={() => { setOwnerOpen(true); setMobileMenu(false); }}
                className="rounded-2xl border px-4 py-3 text-sm font-black"
              >
                Owner
              </button>
            </div>
          </div>
        )}
      </header>

      {/* TOAST */}
      {message && (
        <div className="fixed bottom-5 left-1/2 z-[200] flex max-w-[92%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#111] px-5 py-3 text-sm font-bold text-white shadow-2xl">
          <CheckCircle size={18} style={{ color: theme.accent }} />
          <span>{message}</span>
          <button onClick={() => setMessage("")}><X size={16} /></button>
        </div>
      )}

      {/* HERO */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.hero} text-white`}>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-28">
          <div>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em]"
            >
              <Sparkles size={13} />
              {theme.name}
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[.94] tracking-[-0.055em] sm:text-7xl">
              Style that makes an entrance.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Discover curated fashion for men, women and children —
              from effortless casual pieces to polished official looks
              and statement streetwear.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full px-7 py-4 text-sm font-black shadow-xl transition hover:-translate-y-1"
                style={{ background: theme.accent, color: "#111" }}
              >
                Explore collection <ChevronRight size={17} className="ml-1 inline" />
              </button>
              <button
                onClick={() => setThemeOpen(true)}
                className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-black backdrop-blur"
              >
                <Palette size={16} className="mr-2 inline" />
                Change atmosphere
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-xs font-bold text-white/50">
              <span>✓ Curated styles</span>
              <span>✓ M-Pesa checkout</span>
              <span>✓ WhatsApp ordering</span>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
              <div className="grid aspect-[4/5] grid-cols-2 gap-3 overflow-hidden rounded-[1.5rem]">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="relative overflow-hidden bg-white/10">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20">
                        <Shirt size={55} />
                      </div>
                    )}
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center text-center text-white/40">
                    <div>
                      <Crown size={45} className="mx-auto mb-3" />
                      <div className="font-black">Your collection starts here.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="absolute -bottom-5 -left-5 rounded-2xl px-5 py-4 shadow-2xl"
              style={{ background: theme.accent, color: "#111" }}
            >
              <div className="text-[9px] font-black uppercase tracking-[.2em]">The Baleking edit</div>
              <div className="mt-1 text-lg font-black">Dress your moment.</div>
            </div>
          </div>
        </div>
      </section>

      {/* STYLE / AUDIENCE HUB */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>
              Shop your way
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Find your world.</h2>
          </div>
          <button onClick={resetFilters} className="hidden rounded-full border px-4 py-2 text-xs font-black sm:block">
            View everything
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "For Him", sub: "Sharp. Refined. Effortless.", action: () => chooseGender("Male"), icon: Shirt },
            { title: "For Her", sub: "Elegant. Confident. Expressive.", action: () => chooseGender("Female"), icon: Sparkles },
            { title: "For Kids", sub: "Playful. Comfortable. Cool.", action: () => { setAgeFilter("Children"); setGenderFilter("All"); setStyleFilter("All"); setCategory("All"); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }, icon: Baby },
          ].map(({ title, sub, action, icon: Icon }) => (
            <button
              key={title}
              onClick={action}
              className="group relative overflow-hidden rounded-[2rem] bg-[#171717] p-7 text-left text-white shadow-xl transition hover:-translate-y-1"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10" />
              <Icon size={27} style={{ color: theme.accent }} />
              <div className="mt-10 text-2xl font-black">{title}</div>
              <div className="mt-1 text-sm text-white/50">{sub}</div>
              <div className="mt-6 text-xs font-black uppercase tracking-wider" style={{ color: theme.accent }}>
                Shop now <ChevronRight size={14} className="ml-1 inline transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["Casual", "Relaxed everyday essentials", "Casual"],
            ["Official", "Polished looks for important moments", "Formal"],
            ["Streetwear", "Bold energy. Modern attitude.", "Streetwear"],
          ].map(([title, sub, value]) => (
            <button
              key={title}
              onClick={() => chooseStyle(value)}
              className="rounded-[2rem] border border-black/5 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-black">{title}</div>
                <ChevronRight size={18} />
              </div>
              <div className="mt-2 text-sm text-black/45">{sub}</div>
            </button>
          ))}
        </div>
      </section>

      {/* COLLECTION */}
      <main id="collection" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>
                The collection
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Pieces worth coming back for.</h2>
              <p className="mt-1 text-sm text-black/45">{filteredProducts.length} pieces available right now.</p>
            </div>

            <div className="flex w-full max-w-lg items-center rounded-2xl border border-black/10 bg-[#fafafa] px-4">
              <Search size={18} className="text-black/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search styles, pieces, categories..."
                className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["All", ...PRODUCT_CATEGORIES].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className="rounded-full px-4 py-2 text-xs font-black transition"
                style={
                  category === item
                    ? { background: "#111", color: "#fff" }
                    : { background: "#f4f3f0", color: "#555" }
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {["All", "Male", "Female", "Unisex"].map((item) => (
              <button
                key={item}
                onClick={() => setGenderFilter(item)}
                className="rounded-full border px-3 py-1.5 text-[11px] font-black"
                style={genderFilter === item ? { borderColor: theme.accent, background: theme.accentSoft } : {}}
              >
                {item}
              </button>
            ))}
            {["All", "Adult", "Teen", "Children", "Baby"].map((item) => (
              <button
                key={item}
                onClick={() => setAgeFilter(item)}
                className="rounded-full border px-3 py-1.5 text-[11px] font-black"
                style={ageFilter === item ? { borderColor: theme.accent, background: theme.accentSoft } : {}}
              >
                {item}
              </button>
            ))}
            {["All", "Casual", "Formal", "Streetwear", "Sport", "Traditional", "Smart Casual"].map((item) => (
              <button
                key={item}
                onClick={() => setStyleFilter(item)}
                className="rounded-full border px-3 py-1.5 text-[11px] font-black"
                style={styleFilter === item ? { borderColor: theme.accent, background: theme.accentSoft } : {}}
              >
                {item === "Formal" ? "Official" : item}
              </button>
            ))}
            {activeFilter && (
              <button onClick={resetFilters} className="rounded-full bg-black px-3 py-1.5 text-[11px] font-black text-white">
                <SlidersHorizontal size={12} className="mr-1 inline" /> Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <RefreshCw className="animate-spin" size={30} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <Package size={50} className="mx-auto mb-4 text-black/10" />
              <h3 className="text-xl font-black">Nothing here yet.</h3>
              <p className="mt-2 text-sm text-black/40">Try another filter or check back for new drops.</p>
              <button onClick={resetFilters} className="mt-5 rounded-full bg-black px-5 py-3 text-xs font-black text-white">
                Show all products
              </button>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#fafafa] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e7e2]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-black/10">
                        <Shirt size={55} />
                      </div>
                    )}

                    {product.old_price && Number(product.old_price) > Number(product.price) && (
                      <span
                        className="absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-black uppercase"
                        style={{ background: theme.accent, color: "#111" }}
                      >
                        Private sale
                      </span>
                    )}

                    {Number(product.stock) <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                        <span className="rounded-full bg-white px-4 py-2 text-xs font-black">SOLD OUT</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="text-[9px] font-black uppercase tracking-wider text-black/35">
                      {product.gender || "Unisex"} · {product.age_group || "Adult"}
                    </div>
                    <h3 className="mt-1 truncate text-sm font-black">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 min-h-[34px] text-[11px] leading-5 text-black/40">
                      {product.description || "Quality fashion from Baleking."}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div>
                        <div className="text-sm font-black">{money(product.price)}</div>
                        {product.old_price && Number(product.old_price) > Number(product.price) && (
                          <div className="text-[10px] text-black/30 line-through">{money(product.old_price)}</div>
                        )}
                      </div>
                      <button
                        disabled={Number(product.stock) <= 0}
                        onClick={() => addToCart(product)}
                        className="rounded-xl px-3 py-2 text-[10px] font-black transition hover:scale-105 disabled:opacity-30"
                        style={{ background: "#111", color: "#fff" }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* OWNER DASHBOARD */}
      {ownerLoggedIn && (
        <section className="border-t bg-white px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>
                  Private area
                </div>
                <h2 className="mt-2 text-3xl font-black">Baleking Command Center</h2>
                <p className="mt-1 text-sm text-black/40">Manage products, orders, referrals and your store atmosphere.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setThemeOpen(true)} className="rounded-xl border px-4 py-3 text-xs font-black">
                  <Palette size={15} className="mr-1 inline" /> Theme
                </button>
                <button onClick={openAddProduct} className="rounded-xl bg-black px-4 py-3 text-xs font-black text-white">
                  <Plus size={15} className="mr-1 inline" /> Add Product
                </button>
                <button onClick={ownerLogout} className="rounded-xl border px-4 py-3 text-xs font-black">
                  <LogOut size={15} className="mr-1 inline" /> Logout
                </button>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2 rounded-2xl bg-[#f7f6f3] p-2">
              {[
                ["overview", "Overview"],
                ["orders", "Orders"],
                ["payments", "Payments"],
                ["products", "Products"],
                ["referrals", "Referrals"],
                ["settings", "Settings"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setOwnerSection(key)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${ownerSection === key ? "bg-black text-white" : "bg-white text-black/60"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {ownerSection === "overview" && (
              <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-[#f7f6f3] p-5"><div className="text-xs font-black uppercase tracking-wider text-black/40">Products</div><div className="mt-2 text-3xl font-black">{products.length}</div></div>
                <div className="rounded-2xl bg-[#f7f6f3] p-5"><div className="text-xs font-black uppercase tracking-wider text-black/40">Orders</div><div className="mt-2 text-3xl font-black">{orders.length}</div></div>
                <div className="rounded-2xl bg-[#f7f6f3] p-5"><div className="text-xs font-black uppercase tracking-wider text-black/40">Paid</div><div className="mt-2 text-3xl font-black">{orders.filter((o) => o.payment_status === "paid").length}</div></div>
                <div className="rounded-2xl bg-[#f7f6f3] p-5"><div className="text-xs font-black uppercase tracking-wider text-black/40">Pending payment</div><div className="mt-2 text-3xl font-black">{orders.filter((o) => o.payment_status === "pending" && o.order_status !== "cancelled").length}</div></div>
              </div>
            )}

            {(ownerSection === "overview" || ownerSection === "products") && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-black/5">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="font-black">Products</h3>
                  <p className="text-xs text-black/40">Add, edit or remove inventory.</p>
                </div>
                <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black text-white">{products.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-[#fafafa] text-[10px] uppercase tracking-wider text-black/40">
                    <tr>
                      <th className="p-4">Product</th><th className="p-4">Style</th><th className="p-4">Price</th>
                      <th className="p-4">Stock</th><th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-black/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? <img src={product.image_url} alt="" className="h-11 w-11 rounded-xl object-cover" /> : <div className="h-11 w-11 rounded-xl bg-black/5" />}
                            <div><div className="font-black">{product.name}</div><div className="text-xs text-black/40">{product.gender} · {product.age_group}</div></div>
                          </div>
                        </td>
                        <td className="p-4">{product.style === "Formal" ? "Official" : product.style}</td>
                        <td className="p-4 font-black">{money(product.price)}</td>
                        <td className="p-4">{product.stock}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditProduct(product)} className="rounded-lg border p-2"><Edit3 size={15} /></button>
                            <button onClick={() => deleteProduct(product)} className="rounded-lg border p-2 text-red-600"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {(ownerSection === "overview" || ownerSection === "referrals") && (
            <div className="mb-12">
              <div className="mb-4">
                <h3 className="text-xl font-black">Referral Program</h3>
                <p className="text-sm text-black/40">Customers unlock {REFERRAL_DISCOUNT_PERCENT}% off after {REFERRAL_THRESHOLD} successful referrals.</p>
              </div>

              <div className="mb-5 flex flex-col gap-2 rounded-2xl bg-[#f7f6f3] p-4 sm:flex-row">
                <input
                  value={newReferralName}
                  onChange={(e) => setNewReferralName(e.target.value)}
                  placeholder="Referrer's name"
                  className="flex-1 rounded-xl border bg-white px-4 py-3 text-sm outline-none"
                />
                <button onClick={createReferralCode} disabled={creatingReferral} className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white">
                  <Gift size={16} className="mr-2 inline" /> {creatingReferral ? "Creating..." : "Create Code"}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {referralCodes.map((referral) => {
                  const progress = Math.min(REFERRAL_THRESHOLD, Number(referral.total_referrals || 0));
                  return (
                    <div key={referral.id} className="rounded-2xl bg-[#f7f6f3] p-5">
                      <div className="flex justify-between gap-3">
                        <div><div className="font-black">{referral.owner_name}</div><div className="mt-1 text-lg font-black tracking-wider">{referral.code}</div></div>
                        <button onClick={() => toggleReferralCode(referral)} className="h-fit rounded-full bg-white px-3 py-1 text-[10px] font-black">
                          {referral.active ? "Active" : "Inactive"}
                        </button>
                      </div>
                      <button onClick={() => copyReferralCode(referral.code)} className="mt-3 rounded-xl border bg-white px-3 py-2 text-xs font-black"><Copy size={14} className="mr-1 inline" /> Copy</button>
                      <div className="mt-4 flex justify-between text-xs font-bold"><span>Successful referrals</span><span>{referral.total_referrals || 0}</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full" style={{ width: `${progress / REFERRAL_THRESHOLD * 100}%`, background: theme.accent }} /></div>
                      <div className="mt-2 text-[11px] text-black/40">{Math.max(0, REFERRAL_THRESHOLD - Number(referral.total_referrals || 0))} more needed for discount.</div>
                      <div className="mt-4 text-xs text-black/50">Discounts awarded: <strong className="text-black">{money(referral.total_discount_awarded)}</strong></div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {(ownerSection === "overview" || ownerSection === "orders") && (
            <div>
              <div className="mb-4 flex items-end justify-between">
                <div><h3 className="text-xl font-black">Customer Orders</h3><p className="text-sm text-black/40">Verify payments and move orders through the pipeline.</p></div>
                <button onClick={loadOrders} className="rounded-xl border px-3 py-2 text-xs font-black"><RefreshCw size={14} className="mr-1 inline" /> Refresh</button>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-2xl bg-[#f7f6f3] p-10 text-center text-sm text-black/40">No orders yet.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-[#f7f6f3] p-5">
                      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="font-black">Order #{order.id.slice(0, 8)}</span>
                            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black">{order.order_status}</span>
                            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black">Payment: {order.payment_status}</span>
                          </div>
                          <div className="mt-4 space-y-1 text-sm">
                            <div><User size={14} className="mr-1 inline" /> {order.customer_name}</div>
                            <div><Phone size={14} className="mr-1 inline" /> {order.customer_phone}</div>
                            <div className="font-black">Total: {money(order.total)}</div>
                            <div>M-Pesa receipt: <strong>{order.mpesa_receipt || "Not provided"}</strong></div>
                            {order.referral_code && <div>Referral: <strong>{order.referral_code}</strong></div>}
                          </div>
                          <div className="mt-4">
                            <div className="mb-2 text-[10px] font-black uppercase tracking-wider text-black/35">Items</div>
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="text-sm">{item.product_name} × {item.quantity} — {money(Number(item.price) * item.quantity)}</div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-black/40">Payment</label>
                          <select value={order.payment_status} onChange={(e) => updateOrder(order.id, "payment_status", e.target.value)} className="w-full rounded-xl border bg-white px-3 py-3 text-sm font-bold">
                            <option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option>
                          </select>
                          <label className="mt-3 block text-[10px] font-black uppercase tracking-wider text-black/40">Order status</label>
                          <select value={order.order_status} onChange={(e) => updateOrder(order.id, "order_status", e.target.value)} className="w-full rounded-xl border bg-white px-3 py-3 text-sm font-bold">
                            <option value="new">New</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="ready">Ready</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {ownerSection === "payments" && (
              <div className="mt-12">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-black">Payments</h3>
                    <p className="text-sm text-black/40">Review the M-Pesa receipt, then accept or reject each payment.</p>
                  </div>
                  <button onClick={loadOrders} className="rounded-xl border px-3 py-2 text-xs font-black"><RefreshCw size={14} className="mr-1 inline" /> Refresh</button>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-2xl bg-[#f7f6f3] p-10 text-center text-sm text-black/40">No payments yet.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-2xl border bg-[#f7f6f3] p-5">
                        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black">Order #{order.id.slice(0, 8)}</span>
                              <span className={`rounded-full px-3 py-1 text-[10px] font-black ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : order.payment_status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {order.payment_status === "paid" ? "Accepted" : order.payment_status === "failed" ? "Rejected" : "Pending review"}
                              </span>
                            </div>
                            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                              <div><User size={14} className="mr-1 inline" /> {order.customer_name}</div>
                              <div><Phone size={14} className="mr-1 inline" /> {order.customer_phone}</div>
                              <div className="font-black">Amount: {money(order.total)}</div>
                              <div>Order: <strong>{order.order_status}</strong></div>
                            </div>
                            <div className="mt-4 rounded-xl bg-white p-4">
                              <div className="text-[10px] font-black uppercase tracking-wider text-black/40">M-Pesa receipt</div>
                              <div className="mt-1 break-all text-lg font-black">{order.mpesa_receipt || "Not provided"}</div>
                              <div className="mt-1 text-xs text-black/40">Submitted {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}</div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center gap-2">
                            {order.payment_status === "pending" && (
                              <>
                                <button onClick={() => acceptPayment(order)} disabled={ownerLoading || !order.mpesa_receipt} className="w-full rounded-xl bg-black px-4 py-3 text-sm font-black text-white disabled:opacity-40">
                                  <CheckCircle size={16} className="mr-2 inline" /> Accept payment
                                </button>
                                <button onClick={() => rejectPayment(order)} disabled={ownerLoading} className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-600 disabled:opacity-40">
                                  Reject payment
                                </button>
                              </>
                            )}
                            {order.payment_status === "paid" && (
                              <div className="rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700">✓ Payment accepted. Order is {order.order_status}.</div>
                            )}
                            {order.payment_status === "failed" && (
                              <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">Payment rejected. Order cancelled.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {ownerSection === "settings" && (
              <div className="mt-12 max-w-lg">
                <h3 className="text-xl font-black">Settings</h3>
                <p className="text-sm text-black/40">Manage store-wide contact details.</p>

                <div className="mt-6 rounded-2xl border border-black/5 p-6">
                  <div className="flex items-center gap-2 font-black">
                    <MessageCircle size={17} /> WhatsApp order number
                  </div>
                  <p className="mt-1 text-xs text-black/40">
                    Customers are sent to this WhatsApp number to confirm their order after payment. Use the international format without a plus sign, e.g. 2547XXXXXXXX.
                  </p>

                  <input
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    placeholder="254710574821"
                    className="mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                  />

                  <button
                    onClick={saveWhatsappNumber}
                    disabled={savingWhatsapp || whatsappInput.trim() === whatsappNumber}
                    className="mt-3 w-full rounded-xl py-3 text-sm font-black disabled:opacity-40"
                    style={{ background: theme.accent, color: "#111" }}
                  >
                    {savingWhatsapp ? "Saving..." : "Save WhatsApp number"}
                  </button>

                  <p className="mt-3 text-xs text-black/40">
                    Current number: <strong>{whatsappNumber}</strong>
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-black/5 p-6">
                  <div className="flex items-center gap-2 font-black">
                    <CreditCard size={17} /> Payment confirmation duration
                  </div>
                  <p className="mt-1 text-xs text-black/40">
                    How long the "Confirming your payment" screen counts down after a customer taps Pay, before they can move on to enter their receipt. Between 5 seconds and 6 hours.
                  </p>

                  <div className="mt-4 flex gap-2">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={countdownInput}
                      onChange={(e) => setCountdownInput(e.target.value)}
                      placeholder="60"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                    />
                    <select
                      value={countdownUnit}
                      onChange={(e) => setCountdownUnit(e.target.value)}
                      className="rounded-xl border px-3 py-3 text-sm outline-none"
                    >
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>

                  <button
                    onClick={saveCountdownDuration}
                    disabled={
                      savingCountdown ||
                      Math.round(parseFloat(countdownInput || "0") * COUNTDOWN_UNIT_SECONDS[countdownUnit]) === paymentCountdownDuration
                    }
                    className="mt-3 w-full rounded-xl py-3 text-sm font-black disabled:opacity-40"
                    style={{ background: theme.accent, color: "#111" }}
                  >
                    {savingCountdown ? "Saving..." : "Save duration"}
                  </button>

                  <p className="mt-3 text-xs text-black/40">
                    Current duration:{" "}
                    <strong>
                      {(() => {
                        const best = secondsToBestUnit(paymentCountdownDuration);
                        return `${best.value} ${best.unit}`;
                      })()}
                    </strong>{" "}
                    ({paymentCountdownDuration}s)
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t bg-[#111] px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="text-2xl font-black tracking-tight">BALEKING</div>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Where style meets elegance. A premium fashion experience for men, women and children.
              </p>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider" style={{ color: theme.accent }}>Explore</div>
              <div className="mt-3 space-y-2 text-sm text-white/50">
                <button onClick={() => chooseGender("Male")} className="block">Male</button>
                <button onClick={() => chooseGender("Female")} className="block">Female</button>
                <button onClick={() => setAgeFilter("Children")} className="block">Children</button>
              </div>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider" style={{ color: theme.accent }}>Style</div>
              <div className="mt-3 space-y-2 text-sm text-white/50">
                <button onClick={() => chooseStyle("Casual")} className="block">Casual</button>
                <button onClick={() => chooseStyle("Formal")} className="block">Official</button>
                <button onClick={() => chooseStyle("Streetwear")} className="block">Streetwear</button>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30">
            © {new Date().getFullYear()} Baleking. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div><h2 className="text-xl font-black">Your Bag</h2><p className="text-xs text-black/40">{cartCount} item(s)</p></div>
              <button onClick={() => setCartOpen(false)}><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {!cart.length ? (
                <div className="py-24 text-center">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-black/10" />
                  <h3 className="font-black">Your bag is waiting.</h3>
                  <p className="mt-1 text-sm text-black/40">Add something you love.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-2xl border p-3">
                      {item.image_url ? <img src={item.image_url} alt="" className="h-20 w-16 rounded-xl object-cover" /> : <div className="h-20 w-16 rounded-xl bg-black/5" />}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-black">{item.name}</div>
                        <div className="text-xs text-black/40">{money(item.price)}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => decreaseCart(item.id)} className="rounded-lg border p-1"><Minus size={13} /></button>
                          <span className="w-5 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => increaseCart(item.id)} className="rounded-lg border p-1"><Plus size={13} /></button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-5">
                <div className="mb-2 flex justify-between text-sm"><span>Subtotal</span><strong>{money(cartSubtotal)}</strong></div>
                <button onClick={openCheckout} className="w-full rounded-2xl bg-black py-4 text-sm font-black text-white">Continue to checkout</button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* CHECKOUT */}
      {customerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div><div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>Secure checkout</div><h2 className="mt-1 text-2xl font-black">Complete your order</h2></div>
              <button onClick={() => setCustomerOpen(false)}><X /></button>
            </div>

            <div className="space-y-4">
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />

              <div className="rounded-2xl border p-4">
                <div className="font-black"><Gift size={17} className="mr-2 inline" /> Referral reward</div>
                <p className="mt-1 text-xs text-black/40">Use a referral code if someone invited you.</p>
                <div className="mt-3 flex gap-2">
                  <input value={referralCodeInput} onChange={(e) => { setReferralCodeInput(e.target.value.toUpperCase()); setReferralInfo(null); }} placeholder="BALEKING1234" className="min-w-0 flex-1 rounded-xl border px-3 py-3 text-sm uppercase outline-none" />
                  <button onClick={checkReferralCode} disabled={checkingReferral} className="rounded-xl bg-black px-4 py-3 text-xs font-black text-white">{checkingReferral ? "Checking..." : "Apply"}</button>
                </div>
                {referralInfo && (
                  <div className="mt-3 rounded-xl p-3 text-xs" style={{ background: theme.accentSoft }}>
                    <strong>{referralInfo.owner_name}</strong> · {referralInfo.successfulReferrals}/{REFERRAL_THRESHOLD} referrals
                    <div className="mt-1 font-bold">{referralInfo.qualifies ? `✓ ${REFERRAL_DISCOUNT_PERCENT}% discount applied` : "Keep referring to unlock your discount."}</div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-[#f5f4f1] p-5">
                <div className="font-black"><CreditCard size={17} className="mr-2 inline" /> M-Pesa</div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><strong>{money(cartSubtotal)}</strong></div>
                  {referralDiscount > 0 && <div className="flex justify-between text-green-600"><span>Referral discount</span><strong>-{money(referralDiscount)}</strong></div>}
                  <div className="flex justify-between border-t pt-3 text-lg"><strong>Total</strong><strong>{money(finalTotal)}</strong></div>
                </div>
                <div className="mt-4 text-xs text-black/50">Send exactly</div>
                <div className="mt-1 text-2xl font-black">{money(finalTotal)}</div>
                <div className="mt-1 text-xs text-black/45">to M-Pesa number</div>
                <div className="mt-1 text-xl font-black">{MPESA_NUMBER}</div>
              </div>

              <button
                onClick={startMpesaPayment}
                disabled={stkLoading || ownerLoading || stkSent}
                className="w-full rounded-2xl py-4 text-sm font-black disabled:opacity-50"
                style={{ background: theme.accent, color: "#111" }}
              >
                {stkLoading ? "Sending M-Pesa prompt..." : stkSent ? "M-Pesa prompt sent ✓" : `Pay ${money(finalTotal)} with M-Pesa`}
              </button>

              {stkMessage && (
                <div className="rounded-2xl border p-4 text-sm">
                  <div className="font-black">M-Pesa payment</div>
                  <p className="mt-1 text-xs text-black/55">{stkMessage}</p>
                </div>
              )}

              {stkSent && (
                <>
                  <input
                    value={mpesaReceipt}
                    onChange={(e) => setMpesaReceipt(e.target.value.toUpperCase())}
                    placeholder="Enter M-Pesa receipt after payment"
                    className="w-full rounded-xl border px-4 py-3 text-sm uppercase outline-none"
                  />
                  <button
                    onClick={placeOrder}
                    disabled={ownerLoading || !mpesaReceipt.trim()}
                    className="w-full rounded-2xl bg-black py-4 text-sm font-black text-white disabled:opacity-50"
                  >
                    {ownerLoading ? "Submitting order..." : "Submit order for owner verification"}
                  </button>
                  <p className="text-center text-[10px] text-black/35">The receipt is shown to the owner for verification before the order is accepted.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT CONFIRMATION OVERLAY */}
      {showPaymentConfirmation && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-2xl"
            style={{ animation: "dls-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 origin-left"
              style={{
                background: theme.accent,
                animation: `dls-shrink ${paymentCountdown}s linear forwards`,
              }}
            />

            <div className="relative mx-auto mb-2 flex h-40 w-40 items-center justify-center">
              <span
                className="absolute h-28 w-28 rounded-full opacity-25"
                style={{ background: theme.accent, animation: "dls-glow 2.4s ease-in-out infinite" }}
              />
              <svg viewBox="0 0 120 120" className="absolute h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke={theme.accentSoft} strokeWidth="5" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={theme.accent}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="339.3"
                  style={{
                    strokeDashoffset: 339.3 * (1 - paymentCountdown / paymentCountdownDuration),
                    transition: "stroke-dashoffset 1s linear",
                  }}
                />
              </svg>
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
                style={{ background: theme.accent }}
              >
                <CreditCard size={26} color="#111" />
              </div>
            </div>

            <div className="text-2xl font-black" style={{ color: theme.accent }}>{paymentCountdown}s</div>

            <div className="mt-4 text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>
              Payment in progress
            </div>
            <h3 className="mt-2 text-xl font-black">Confirming your M-Pesa payment</h3>
            <p className="mx-auto mt-2 max-w-[26rem] text-sm text-black/55">
              Enter your M-Pesa PIN on your phone to complete the payment. Our team is verifying it on their end.
            </p>

            <div className="mt-6 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent, animation: "dls-dot 1.2s ease-in-out infinite" }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent, animation: "dls-dot 1.2s ease-in-out infinite", animationDelay: "0.2s" }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent, animation: "dls-dot 1.2s ease-in-out infinite", animationDelay: "0.4s" }} />
            </div>

            <button
              onClick={() => setShowPaymentConfirmation(false)}
              className="mt-6 text-xs font-bold text-black/40 underline underline-offset-2"
            >
              I've completed payment — enter receipt now
            </button>
          </div>

          <style>{`
            @keyframes dls-pop {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes dls-glow {
              0%, 100% { transform: scale(0.85); opacity: 0.15; }
              50% { transform: scale(1.15); opacity: 0.35; }
            }
            @keyframes dls-dot {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40% { transform: scale(1); opacity: 1; }
            }
            @keyframes dls-shrink {
              from { transform: scaleX(1); }
              to { transform: scaleX(0); }
            }
          `}</style>
        </div>
      )}

      {/* OWNER LOGIN */}
      {ownerOpen && !ownerLoggedIn && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div><div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>Private access</div><h2 className="mt-1 text-2xl font-black">Owner login</h2></div>
              <button onClick={() => setOwnerOpen(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="Owner email" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              <div className="relative">
                <input
                  type={ownerPasswordVisible ? "text" : "password"}
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setOwnerPasswordVisible((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-black/55 hover:bg-black/5"
                  aria-label={ownerPasswordVisible ? "Hide password" : "Show password"}
                  title={ownerPasswordVisible ? "Hide password" : "Show password"}
                >
                  {ownerPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button onClick={ownerLogin} disabled={ownerLoading} className="w-full rounded-xl bg-black py-3 text-sm font-black text-white">
                <LogIn size={16} className="mr-2 inline" /> {ownerLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THEME SELECTOR */}
      {themeOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div><div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>Store atmosphere</div><h2 className="mt-1 text-2xl font-black">Choose your Baleking theme</h2><p className="mt-1 text-sm text-black/40">The owner can change the visual atmosphere without changing products.</p></div>
              <button onClick={() => setThemeOpen(false)}><X /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(THEMES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => { setThemeKey(key); setThemeOpen(false); setMessage(`${value.name} theme activated.`); }}
                  className={`overflow-hidden rounded-2xl border-2 text-left transition hover:-translate-y-1 ${themeKey === key ? "border-black" : "border-black/5"}`}
                >
                  <div className={`h-24 bg-gradient-to-br ${value.hero} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <Crown size={18} style={{ color: value.accent }} />
                      {themeKey === key && <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-black">ACTIVE</span>}
                    </div>
                    <div className="mt-6 text-xs font-black">{value.label}</div>
                  </div>
                  <div className="p-4">
                    <div className="font-black">{value.name}</div>
                    <div className="mt-1 text-xs text-black/40">Premium, modern and captivating.</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT FORM */}
      {productFormOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div><div className="text-[10px] font-black uppercase tracking-[.25em]" style={{ color: theme.accent }}>Inventory studio</div><h2 className="mt-1 text-2xl font-black">{editingProduct ? "Edit product" : "Add product"}</h2></div>
              <button onClick={() => setProductFormOpen(false)}><X /></button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4">
              <input value={productForm.name} onChange={(e) => updateProductForm("name", e.target.value)} placeholder="Product name" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              <textarea value={productForm.description} onChange={(e) => updateProductForm("description", e.target.value)} placeholder="Description" rows={3} className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />

              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="0" value={productForm.price} onChange={(e) => updateProductForm("price", e.target.value)} placeholder="Price" className="rounded-xl border px-4 py-3 text-sm outline-none" />
                <input type="number" min="0" value={productForm.old_price} onChange={(e) => updateProductForm("old_price", e.target.value)} placeholder="Old price (optional)" className="rounded-xl border px-4 py-3 text-sm outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select value={productForm.category} onChange={(e) => updateProductForm("category", e.target.value)} className="rounded-xl border px-4 py-3 text-sm">
                  {PRODUCT_CATEGORIES.map((x) => <option key={x}>{x}</option>)}
                </select>
                <select value={productForm.style} onChange={(e) => updateProductForm("style", e.target.value)} className="rounded-xl border px-4 py-3 text-sm">
                  <option>Casual</option><option>Formal</option><option>Smart Casual</option><option>Sport</option><option>Traditional</option><option>Streetwear</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select value={productForm.gender} onChange={(e) => updateProductForm("gender", e.target.value)} className="rounded-xl border px-4 py-3 text-sm">
                  <option>Unisex</option><option>Male</option><option>Female</option>
                </select>
                <select value={productForm.age_group} onChange={(e) => updateProductForm("age_group", e.target.value)} className="rounded-xl border px-4 py-3 text-sm">
                  <option>Adult</option><option>Children</option><option>Teen</option><option>Baby</option>
                </select>
              </div>

              <input type="number" min="0" value={productForm.stock} onChange={(e) => updateProductForm("stock", e.target.value)} placeholder="Stock quantity" className="w-full rounded-xl border px-4 py-3 text-sm outline-none" />

              <div className="rounded-2xl border p-4">
                <div className="mb-3 font-black">Product image</div>
                {productForm.image_url && <img src={productForm.image_url} alt="Preview" className="mb-4 h-48 w-full rounded-2xl object-cover" />}
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f5f4f1] px-4 py-3 text-sm font-black">
                  <Upload size={16} /> {uploadingImage ? "Uploading..." : "Upload image"}
                  <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
                </label>
                <input value={productForm.image_url} onChange={(e) => updateProductForm("image_url", e.target.value)} placeholder="Or paste image URL" className="mt-3 w-full rounded-xl border px-4 py-3 text-sm outline-none" />
              </div>

              <button type="submit" disabled={ownerLoading || uploadingImage} className="w-full rounded-2xl py-4 text-sm font-black disabled:opacity-50" style={{ background: theme.accent, color: "#111" }}>
                {ownerLoading ? "Saving..." : editingProduct ? "Save changes" : "Add product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
