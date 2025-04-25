import React from 'react';

interface Courier {
  id: string;
  name: string;
  available: boolean;
}

interface CouriersListProps {
  couriers: Courier[];
  isLoading: boolean;
}

export default function CouriersList({ couriers, isLoading }: CouriersListProps) {
  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Kurierzy</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Kurierzy</h2>
      </div>
      
      {couriers.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
          Brak kurierów do wyświetlenia
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {couriers.map((courier) => (
            <li key={courier.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{courier.name}</p>
                <div className={`flex-shrink-0 ${courier.available ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    courier.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {courier.available ? 'Dostępny' : 'Zajęty'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
