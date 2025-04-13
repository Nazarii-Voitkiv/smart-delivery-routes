import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/dashboard/orders"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-gray-600">Manage delivery orders</p>
        </Link>
        <Link 
          href="/dashboard/couriers"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Couriers</h2>
          <p className="text-gray-600">Manage courier profiles</p>
        </Link>
        <Link 
          href="/dashboard/archive"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Archive</h2>
          <p className="text-gray-600">View completed deliveries</p>
        </Link>
      </div>
      <div className="mt-6">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
