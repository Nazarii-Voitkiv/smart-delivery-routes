'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface Courier {
  id: string;
  name: string;
  available: boolean;
}

// Simplified status options
type OrderStatus = 'oczekujace' | 'w_drodze' | 'dostarczone' | 'anulowane';

export default function AddOrder() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [courierLoadingError, setCourierLoadingError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    address: '',
    delivery_description: '',
    courier_id: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    client_name: false,
    address: false
  });

  useEffect(() => {
    async function fetchCouriers() {
      try {
        const { data, error } = await supabase
          .from('couriers')
          .select('id, name, available');
          
        if (error) throw new Error(error.message);
        setCouriers(data || []);
        setCourierLoadingError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
        setCourierLoadingError(`Nie udało się załadować listy kurierów: ${errorMessage}`);
      }
    }
    
    fetchCouriers();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          client_name: formData.client_name,
          address: formData.address,
          status: 'oczekujace', // Always set default status
          delivery_description: formData.delivery_description,
          courier_id: formData.courier_id || null
        }])
        .select();
        
      if (error) throw new Error(error.message);
      
      router.push('/dashboard/orders');
    } catch (err) {
      console.error('Order creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Nie udało się utworzyć zamówienia: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/dashboard/orders" className="mr-4 text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Nowe Zamówienie</h1>
        </div>
        
        {courierLoadingError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{courierLoadingError}</p>
                <p className="mt-1 text-xs text-yellow-600">Możesz kontynuować bez wyboru kuriera.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa klienta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.client_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.client_name && (
                <p className="mt-1 text-sm text-red-600">Nazwa klienta jest wymagana</p>
              )}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600">Adres jest wymagany</p>
              )}
            </div>
            
            <div>
              <label htmlFor="courier_id" className="block text-sm font-medium text-gray-700 mb-1">
                Kurier
              </label>
              <select
                id="courier_id"
                name="courier_id"
                value={formData.courier_id}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">-- Wybierz kuriera --</option>
                {couriers.length > 0 ? (
                  couriers.map(courier => (
                    <option key={courier.id} value={courier.id}>
                      {courier.name} {!courier.available && '(niedostępny)'}
                    </option>
                  ))
                ) : (
                  <option disabled>Brak dostępnych kurierów</option>
                )}
              </select>
              <p className="mt-1 text-xs text-gray-500">Status zamówienia będzie "Oczekujące" do momentu przydzielenia kuriera</p>
            </div>
            
            <div>
              <label htmlFor="delivery_description" className="block text-sm font-medium text-gray-700 mb-1">
                Opis dostawy
              </label>
              <textarea
                id="delivery_description"
                name="delivery_description"
                rows={3}
                value={formData.delivery_description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <Link
              href="/dashboard/orders"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Utwórz zamówienie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
