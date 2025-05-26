import { Suspense } from 'react';
import AddOrEditOrderForm from './AddOrEditOrderForm';

export default function AddOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Zamówienie
          </h1>
          <p className="text-gray-500 mt-1">
            Zarządzaj zamówieniami
          </p>
        </div>
        
        <Suspense fallback={
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-500">Wczytywanie danych...</p>
          </div>
        }>
          <AddOrEditOrderForm />
        </Suspense>
      </div>
    </div>
  );
}
