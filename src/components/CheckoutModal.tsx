import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Money, CreditCard, X, CheckCircle, Bed } from '@phosphor-icons/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (paymentMethod: 'cash' | 'card' | 'room_charge', amountTendered?: number) => void;
  isProcessing: boolean;
}

export function CheckoutModal({ isOpen, onClose, total, onConfirm, isProcessing }: CheckoutModalProps) {
  const [method, setMethod] = useState<'cash' | 'card' | 'room_charge'>('cash');
  const [tenderedStr, setTenderedStr] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMethod('cash');
      setTenderedStr(total.toString());
    }
  }, [isOpen, total]);

  const tendered = parseFloat(tenderedStr) || 0;
  const change = Math.max(0, tendered - total);
  const isShort = tendered < total && method === 'cash';

  const handleQuickAmount = (amt: number) => {
    setTenderedStr(amt.toString());
  };

  const roundedUp = Math.ceil(total / 100) * 100;
  const quickAmounts = total > 0 ? [total, roundedUp, roundedUp + 500, roundedUp + 1000] : [];
  // unique, sorted quick amounts > total
  const uniqueQuick = Array.from(new Set(quickAmounts)).filter(a => a >= total).sort((a,b) => a-b).slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6 rounded-3xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Checkout</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMethod('cash')}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'cash' ? 'border-primary bg-primary/10' : 'border-transparent'}`}
                style={{ 
                  background: method === 'cash' ? 'var(--accent)' : 'var(--bg-elevated)',
                  borderColor: method === 'cash' ? 'var(--text-primary)' : 'var(--border)',
                  color: method === 'cash' ? 'var(--accent-fg)' : 'var(--text-secondary)'
                 }}
              >
                <Money className="w-8 h-8 mb-2" weight={method === 'cash' ? 'fill' : 'regular'} />
                <span className="font-bold">Cash</span>
              </button>
              <button
                onClick={() => setMethod('card')}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'card' ? 'border-primary bg-primary/10' : 'border-transparent'}`}
                style={{ 
                  background: method === 'card' ? 'var(--accent)' : 'var(--bg-elevated)',
                  borderColor: method === 'card' ? 'var(--text-primary)' : 'var(--border)',
                  color: method === 'card' ? 'var(--accent-fg)' : 'var(--text-secondary)'
                 }}
              >
                <CreditCard className="w-8 h-8 mb-2" weight={method === 'card' ? 'fill' : 'regular'} />
                <span className="font-bold">Card</span>
              </button>
              <button
                onClick={() => setMethod('room_charge')}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'room_charge' ? 'border-primary bg-primary/10' : 'border-transparent'}`}
                style={{ 
                  background: method === 'room_charge' ? 'var(--accent)' : 'var(--bg-elevated)',
                  borderColor: method === 'room_charge' ? 'var(--text-primary)' : 'var(--border)',
                  color: method === 'room_charge' ? 'var(--accent-fg)' : 'var(--text-secondary)'
                 }}
              >
                <Bed className="w-8 h-8 mb-2" weight={method === 'room_charge' ? 'fill' : 'regular'} />
                <span className="font-bold">Room</span>
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 mb-6 text-center" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Total Due</p>
              <p className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>NPR {total.toLocaleString()}</p>
            </div>

            <AnimatePresence mode="popLayout">
              {method === 'cash' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Amount Tendered (NPR)</label>
                    <input
                      type="number"
                      value={tenderedStr}
                      onChange={(e) => setTenderedStr(e.target.value)}
                      className="w-full text-2xl font-bold p-4 rounded-xl outline-none"
                      style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {uniqueQuick.map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleQuickAmount(amt)}
                        className="flex-1 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-80 border"
                        style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: change > 0 ? 'rgba(46,204,113,0.1)' : 'var(--bg-elevated)' }}>
                    <span className="font-bold" style={{ color: change > 0 ? 'var(--success)' : 'var(--text-secondary)' }}>Change Due</span>
                    <span className="text-xl font-black" style={{ color: change > 0 ? 'var(--success)' : 'var(--text-primary)' }}>NPR {change.toLocaleString()}</span>
                  </div>
                  {isShort && <p className="text-red-500 text-sm font-bold text-center">Amount tendered is less than total.</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => onConfirm(method, method === 'cash' ? tendered : undefined)}
              disabled={isProcessing || isShort}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              <span className="font-bold text-lg">{isProcessing ? 'Processing...' : 'Complete Order'}</span>
              {!isProcessing && <CheckCircle className="w-6 h-6" weight="fill" />}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
