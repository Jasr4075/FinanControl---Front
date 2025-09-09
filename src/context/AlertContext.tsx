import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import CustomAlert from '@/src/components/atoms/Alert';

type AlertOptions = {
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

type AlertContextValue = {
  showAlert: (title: string, message: string, opts?: Partial<AlertOptions>) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [onConfirmCb, setOnConfirmCb] = useState<(() => void) | undefined>(undefined);

  const showAlert = useCallback((t: string, m: string) => {
    setTitle(t);
    setMessage(m);
    setOnConfirmCb(() => undefined);
    setVisible(true);
  }, []);

  const showConfirm = useCallback((t: string, m: string, onConfirm: () => void) => {
    setTitle(t);
    setMessage(m);
    setOnConfirmCb(() => onConfirm);
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setOnConfirmCb(() => undefined);
  };

  const handleConfirm = () => {
    if (onConfirmCb) onConfirmCb();
    handleClose();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <CustomAlert
        visible={visible}
        title={title}
        message={message}
        onCancel={handleClose}
        onConfirm={handleConfirm}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider');
  return ctx;
};

export default AlertContext;
