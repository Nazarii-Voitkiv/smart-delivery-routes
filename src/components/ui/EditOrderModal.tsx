import { useState, useEffect } from 'react';

interface Courier {
  id: string;
  name: string;
  available: boolean;
}

type OrderStatus = 'oczekujace' | 'w_drodze' | 'dostarczone' | 'anulowane';

interface Order {
  id: string;
  client_name: string;
  address: string;
  status: OrderStatus;
  created_at: string;
  delivery_date?: string;
  delivery_description: string;
  courier_id?: string;
  courier?: Courier;
}

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  order: Order;
  couriers: Courier[];
}

const statusDisplayNames: Record<OrderStatus, string> = {
  oczekujace: 'Oczekujące',
  w_drodze: 'W drodze',
  dostarczone: 'Dostarczone',
  anulowane: 'Anulowane'
};

export default function EditOrderModal({
  isOpen,
  onClose,
  onSave,
  order,
  couriers
}: EditOrderModalProps) {
  const [formData, setFormData] = useState<Order>({...order});
  const [validationErrors, setValidationErrors] = useState({
    client_name: false,
    address: false
  });

  useEffect(() => {
    setFormData({...order});
    setValidationErrors({
      client_name: false,
      address: false
    });
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      client_name: !formData.client_name,
      address: !formData.address
    };
    
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSave(formData);
  };

  const availableCouriers = couriers.filter(c => 
    c.available || c.id === order.courier_id
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4">
            <h3 className="text-xl font-bold text-gray-800">
              Edytuj zamówienie
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Zmień dane zamówienia i zapisz zmiany
            </p>
          </div>
          
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                  Nazwa klienta
                </label>
                <input
                  type="text"
                  name="client_name"
                  id="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    validationErrors.client_name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {validationErrors.client_name && (
                  <p className="mt-1 text-sm text-red-600">Nazwa klienta jest wymagana</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adres
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    validationErrors.address
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">Adres jest wymagany</p>
                )}
              </div>
              
              <div>
                <label htmlFor="delivery_description" className="block text-sm font-medium text-gray-700">
                  Opis dostawy
                </label>
                <textarea
                  name="delivery_description"
                  id="delivery_description"
                  value={formData.delivery_description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  {Object.entries(statusDisplayNames).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="courier_id" className="block text-sm font-medium text-gray-700">
                  Kurier
                </label>
                <select
                  id="courier_id"
                  name="courier_id"
                  value={formData.courier_id || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">-- Brak kuriera --</option>
                  {availableCouriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>
                      {courier.name} {courier.id === order.courier_id && !courier.available ? '(obecnie przypisany)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Wyświetlani są tylko dostępni kurierzy oraz obecnie przypisany kurier.
                </p>
              </div>

              <div className="mt-5 flex justify-end space-x-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
