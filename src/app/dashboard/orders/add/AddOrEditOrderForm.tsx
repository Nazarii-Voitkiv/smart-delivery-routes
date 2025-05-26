'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface Courier {
  id: string;
  name: string;
  available: boolean;
}

type OrderStatus = 'oczekujace' | 'w_drodze' | 'dostarczone' | 'anulowane';

const statusDisplayNames: Record<OrderStatus, string> = {
  oczekujace: 'Oczekujące',
  w_drodze: 'W drodze',
  dostarczone: 'Dostarczone',
  anulowane: 'Anulowane'
};

export default function AddOrEditOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editOrderId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    client_name: '',
    address: '',
    delivery_description: '',
    status: 'oczekujace' as OrderStatus,
    courier_id: ''
  });
  
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalCourierId, setOriginalCourierId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCouriers();
    
    if (editOrderId) {
      setIsEditMode(true);
      fetchOrderDetails(editOrderId);
    }
  }, [editOrderId]);
  
  async function fetchCouriers() {
    try {
      setFetchingData(true);
      
      const { data, error } = await supabase
        .from('couriers')
        .select('*');
      
      if (error) throw new Error(error.message);
      
      setCouriers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Nie udało się załadować kurierów: ${errorMessage}`);
    } finally {
      setFetchingData(false);
    }
  }
  
  async function fetchOrderDetails(orderId: string) {
    try {
      setFetchingData(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Nie znaleziono zamówienia');
      
      setFormData({
        client_name: data.client_name || '',
        address: data.address || '',
        delivery_description: data.delivery_description || '',
        status: (data.status as OrderStatus) || 'oczekujace',
        courier_id: data.courier_id || ''
      });
      
      setOriginalCourierId(data.courier_id || null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Nie udało się załadować danych zamówienia: ${errorMessage}`);
    } finally {
      setFetchingData(false);
    }
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.client_name || !formData.address) {
      setError('Wypełnij wszystkie wymagane pola formularza.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode && originalCourierId !== formData.courier_id) {
        if (originalCourierId) {
          await supabase
            .from('couriers')
            .update({ available: true })
            .eq('id', originalCourierId);
        }
        
        if (formData.courier_id) {
          await supabase
            .from('couriers')
            .update({ available: false })
            .eq('id', formData.courier_id);
        }
      } else if (!isEditMode && formData.courier_id) {
        await supabase
          .from('couriers')
          .update({ available: false })
          .eq('id', formData.courier_id);
      }
      
      const { error } = isEditMode 
        ? await supabase
            .from('orders')
            .update({
              client_name: formData.client_name,
              address: formData.address,
              delivery_description: formData.delivery_description,
              status: formData.status,
              courier_id: formData.courier_id || null
            })
            .eq('id', editOrderId as string)
        : await supabase
            .from('orders')
            .insert([{
              client_name: formData.client_name,
              address: formData.address,
              delivery_description: formData.delivery_description,
              status: formData.status,
              courier_id: formData.courier_id || null
            }]);
      
      if (error) throw new Error(error.message);
      
      router.push('/dashboard/orders');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Nie udało się ${isEditMode ? 'zaktualizować' : 'dodać'} zamówienia: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }
  
  const availableCouriers = couriers.filter(courier => 
    courier.available || courier.id === originalCourierId
  );
  
  const allowedStatuses: OrderStatus[] = isEditMode 
    ? ['oczekujace', 'w_drodze', 'dostarczone', 'anulowane'] 
    : ['oczekujace', 'w_drodze'];

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {fetchingData ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Wczytywanie danych...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? 'Edytuj zamówienie' : 'Nowe zamówienie'}
            </h2>
            <p className="text-gray-500 mt-1">
              {isEditMode 
                ? 'Wprowadź zmiany w wybranym zamówieniu' 
                : 'Wypełnij poniższy formularz, aby dodać nowe zamówienie'
              }
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                Nazwa klienta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="delivery_description" className="block text-sm font-medium text-gray-700">
                Opis dostawy
              </label>
              <textarea
                id="delivery_description"
                name="delivery_description"
                value={formData.delivery_description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                {allowedStatuses.map(status => (
                  <option key={status} value={status}>
                    {statusDisplayNames[status]}
                  </option>
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
                value={formData.courier_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">-- Brak kuriera --</option>
                {availableCouriers.map(courier => (
                  <option key={courier.id} value={courier.id}>
                    {courier.name} {courier.id === originalCourierId ? ' (obecnie przypisany)' : ''}
                  </option>
                ))}
              </select>
              
              {isEditMode && originalCourierId && (
                <p className="mt-1 text-xs text-gray-500">
                  Wyświetlani są tylko dostępni kurierzy oraz obecnie przypisany kurier.
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-5 border-t border-gray-100">
              <Link
                href="/dashboard/orders"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anuluj
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Przetwarzanie...
                  </>
                ) : (
                  isEditMode ? 'Zapisz zmiany' : 'Dodaj zamówienie'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
