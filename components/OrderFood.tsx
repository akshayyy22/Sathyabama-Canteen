"use client";
import React, { useState, useEffect } from "react";
import { databases, Query } from '@/lib/appwrite';
import { loadStripe } from '@stripe/stripe-js';

// Define types
type MenuItem = {
  name: string;
  price: number;
  availabilityStatus: boolean;
};

type Stall = {
  number: number;
  name: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StallsPage() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [order, setOrder] = useState<{ [key: number]: { [item: string]: { quantity: number; price: number } } }>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_FOOD_COLLECTION_ID!;

  const stalls: Stall[] = [
    { number: 1, name: "Stall 1" },
    { number: 2, name: "Stall 2" },
    { number: 3, name: "Stall 3" },
    { number: 4, name: "Stall 4" },
    { number: 5, name: "Stall 5" },
    { number: 6, name: "Stall 6" },
    { number: 7, name: "Stall 7" },
  ];

  useEffect(() => {
    const fetchMenuItems = async (stallNumber: number) => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal('stallId', stallNumber.toString()) // Ensure the correct stallId is queried
        ]);
        const data: MenuItem[] = response.documents.map((doc: any) => ({
          name: doc.name,
          price: doc.price,
          availabilityStatus: doc.availabilityStatus,
        }));
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items');
      }
    };

    fetchMenuItems(activeTab);
  }, [activeTab]);

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  const handleAddToOrder = (stallNumber: number, item: string, price: number) => {
    setOrder((prevOrder) => {
      const currentStallOrder = prevOrder[stallNumber] || {};
      const currentItem = currentStallOrder[item] || { quantity: 0, price };
      return {
        ...prevOrder,
        [stallNumber]: { 
          ...currentStallOrder, 
          [item]: { quantity: currentItem.quantity + 1, price: currentItem.price }
        },
      };
    });
  };

  const handleRemoveFromOrder = (stallNumber: number, item: string) => {
    setOrder((prevOrder) => {
      const currentStallOrder = prevOrder[stallNumber] || {};
      const currentItem = currentStallOrder[item] || { quantity: 0, price: 0 };
      if (currentItem.quantity > 0) {
        return {
          ...prevOrder,
          [stallNumber]: { 
            ...currentStallOrder, 
            [item]: { quantity: currentItem.quantity - 1, price: currentItem.price }
          },
        };
      }
      return prevOrder;
    });
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const customer = {
        name: 'John Doe', // Replace with actual customer name
        email: 'john.doe@example.com', // Replace with actual customer email
        address: '123 Main Street, City, State, ZIP', // Replace with actual customer address
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: Object.entries(order[activeTab] || {}).map(([item, { quantity, price }]) => ({
            name: item,
            quantity,
            price,
          })),
          totalAmount: calculateTotal(activeTab),
          orderId: `order-${Date.now()}`, // Generate unique order ID
          stallId: activeTab.toString(), // Convert stallNumber (activeTab) to string
          customer,
        }),
      });

      const { id } = await response.json();
      const stripe = await stripePromise;

      if (id && stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) {
          console.error('Stripe Checkout error:', error);
          alert('Failed to redirect to Stripe Checkout');
        }
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (stallNumber: number) => {
    const stallOrder = order[stallNumber] || {};
    return Object.values(stallOrder).reduce((total, { quantity, price }) => total + quantity * price, 0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {stalls.map((stall) => (
          <button
            key={stall.number}
            className={`p-4 ${
              activeTab === stall.number
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => handleTabClick(stall.number)}
          >
            <span className="hidden sm:inline">{stall.name}</span>
            <span className="inline sm:hidden">{stall.number}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">{stalls.find(stall => stall.number === activeTab)?.name} Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="card bg-base-100 w-96 shadow-xl"
                >
                  <div className="card-body">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    {item.availabilityStatus ? (
                      <div className="card-actions justify-end mt-2">
                        <button
                          onClick={() =>
                            handleRemoveFromOrder(activeTab, item.name)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="mx-2 text-lg">
                          {order[activeTab]?.[item.name]?.quantity || 0}
                        </span>
                        <button
                          onClick={() =>
                            handleAddToOrder(activeTab, item.name, item.price)
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <p className="text-red-700 mt-2">Out of Stock</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Your Cart:</h3>
              {Object.entries(order[activeTab] || {}).filter(([_, { quantity }]) => quantity > 0).length > 0 ? (
                <div>
                  <ul className="list-disc ml-4">
                    {Object.entries(order[activeTab] || {}).map(
                      ([orderedItem, { quantity, price }]) =>
                        quantity > 0 && (
                          <li key={orderedItem} className="flex justify-between">
                            <span>{orderedItem} - ₹{price} x{quantity}</span>
                            <span className="font-semibold">₹{price * quantity}</span>
                          </li>
                        )
                    )}
                  </ul>
                  <div className="mt-4">
                    <p className="text-lg font-bold">Total: ₹{calculateTotal(activeTab)}</p>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className={`${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white px-4 py-2 rounded mt-2`}
                    >
                      {isLoading ? "Placing Order..." : "Place Order"}
                    </button>
                  </div>
                </div>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
