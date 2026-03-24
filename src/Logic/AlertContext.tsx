import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '../components/Alert';
import type { AlertType } from '../components/Alert';

interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((type: AlertType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* CONTENEUR DES ALERTES : C'est lui qui est fixe */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col items-end pointer-events-none">
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <Alert
              id={alert.id}
              type={alert.type}
              message={alert.message}
              onClose={removeAlert}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

// Hook personnalisé pour utiliser les alertes facilement
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert doit être utilisé dans un AlertProvider");
  return context;
};