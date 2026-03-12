import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockKey, X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

interface ManagerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManagerPinModal({ isOpen, onClose, onSuccess }: ManagerPinModalProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accepting 1234 or checking specific roles would be done here
    if (pin === '1234') {
      toast.success('Manager override successful');
      setPin('');
      onSuccess();
    } else {
      toast.error('Invalid PIN');
      setPin('');
    }
  };

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 p-6 rounded-3xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                <LockKey className="w-6 h-6" weight="fill" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Manager Override</h2>
              <p className="text-sm text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
                Enter manager PIN to authorize this action (Demo: 1234)
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                maxLength={4}
                className="w-full text-center text-3xl tracking-[1em] p-4 rounded-xl outline-none font-mono"
                style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                placeholder="****"
              />
              <button
                type="submit"
                disabled={pin.length < 4}
                className="w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
              >
                Authorize
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
