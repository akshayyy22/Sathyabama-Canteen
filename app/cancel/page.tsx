"use client"
import { useRouter } from 'next/navigation';

const CancelPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto my-8 p-4 text-center">
      <h1 className="text-2xl font-semibold mb-4 text-red-600">Payment Canceled</h1>
      <p className="mb-4">Your payment was not completed. If this was a mistake, you can try again.</p>

      <div className="flex justify-center space-x-4 mt-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={() => router.push('/cart')}
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
