import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  Edit3,
  LogIn,
  LogOut,
  Package,
  CreditCard,
  MessageCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Upload,
  Menu,
  User,
  Phone,
  ChevronDown,
} from "lucide-react";
import { supabase } from "./supabase";

const WHATSAPP_NUMBER = "254710574821";
const MPESA_NUMBER = "0710574821";

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  old_price: "",
  category: "Trousers",
  style: "Casual",
  gender: "Unisex",
  age_group: "Adult",
  stock: "",
  image_url: "",
};

const CATEGORIES = [
  "All",
  "Tops",
  "Trousers",
  "Dresses",
  "Skirts",
  "Shorts",
  "Shoes",
  "Jackets",
  "Kids",
  "Accessories",
];

function money(value) {
  return `KSh ${Number(value || 0).toLocaleString()}`;
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [cartOpen, setCartOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [mpesaReceipt, setMpesaReceipt] = useState("");

  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

  const [uploadingImage, setUploadingImage] = useState(false);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

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

  /* =========================================================
     LOAD ORDERS FOR OWNER
  ========================================================= */

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
  }

  /* =========================================================
     AUTH CHECK
  ========================================================= */

  async function checkOwner() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      setOwnerLoggedIn(true);
      loadOrders();
    }
  }

  useEffect(() => {
    loadProducts();
    checkOwner();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!session;

      setOwnerLoggedIn(loggedIn);

      if (loggedIn) {
        loadOrders();
      } else {
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category?.toLowerCase() === category.toLowerCase() ||
        product.gender?.toLowerCase() === category.toLowerCase() ||
        product.age_group?.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        !term ||
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.gender?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  /* =========================================================
     CART
  ========================================================= */

  function addToCart(product) {
    if (Number(product.stock) <= 0) {
      setMessage("This product is out of stock.");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          setMessage("You cannot add more than the available stock.");
          return current;
        }

        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function increaseCart(productId) {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== productId) return item;

        if (item.quantity >= item.stock) {
          setMessage("Maximum available stock reached.");
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function decreaseCart(productId) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((current) =>
      current.filter((item) => item.id !== productId)
    );
  }

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  /* =========================================================
     CUSTOMER ORDER
  ========================================================= */

  function openCheckout() {
    if (!cart.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setCustomerOpen(true);
  }

  async function placeOrder() {
    if (!customerName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!customerPhone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (!mpesaReceipt.trim()) {
      setMessage("Please enter your M-Pesa receipt number.");
      return;
    }

    if (!cart.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setOwnerLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          total: cartTotal,
          payment_status: "pending",
          order_status: "new",
          mpesa_receipt: mpesaReceipt.trim(),
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

      const whatsappMessage = [
        "Hello Duka la Style 👋",
        "",
        `Order ID: ${order.id}`,
        `Customer: ${customerName}`,
        `Phone: ${customerPhone}`,
        "",
        "ORDER:",
        ...cart.map(
          (item) =>
            `${item.name} x${item.quantity} = ${money(
              Number(item.price) * item.quantity
            )}`
        ),
        "",
        `TOTAL: ${money(cartTotal)}`,
        `M-Pesa Receipt: ${mpesaReceipt}`,
        "",
        "Please confirm my order.",
      ].join("\n");

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      setCart([]);
      setCustomerOpen(false);
      setCartOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setMpesaReceipt("");

      setMessage(
        "Order placed successfully! Opening WhatsApp..."
      );

      window.open(whatsappUrl, "_blank");

      if (ownerLoggedIn) {
        loadOrders();
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Could not place the order."
      );
    } finally {
      setOwnerLoading(false);
    }
  }

  /* =========================================================
     OWNER LOGIN
  ========================================================= */

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
      setMessage("Owner login successful.");
      setOwnerEmail("");
      setOwnerPassword("");
    }

    setOwnerLoading(false);
  }

  async function ownerLogout() {
    await supabase.auth.signOut();
    setOwnerLoggedIn(false);
    setOrders([]);
  }

  /* =========================================================
     PRODUCT FORM
  ========================================================= */

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
      category: product.category || "Trousers",
      style: product.style || "Casual",
      gender: product.gender || "Unisex",
      age_group: product.age_group || "Adult",
      stock: product.stock ?? "",
      image_url: product.image_url || "",
    });

    setProductFormOpen(true);
  }

  function updateProductForm(field, value) {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */

  async function uploadImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);

    try {
      const extension =
        file.name.split(".").pop() || "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const filePath = `products/${fileName}`;

      /*
        IMPORTANT:
        Change "product-images" below if your Supabase
        Storage bucket has a different name.
      */

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      updateProductForm("image_url", data.publicUrl);

      setMessage("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        "Image upload failed. Check your Storage bucket name and policies."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  /* =========================================================
     SAVE PRODUCT
  ========================================================= */

  async function saveProduct(event) {
    event.preventDefault();

    if (!productForm.name.trim()) {
      setMessage("Product name is required.");
      return;
    }

    if (!productForm.price) {
      setMessage("Product price is required.");
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      price: Number(productForm.price),
      old_price: productForm.old_price
        ? Number(productForm.old_price)
        : null,
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

        setMessage("Product updated successfully.");
      } else {
        const { error } = await supabase
          .from("products")
          .insert(payload);

        if (error) throw error;

        setMessage("Product added successfully.");
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

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Product deleted.");
    await loadProducts();
  }

  /* =========================================================
     UPDATE ORDER
  ========================================================= */

  async function updateOrder(orderId, field, value) {
    const { error } = await supabase
      .from("orders")
      .update({
        [field]: value,
      })
      .eq("id", orderId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Order updated.");
    loadOrders();
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button
            onClick={() => {
              setCategory("All");
              setSearch("");
            }}
            className="text-left"
          >
            <div className="text-2xl font-black tracking-tight">
              Duka la Style
            </div>

            <div className="text-xs font-medium text-slate-500">
              Fashion for everyone
            </div>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setOwnerOpen(true)}
              className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Owner
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            >
              <ShoppingBag
                size={17}
                className="mr-2 inline"
              />
              Cart

              {cartCount > 0 && (
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-slate-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t bg-white px-4 py-3 md:hidden">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOwnerOpen(true);
                  setMobileMenu(false);
                }}
                className="flex-1 rounded-xl border px-4 py-3 font-semibold"
              >
                Owner
              </button>

              <button
                onClick={() => {
                  setCartOpen(true);
                  setMobileMenu(false);
                }}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
              >
                Cart ({cartCount})
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MESSAGE */}

      {message && (
        <div className="fixed bottom-5 left-1/2 z-[100] flex max-w-[90%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle size={18} />

          <span>{message}</span>

          <button
            onClick={() => setMessage("")}
            className="ml-2"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* HERO */}

      <section className="bg-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-slate-300">
              Duka la Style
            </p>

            <h1 className="text-4xl font-black leading-tight sm:text-6xl">
              Find your next favourite style.
            </h1>

            <p className="mt-5 max-w-xl text-slate-300">
              Shop quality fashion for men, women and children.
              Browse our latest collection and order directly.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-7 rounded-2xl bg-white px-6 py-3 font-bold text-slate-900"
            >
              Shop now
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}

      <main
        id="products"
        className="mx-auto max-w-7xl px-4 py-10"
      >
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Our Collection
            </h2>

            <p className="text-sm text-slate-500">
              {filteredProducts.length} products available
            </p>
          </div>

          <div className="flex w-full max-w-md items-center rounded-2xl border bg-white px-4">
            <Search size={19} className="text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search clothes..."
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold ${
                category === item
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw
              className="animate-spin"
              size={30}
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <Package
              size={45}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-xl font-bold">
              No products found
            </h3>

            <p className="mt-2 text-slate-500">
              Try another category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Package size={45} />
                    </div>
                  )}

                  {Number(product.stock) <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-black">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {product.old_price &&
                    Number(product.old_price) >
                      Number(product.price) && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black">
                        SALE
                      </span>
                    )}
                </div>

                <div className="p-4">
                  <div className="mb-1 text-xs font-bold uppercase text-slate-400">
                    {product.gender} · {product.age_group}
                  </div>

                  <h3 className="truncate font-black">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-[40px] text-sm text-slate-500">
                    {product.description ||
                      "Quality fashion from Duka la Style."}
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <div className="font-black">
                        {money(product.price)}
                      </div>

                      {product.old_price &&
                        Number(product.old_price) >
                          Number(product.price) && (
                          <div className="text-xs text-slate-400 line-through">
                            {money(product.old_price)}
                          </div>
                        )}
                    </div>

                    <button
                      disabled={Number(product.stock) <= 0}
                      onClick={() => addToCart(product)}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-3 text-xs font-semibold text-slate-400">
                    {Number(product.stock) > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* OWNER BUTTON */}

      {ownerLoggedIn && (
        <section className="border-t bg-white px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Owner Dashboard
                </p>

                <h2 className="text-3xl font-black">
                  Manage Store
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={openAddProduct}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
                >
                  <Plus
                    size={17}
                    className="mr-1 inline"
                  />
                  Add Product
                </button>

                <button
                  onClick={ownerLogout}
                  className="rounded-xl border px-4 py-3 text-sm font-bold"
                >
                  <LogOut
                    size={17}
                    className="mr-1 inline"
                  />
                  Logout
                </button>
              </div>
            </div>

            {/* OWNER PRODUCTS */}

            <div className="mb-12">
              <h3 className="mb-4 text-xl font-black">
                Products
              </h3>

              <div className="overflow-x-auto rounded-2xl bg-slate-50">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b last:border-0"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt=""
                                className="h-12 w-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-slate-200" />
                            )}

                            <span className="font-bold">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          {product.category}
                        </td>

                        <td className="p-4 font-bold">
                          {money(product.price)}
                        </td>

                        <td className="p-4">
                          {product.stock}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                openEditProduct(product)
                              }
                              className="rounded-lg border p-2"
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              onClick={() =>
                                deleteProduct(product)
                              }
                              className="rounded-lg border p-2 text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* OWNER ORDERS */}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black">
                  Customer Orders
                </h3>

                <button
                  onClick={loadOrders}
                  className="rounded-xl border px-3 py-2 text-sm font-bold"
                >
                  <RefreshCw
                    size={15}
                    className="mr-1 inline"
                  />
                  Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                  No orders yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black">
                              Order #{order.id.slice(0, 8)}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                              {order.order_status}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                              Payment:{" "}
                              {order.payment_status}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 text-sm">
                            <div>
                              <User
                                size={15}
                                className="mr-1 inline"
                              />
                              {order.customer_name ||
                                "Customer"}
                            </div>

                            <div>
                              <Phone
                                size={15}
                                className="mr-1 inline"
                              />
                              {order.customer_phone}
                            </div>

                            <div className="font-black">
                              Total: {money(order.total)}
                            </div>

                            <div>
                              M-Pesa receipt:{" "}
                              <strong>
                                {order.mpesa_receipt ||
                                  "Not provided"}
                              </strong>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="mb-2 text-xs font-bold uppercase text-slate-400">
                              Items
                            </p>

                            <div className="space-y-1">
                              {order.order_items?.map(
                                (item) => (
                                  <div
                                    key={item.id}
                                    className="text-sm"
                                  >
                                    {item.product_name} ×{" "}
                                    {item.quantity} —{" "}
                                    {money(
                                      Number(item.price) *
                                        item.quantity
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-500">
                            Payment status
                          </label>

                          <select
                            value={order.payment_status}
                            onChange={(event) =>
                              updateOrder(
                                order.id,
                                "payment_status",
                                event.target.value
                              )
                            }
                            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold outline-none"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="paid">
                              Paid
                            </option>

                            <option value="failed">
                              Failed
                            </option>
                          </select>

                          <label className="mt-2 text-xs font-bold text-slate-500">
                            Order status
                          </label>

                          <select
                            value={order.order_status}
                            onChange={(event) =>
                              updateOrder(
                                order.id,
                                "order_status",
                                event.target.value
                              )
                            }
                            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold outline-none"
                          >
                            <option value="new">
                              New
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="ready">
                              Ready
                            </option>

                            <option value="completed">
                              Completed
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}

      <footer className="border-t bg-white px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} Duka la Style
          </div>

          <div>
            Fashion for men, women & children.
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}

      {cartOpen && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-black">
                  Your Cart
                </h2>

                <p className="text-sm text-slate-500">
                  {cartCount} item(s)
                </p>
              </div>

              <button onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag
                    size={50}
                    className="mx-auto mb-4 text-slate-300"
                  />

                  <h3 className="font-bold">
                    Your cart is empty
                  </h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl border p-3"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-20 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-20 w-16 rounded-xl bg-slate-100" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-black">
                          {item.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {money(item.price)}
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              decreaseCart(item.id)
                            }
                            className="rounded-lg border p-1"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-6 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseCart(item.id)
                            }
                            className="rounded-lg border p-1"
                          >
                            <Plus size={14} />
                          </button>

                          <button
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="ml-auto text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-5">
                <div className="mb-4 flex justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-black">
                    {money(cartTotal)}
                  </span>
                </div>

                <button
                  onClick={openCheckout}
                  className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white"
                >
                  Checkout
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* CHECKOUT */}

      {customerOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Checkout
                </h2>

                <p className="text-sm text-slate-500">
                  Total: {money(cartTotal)}
                </p>
              </div>

              <button onClick={() => setCustomerOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold">
                  Your name
                </label>

                <input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold">
                  Phone number
                </label>

                <input
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  placeholder="07XXXXXXXX"
                />
              </div>

              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="flex items-center gap-2 font-black">
                  <CreditCard size={19} />
                  M-Pesa Payment
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  Send{" "}
                  <strong>{money(cartTotal)}</strong>{" "}
                  to:
                </p>

                <div className="mt-2 text-2xl font-black">
                  {MPESA_NUMBER}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  After paying, enter the M-Pesa transaction
                  receipt below. The owner will verify the
                  payment.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold">
                  M-Pesa receipt number
                </label>

                <input
                  value={mpesaReceipt}
                  onChange={(event) =>
                    setMpesaReceipt(event.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 uppercase outline-none"
                  placeholder="e.g. ABC123XYZ"
                />
              </div>

              <button
                onClick={placeOrder}
                disabled={ownerLoading}
                className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white disabled:opacity-50"
              >
                {ownerLoading
                  ? "Placing order..."
                  : "Place Order & WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OWNER LOGIN */}

      {ownerOpen && !ownerLoggedIn && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Owner Login
                </h2>

                <p className="text-sm text-slate-500">
                  Store management
                </p>
              </div>

              <button onClick={() => setOwnerOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={ownerEmail}
                onChange={(event) =>
                  setOwnerEmail(event.target.value)
                }
                placeholder="Owner email"
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />

              <input
                type="password"
                value={ownerPassword}
                onChange={(event) =>
                  setOwnerPassword(event.target.value)
                }
                placeholder="Password"
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />

              <button
                onClick={ownerLogin}
                disabled={ownerLoading}
                className="w-full rounded-xl bg-slate-900 py-3 font-black text-white disabled:opacity-50"
              >
                <LogIn
                  size={17}
                  className="mr-2 inline"
                />

                {ownerLoading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT FORM */}

      {productFormOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-sm text-slate-500">
                  Changes are saved directly to Supabase.
                </p>
              </div>

              <button
                onClick={() => setProductFormOpen(false)}
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={saveProduct}
              className="space-y-4"
            >
              <input
                value={productForm.name}
                onChange={(event) =>
                  updateProductForm(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Product name"
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />

              <textarea
                value={productForm.description}
                onChange={(event) =>
                  updateProductForm(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Description"
                rows={3}
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={(event) =>
                    updateProductForm(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder="Price"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                />

                <input
                  type="number"
                  min="0"
                  value={productForm.old_price}
                  onChange={(event) =>
                    updateProductForm(
                      "old_price",
                      event.target.value
                    )
                  }
                  placeholder="Old price (optional)"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={productForm.category}
                  onChange={(event) =>
                    updateProductForm(
                      "category",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                >
                  {CATEGORIES.filter(
                    (item) => item !== "All"
                  ).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={productForm.style}
                  onChange={(event) =>
                    updateProductForm(
                      "style",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option>Casual</option>
                  <option>Formal</option>
                  <option>Smart Casual</option>
                  <option>Sport</option>
                  <option>Traditional</option>
                  <option>Streetwear</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={productForm.gender}
                  onChange={(event) =>
                    updateProductForm(
                      "gender",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option>Unisex</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <select
                  value={productForm.age_group}
                  onChange={(event) =>
                    updateProductForm(
                      "age_group",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option>Adult</option>
                  <option>Children</option>
                  <option>Teen</option>
                  <option>Baby</option>
                </select>
              </div>

              <input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(event) =>
                  updateProductForm(
                    "stock",
                    event.target.value
                  )
                }
                placeholder="Stock quantity"
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />

              <div className="rounded-2xl border p-4">
                <div className="mb-3 font-bold">
                  Product image
                </div>

                {productForm.image_url && (
                  <img
                    src={productForm.image_url}
                    alt="Preview"
                    className="mb-4 h-40 w-full rounded-2xl object-cover"
                  />
                )}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold">
                  <Upload size={17} />

                  {uploadingImage
                    ? "Uploading..."
                    : "Upload Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="hidden"
                  />
                </label>

                <input
                  value={productForm.image_url}
                  onChange={(event) =>
                    updateProductForm(
                      "image_url",
                      event.target.value
                    )
                  }
                  placeholder="Or paste image URL"
                  className="mt-3 w-full rounded-xl border px-4 py-3 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={ownerLoading || uploadingImage}
                className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white disabled:opacity-50"
              >
                {ownerLoading
                  ? "Saving..."
                  : editingProduct
                  ? "Save Changes"
                  : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;