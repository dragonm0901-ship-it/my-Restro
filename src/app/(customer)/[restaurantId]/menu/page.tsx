'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

// Basic Types
type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category_id: string;
  type: string;
};

type CartItem = MenuItem & { quantity: number };

export default function CustomerMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const unwrappedParams = React.use(params);
  const unwrappedSearch = React.use(searchParams);
  const restaurantId = unwrappedParams.restaurantId;
  const tableNumber = unwrappedSearch.table || 'Walk-in';
  
  const [restaurantName, setRestaurantName] = useState('Restaurant');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const supabase = createClient();

  // Fetch Data
  useEffect(() => {
    async function loadData() {
      // 1. Fetch Restaurant details
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('name')
        .eq('id', restaurantId)
        .single();
        
      if (restaurant) setRestaurantName(restaurant.name);

      // 2. Fetch Categories
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name, sort_order')
        .eq('restaurant_id', restaurantId)
        .order('sort_order');
        
        
      if (cats) setCategories(cats);

      // 3. Fetch Menu Items
      const { data: items } = await supabase
        .from('menu_items')
        .select('id, name, price, image, category_id, type')
        .eq('restaurant_id', restaurantId);
        
      if (items) setMenuItems(items);
    }
    loadData();
  }, [restaurantId, supabase]);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name}`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter items
  const displayItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === activeCategory);

  // Place Order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      // Create main order record in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          restaurant_id: restaurantId,
          type: 'Dine-In',
          status: 'pending',
          table_number: tableNumber,
          subtotal: cartTotal,
          tax: cartTotal * 0.13,
          discount: 0,
          total: cartTotal * 1.13,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success('Order sent to kitchen!');
      setCart([]);
      setIsCartOpen(false);
      
      // Optionally scroll somewhere or show an animation
      
    } catch (error) {
      console.error('Order checkout error:', error);
      toast.error('Failed to place order. Please call a waiter.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">
      
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold tracking-wider uppercase">
            {restaurantName}
          </div>
          <div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: '#FFF3E0', color: '#E65100' }}>
            Table {tableNumber}
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Our Menu</h1>
      </div>

      {/* Categories */}
      <div className="px-5 py-4 bg-gray-50 sticky top-[108px] z-10 flex gap-2 overflow-x-auto hide-scrollbar border-b border-gray-200">
        <button
          onClick={() => setActiveCategory('All')}
          className="px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all"
          style={{
            background: activeCategory === 'All' ? '#000' : '#fff',
            color: activeCategory === 'All' ? '#fff' : '#666',
            border: activeCategory === 'All' ? '1px solid #000' : '1px solid #e5e7eb'
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all"
            style={{
              background: activeCategory === cat.id ? '#000' : '#fff',
              color: activeCategory === cat.id ? '#fff' : '#666',
              border: activeCategory === cat.id ? '1px solid #000' : '1px solid #e5e7eb'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="flex-1 px-5 py-6 space-y-4 pb-32">
        {displayItems.length === 0 ? (
          <div className="text-center py-20 opacity-50 font-medium">No items found.</div>
        ) : (
          displayItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all active:scale-[0.98]">
              {/* Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                {item.image ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl opacity-20">🍽️</span>
                )}
              </div>
              
              {/* Details */}
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-base font-bold text-gray-900 mb-1 truncate leading-tight">{item.name}</h3>
                <p className="text-sm font-black text-black">NPR {item.price}</p>
              </div>

              {/* Add Button */}
              <button 
                onClick={() => addToCart(item)}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md active:scale-90 transition-transform shrink-0"
              >
                <Plus className="w-5 h-5" weight="bold" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Floating View Cart Button */}
      <AnimatePresence>
        {cartItemCount > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-5 right-5 z-30"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full py-4 rounded-2xl text-sm font-bold shadow-2xl flex items-center justify-between px-6 transition-transform active:scale-[0.98] bg-black text-white" 
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" weight="bold" />
                <span>{cartItemCount} Items</span>
              </div>
              <span>View Cart • NPR {cartTotal}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal Slide Up */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-50 rounded-t-[32px] z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              {/* Sheet Header */}
              <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-gray-100">
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black active:scale-95 transition-transform">
                  <ArrowLeft className="w-5 h-5" weight="bold" />
                </button>
                <h2 className="text-xl font-black text-black">Your Order</h2>
                <div className="w-10" /> {/* Balancer */}
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 hide-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center pt-10 text-gray-500 font-bold">Cart is empty</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex-1 pr-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-[11px] font-bold text-gray-500">NPR {item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-black">
                         <Minus className="w-4 h-4 font-bold" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-black">
                          <Plus className="w-4 h-4 font-bold" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              <div className="bg-white p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-sm font-bold text-gray-600">
                  <span>Subtotal</span>
                  <span>NPR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-600">
                  <span>VAT (13%)</span>
                  <span>NPR {(cartTotal * 0.13).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-gray-100 border-dashed">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-black">NPR {(cartTotal * 1.13).toLocaleString()}</span>
                </div>

                <button 
                  disabled={cart.length === 0 || isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full mt-4 py-4 rounded-2xl text-base font-bold shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 bg-black text-white"
                >
                  {isProcessing ? 'Sending to Kitchen...' : 'Place Order'}
                  {!isProcessing && <CheckCircle className="w-5 h-5" weight="bold" />}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
