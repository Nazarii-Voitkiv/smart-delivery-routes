import Link from "next/link";

export default function Orders() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">No orders available.</p>
      </div>
      <div className="mt-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
