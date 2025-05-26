import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">LogistiX</h1>
      <div className="flex gap-4 mt-4">
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
