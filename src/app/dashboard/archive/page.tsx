'use client';

import { useState, useEffect } from 'react';
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

const statusColors: Record<OrderStatus, {bg: string, text: string, dot: string}> = {
  oczekujace: {bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400'},
  w_drodze: {bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-400'},
  dostarczone: {bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-400'},
  anulowane: {bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-400'}
};

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

export default function OrderArchive() {
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  
  useEffect(() => {
    fetchArchivedOrders();
  }, []);
  
  async function fetchArchivedOrders() {
    try {
      setLoading(true);
      
      const { data: courierData, error: courierError } = await supabase
        .from('couriers')
        .select('*');
      
      if (courierError) throw new Error(courierError.message);
      
      const couriersMap: Record<string, Courier> = {};
      courierData?.forEach(courier => {
        couriersMap[courier.id] = {
          id: courier.id,
          name: courier.name || 'Bez nazwy',
          available: courier.available || false
        };
      });
      
      setCouriers(courierData || []);
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .or('status.eq.dostarczone,status.eq.anulowane')
        .order('created_at', { ascending: false });
      
      if (orderError) throw new Error(orderError.message);
      
      const archivedOrders = orderData?.map(order => ({
        id: order.id,
        client_name: order.client_name || '',
        address: order.address || 'Brak adresu',
        status: (order.status as OrderStatus) || 'dostarczone',
        created_at: order.created_at,
        delivery_date: order.delivery_date,
        delivery_description: order.delivery_description || 'Brak opisu',
        courier_id: order.courier_id,
        courier: order.courier_id ? couriersMap[order.courier_id] : undefined
      })) || [];
      
      setArchivedOrders(archivedOrders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Nie udało się załadować danych archiwum: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Archiwum Zamówień</h1>
            <p className="text-gray-500 mt-1">Historia zakończonych i anulowanych zamówień</p>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium mr-2">Razem:</span>
            <span className="bg-indigo-100 text-indigo-700 font-medium rounded-full px-3 py-1">{archivedOrders.length}</span>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-500">Wczytywanie danych archiwum...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
                <p className="mt-1 text-xs text-red-600">Sprawdź połączenie z internetem i spróbuj ponownie.</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && archivedOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Brak archiwalnych zamówień</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              W systemie nie znaleziono żadnych zarchiwizowanych zamówień.
              Gdy zamówienia otrzymają status "Dostarczone" lub "Anulowane", będą widoczne tutaj.
            </p>
          </div>
        )}

        {!loading && !error && archivedOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa klienta</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurier</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opis dostawy</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adres</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data utworzenia</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {archivedOrders.map(order => (
                    <tr key={order.id} className="hover:bg-indigo-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 bg-indigo-50 rounded-md px-2 py-1 inline-block">
                          #{order.id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{order.client_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.courier ? (
                            <span className="flex items-center">
                              <span className={`h-2 w-2 mr-2 rounded-full ${
                                order.courier.available ? 'bg-green-400' : 'bg-gray-400'
                              }`}></span>
                              {order.courier.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Nie przypisano</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.delivery_description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{order.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[order.status]?.bg || 'bg-gray-100'
                          } ${
                            statusColors[order.status]?.text || 'text-gray-800'
                          }`}>
                            <span className={`block h-2.5 w-2.5 rounded-full mr-2 ${statusColors[order.status]?.dot}`}></span>
                            {statusDisplayNames[order.status]}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 flex space-x-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Powrót do panelu
          </Link>
          
          <Link 
            href="/dashboard/orders" 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Aktywne Zamówienia
          </Link>
        </div>
      </div>
    </div>
  );
}
