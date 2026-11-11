"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useAppSelector } from "@/src/redux/hooks";
import { CatalogItem, CatalogPlaygroundProps } from "@/src/types/product";
import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Plus,
  Plus as PlusIcon,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CatalogPlayground({
  sandbox,
  primaryColor,
}: CatalogPlaygroundProps) {
  // Simulator Catalog Items
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);

  // Cart state
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [isViewingCart, setIsViewingCart] = useState(false);

  // Catalog Form Add states
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemEmoji, setNewItemEmoji] = useState("🏷️");
  const { app_name } = useAppSelector((state) => state.setting);

  // Initialize simulator products
  useEffect(() => {
    if (
      sandbox?.products &&
      Array.isArray(sandbox.products) &&
      sandbox.products.length > 0
    ) {
      const items = sandbox.products.map((p: any, idx: number) => ({
        id: `item-${idx}`,
        name: p.name,
        price: Number(p.price) || 0,
        emoji: p.image || "🏷️",
        category: p.category || "General",
        description: `${p.name} - Premium dynamic catalog product.`,
        stock: p.stock || 50,
      }));
      setCatalogItems(items);
    } else {
      // Fallback
      setCatalogItems([
        {
          id: "item-1",
          name: "Organic Coffee Blend",
          price: 14.99,
          emoji: "☕",
          category: "Beverages",
          description: "Rich, locally-roasted medium blend beans.",
          stock: 45,
        },
        {
          id: "item-2",
          name: "Matcha Ceremony Set",
          price: 24.5,
          emoji: "🍵",
          category: "Tea Sets",
          description: "Authentic ceramic bowl and premium green tea powder.",
          stock: 18,
        },
        {
          id: "item-3",
          name: "Gluten-Free Croissant",
          price: 4.99,
          emoji: "🥐",
          category: "Bakery",
          description: "Flaky, buttery pastries baked fresh every morning.",
          stock: 12,
        },
      ]);
    }
  }, [sandbox]);

  // Add new item helper
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newItem: CatalogItem = {
      id: "item-" + Date.now(),
      name: newItemName,
      price: priceNum,
      emoji: newItemEmoji,
      category: "Custom",
      description: "Added via live catalog preview settings.",
      stock: 50,
    };

    setCatalogItems([...catalogItems, newItem]);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemEmoji("🏷️");
  };

  // Adjust price helper
  const adjustPrice = (id: string, amount: number) => {
    setCatalogItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedPrice = parseFloat((item.price + amount).toFixed(2));
          return { ...item, price: updatedPrice > 0.5 ? updatedPrice : 0.5 };
        }
        return item;
      }),
    );
  };

  // Delete product helper
  const deleteProduct = (id: string) => {
    setCatalogItems((prev) => prev.filter((item) => item.id !== id));
    // clean cart
    if (cart[id]) {
      const updatedCart = { ...cart };
      delete updatedCart[id];
      setCart(updatedCart);
    }
  };

  // Add to cart helper
  const addToCart = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Remove/decrement from cart
  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (!updated[id]) return prev;
      if (updated[id] === 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }
      return updated;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({});
    setCheckoutMessage(null);
    setIsViewingCart(false);
  };

  // Total calculation
  const getCartTotal = () => {
    return Object.entries(cart)
      .reduce((sum, [id, qty]) => {
        const prod = catalogItems.find((item) => item.id === id);
        return sum + (prod ? prod.price * qty : 0);
      }, 0)
      .toFixed(2);
  };

  // Checkout process simulation
  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;

    let msg = `🛒 *New Order from WhatsApp Store!*\n`;
    msg += `----------------------------------------\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      const prod = catalogItems.find((item) => item.id === id);
      if (prod) {
        msg += `• ${qty}x ${prod.name} (${prod.emoji}) - $${(prod.price * qty).toFixed(2)}\n`;
      }
    });
    msg += `----------------------------------------\n`;
    msg += `*Grand Total:* $${getCartTotal()}\n\n`;
    msg += `Payment link generated dynamically via Platform:\n`;
    msg += `🔗 https://checkout.stripe.com/pay/chatswala_inv_${Math.floor(Math.random() * 900000 + 100000)}`;

    setCheckoutMessage(msg);
  };

  return (
    <section
      id="catalog-demo"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50 border-y border-slate-200/60 relative overflow-hidden"
    >
      {/* Static pattern grid background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d97706 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-sm font-bold font-mono block px-3 py-1 rounded-full border shadow-sm w-fit mx-auto mb-3"
            style={{
              color: primaryColor,
              backgroundColor: primaryColor + "10",
              borderColor: primaryColor + "30",
            }}
          >
            {sandbox.badge || "Live Demo"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {sandbox.title || "Interact with the Catalog & Checkout Sandbox"}
          </h2>
          {sandbox.description && (
            <p className="text-[17px] font-medium text-slate-600 mt-4 leading-relaxed">
              {sandbox.description}
            </p>
          )}
        </div>

        {/* Sandbox Workspace */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          {/* Left Panel: Catalog Inventory Editor */}
          <div className="bg-white rounded-lg border border-slate-200/80 sm:p-6 p-4 shadow-sm flex flex-col gap-6 text-left h-[680px]">
            <div className="shrink-0">
              <h4 className="text-md font-black text-slate-800 flex items-center gap-2">
                <Store style={{ color: primaryColor }} size={18} />{" "}
                {sandbox.card_title || "Store Inventory Manager"}
              </h4>
              <p className="text-[15px] font-medium text-slate-600 mt-1">
                {sandbox.card_description ||
                  "Modify values dynamically to preview changes inside the phone simulator."}
              </p>
            </div>

            {/* Products list edit */}
            <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
              {catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 break-all whitespace-normal line-clamp-1">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono font-bold truncate">
                          {item.category}
                        </span>
                        <span className="text-[12px] font-bold text-slate-600 font-sans whitespace-nowrap">
                          Stock: {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Adjust controls */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                      <Button
                        onClick={() => adjustPrice(item.id, -1)}
                        className="p-1! h-[unset] hover:bg-slate-100 text-slate-500 rounded cursor-pointer border-none bg-transparent flex items-center justify-center"
                        title="Decrease Price"
                      >
                        <Minus size={10} />
                      </Button>
                      <span className="text-xs font-black text-slate-700 px-1 font-mono">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => adjustPrice(item.id, 1)}
                        className="p-1! h-[unset] hover:bg-slate-100 text-slate-500 rounded cursor-pointer border-none bg-transparent flex items-center justify-center"
                        title="Increase Price"
                      >
                        <Plus size={10} />
                      </Button>
                    </div>

                    <Button variant="unstyled"
                      onClick={() => deleteProduct(item.id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer border-none bg-transparent flex items-center justify-center"
                      title="Remove Product"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new product form */}
            <form
              onSubmit={handleAddItem}
              className="pt-4 border-t border-slate-100 flex flex-col gap-3 shrink-0"
            >
              <p className="text-sm font-bold text-slate-600 font-mono">
                Create New Store Product
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                <div className="flex gap-2">
                  <select
                    value={newItemEmoji}
                    onChange={(e) => setNewItemEmoji(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-lg rounded-lg px-2.5 focus:outline-none"
                  >
                    <option value="☕">☕</option>
                    <option value="🍵">🍵</option>
                    <option value="🥐">🥐</option>
                    <option value="🍪">🍪</option>
                    <option value="🥪">🥪</option>
                    <option value="🎂">🎂</option>
                    <option value="🎁">🎁</option>
                    <option value="💐">💐</option>
                    <option value="🏷️">🏷️</option>
                  </select>
                  <Input
                    type="text"
                    placeholder="Product Name (e.g. Double Espresso)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <Button
                    type="submit"
                    className="text-white text-xs font-black px-4! py-2.5! rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <PlusIcon size={12} /> Add
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Panel: Simulated WhatsApp Chat & Checkout */}
          <div className="bg-slate-900 rounded-[36px] border-[6px] border-slate-950 p-4 h-[600px] w-[300px] mx-auto shadow-2xl relative overflow-hidden flex flex-col shrink-0">
            {/* Phone Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20" />

            {/* Header */}
            <div
              className="text-white px-3 pt-6 pb-2.5 -mx-4 -mt-4 flex justify-between items-center shrink-0 relative z-10"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  CS
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black tracking-wide">
                    {app_name || ''} Live Shop
                  </h4>
                  <p className="text-[10px] text-emerald-300 font-bold">
                    Online storefront catalog
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Button variant="unstyled"
                  onClick={() => setIsViewingCart(!isViewingCart)}
                  className="relative p-1.5 hover:bg-white/10 rounded-lg cursor-pointer bg-transparent border-none text-white flex items-center justify-center"
                >
                  <ShoppingCart size={15} />
                  {Object.keys(cart).length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-amber-550 text-white font-mono text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {Object.values(cart).reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Screen body */}
            <div className="flex-1 bg-[#efeae2] -mx-4 p-3 overflow-y-auto flex flex-col justify-between text-[11px] text-left custom-scrollbar">
              <AnimatePresence mode="wait">
                {isViewingCart ? (
                  <motion.div
                    key="cart-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-lg p-3 border shadow-sm flex flex-col gap-3 h-full max-h-[300px] overflow-y-auto text-left"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="font-black text-slate-800 text-sm">
                        Your Shopping Cart
                      </span>
                      <Button
                        onClick={() => setIsViewingCart(false)}
                        className="text-xs font-bold bg-[unset]! h-[unset]! p-0! bg-transparent border-none cursor-pointer"
                        style={{ color: primaryColor }}
                      >
                        Back to items
                      </Button>
                    </div>

                    {Object.keys(cart).length === 0 ? (
                      <div className="text-center py-6 text-slate-400 font-bold">
                        Your cart is empty. Add catalog items!
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {Object.entries(cart).map(([id, qty]) => {
                          const prod = catalogItems.find(
                            (item) => item.id === id,
                          );
                          if (!prod) return null;
                          return (
                            <div
                              key={id}
                              className="flex justify-between items-center text-slate-700"
                            >
                              <div>
                                <p className="font-bold text-slate-800 text-[13px] break-all whitespace-normal line-clamp-1">
                                  {prod.emoji} {prod.name}
                                </p>
                                <p className="text-xs text-slate-600 font-medium font-mono break-all whitespace-normal line-clamp-1">
                                  ${prod.price.toFixed(2)} each
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => removeFromCart(id)}
                                  className="w-5 h-5 p-0! hover:bg-slate-100  rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 border-none cursor-pointer"
                                >
                                  -
                                </Button>
                                <span className="font-mono font-bold text-xs">
                                  {qty}
                                </span>
                                <Button
                                  onClick={() => addToCart(id)}
                                  className="w-5 h-5 p-0! hover:bg-slate-100  rounded bg-slate-100 flex items-center justify-center font-bold text-slate-650 border-none cursor-pointer"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          );
                        })}

                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-800 font-black">
                          <span>Total:</span>
                          <span
                            className="font-mono text-sm"
                            style={{ color: primaryColor }}
                          >
                            ${getCartTotal()}
                          </span>
                        </div>

                        <Button
                          onClick={handleCheckout}
                          className="w-full text-white py-2 rounded-lg text-xs font-bold text-center border-none cursor-pointer shadow-md mt-1 transition-all hover:opacity-90"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Generate Checkout Link
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : checkoutMessage ? (
                  <motion.div
                    key="checkout-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="bg-white rounded-lg p-3 border shadow-sm text-slate-800 leading-relaxed font-semibold self-start max-w-[90%] font-mono text-xs whitespace-pre-wrap break-all">
                      {checkoutMessage}
                    </div>
                    <Button
                      onClick={clearCart}
                      className="w-fit self-end  text-white px-3 py-1.5 rounded-lg border-none cursor-pointer text-xs font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Clear & Reset Shop
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="browse-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className="bg-white rounded-lg p-2.5 border shadow-sm text-slate-650 font-semibold self-start max-w-[90%] font-sans">
                      Hello! Welcome to our store menu. Tap below to browse
                      products and place an order directly.
                    </div>

                    {/* List items */}
                    <div className="space-y-2 max-h-[100%] overflow-y-auto pr-1">
                      {catalogItems.length === 0 ? (
                        <p className="text-center text-slate-400 font-bold py-4">
                          No products in catalog.
                        </p>
                      ) : (
                        catalogItems.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-lg p-2.5 border shadow-sm flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex gap-2 flex-1 min-w-0">
                                <span className="text-xl shrink-0">
                                  {prod.emoji}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold break-all whitespace-normal line-clamp-1 text-slate-800 text-sm leading-tight">
                                    {prod.name}
                                  </h5>
                                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5 font-sans">
                                    {prod.description}
                                  </p>
                                </div>
                              </div>
                              <span
                                className="font-mono font-bold text-[10.5px] shrink-0"
                                style={{ color: primaryColor }}
                              >
                                ${prod.price.toFixed(2)}
                              </span>
                            </div>
                            <Button
                              onClick={() => addToCart(prod.id)}
                              className="w-full text-white py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer text-center flex items-center justify-center gap-1 transition-all hover:opacity-90"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <PlusIcon size={10} /> Add to Cart
                            </Button>
                          </div>
                        ))
                      )}
                    </div>

                    {Object.keys(cart).length > 0 && (
                      <div
                        className="bg-white border p-2.5 rounded-lg flex items-center justify-between text-slate-800 font-semibold"
                        style={{ borderColor: primaryColor + "40" }}
                      >
                        <span>
                          Selected:{" "}
                          {Object.values(cart).reduce((a, b) => a + b, 0)} Items
                        </span>
                        <Button
                          onClick={() => setIsViewingCart(true)}
                          className="text-white border-none px-3! py-1.5! h-9! rounded-lg cursor-pointer text-xs "
                          style={{ backgroundColor: primaryColor }}
                        >
                          Checkout Cart
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
