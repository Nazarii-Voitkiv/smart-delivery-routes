import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface Order {
  id: string;
  address: string;
  delivery_time: string;
  status: string;
  courier_id: string | null;
}

interface Courier {
  id: string;
  name: string;
  available: boolean;
}

interface OrdersTableProps {
  orders: Order[];
  couriers: Courier[];
  getCourierName: (courierId: string | null) => string;
  onDelete: (id: string) => void;
  onAssignCourier: (orderId: string, courierId: string) => void;
  isLoading: boolean;
}

export default function OrdersTable({ 
  orders, 
  couriers,
  getCourierName,
  onDelete,
  onAssignCourier,
  isLoading 
}: OrdersTableProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  const handleEditClick = (id: string) => {
    router.push(`/orders/${id}/edit`);
  };
  
  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (orderToDelete) {
      onDelete(orderToDelete);
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };
  
  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  
  const handleAssignCourier = (orderId: string, courierId: string) => {
    onAssignCourier(orderId, courierId);
    setDropdownOpen(null);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'new': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    const statusNames = {
      'new': 'Nowe',
      'in_progress': 'W trakcie',
      'delivered': 'Dostarczone',
      'cancelled': 'Anulowane'
    };
    
    const style = statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
    const name = statusNames[status as keyof typeof statusNames] || 'Nieznany';
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
        {name}
      </span>
    );
  };
  
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
        Brak zamówień do wyświetlenia
      </div>
    );
  }
  
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adres</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data dostawy</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurier</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.delivery_time)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCourierName(order.courier_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(order.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edytuj"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(order.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Usuń"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(order.id)}
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                        title="Przypisz kuriera"
                      >
                        <UserPlusIcon className="h-5 w-5" />
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </button>
                      
                      {dropdownOpen === order.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <div className="px-3 py-2 text-xs text-gray-600 border-b">Wybierz kuriera:</div>
                            
                            {couriers.length > 0 ? (
                              couriers.map((courier) => (
                                <button
                                  key={courier.id}
                                  onClick={() => handleAssignCourier(order.id, courier.id)}
                                  className={`w-full text-left px-4 py-2 text-sm ${courier.available ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400'}`}
                                  disabled={!courier.available}
                                >
                                  {courier.name} {!courier.available && '(zajęty)'}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                Brak dostępnych kurierów
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Potwierdzenie usunięcia"
        message="Czy na pewno chcesz usunąć to zamówienie? Tej operacji nie można cofnąć."
      />
    </>
  );
}
