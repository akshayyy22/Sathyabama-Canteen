"use client"

import { useState } from 'react';

type MenuItem = {
  name: string;
  price: number;
  inStock: boolean;
};

const menuItems: MenuItem[] = [
  { name: 'FRENCH FRIES', price: 50, inStock: true },
  { name: 'FULL GRILLED CHICKEN', price: 350, inStock: true },
  { name: 'GRILLED BOILED EGG', price: 30, inStock: false },
  { name: 'GRILLED CHEESE SANDWICH', price: 80, inStock: true },
  { name: 'GRILLED CHICKEN SANDWICH', price: 120, inStock: false },
  { name: 'GRILLED OMELETTE SANDWICH', price: 90, inStock: true },
  { name: 'GRILLED VEG SANDWICH', price: 70, inStock: true },
  { name: 'HALF GRILLED CHICKEN', price: 180, inStock: true },
  { name: 'HOTDOG BURGER', price: 150, inStock: false },
  { name: 'POTATO CHEESE SHOTS (6 Nos)', price: 60, inStock: true },
  { name: 'CHICKEN POPCORN (10 Nos)', price: 70, inStock: true },
  { name: 'NON VEG CLUB SANDWICH', price: 150, inStock: true },
  { name: 'PANEER SAMOSA (3 Nos)', price: 50, inStock: false },
  { name: 'PANEER PATTY BURGER', price: 130, inStock: true },
  { name: 'PERI PERI SHAWARMA', price: 120, inStock: true },
  { name: 'PLAIN SHAWARMA', price: 100, inStock: true },
  { name: 'PLAIN VEG SANDWICH', price: 60, inStock: true },
  { name: 'POTATO SMILEY', price: 40, inStock: false },
  { name: 'QUARTER GRILLED CHICKEN', price: 100, inStock: true },
  { name: 'SCHEZWAN SHAWARMA', price: 130, inStock: true },
  { name: 'SPECIAL SHAWARMA', price: 150, inStock: true },
  { name: 'VEG BURGER', price: 90, inStock: true },
  { name: 'VEG SAMOSA (3 Nos)', price: 40, inStock: false },
  { name: 'VEG SPECIAL SANDWICH', price: 80, inStock: true },
  { name: 'VEG SPRING ROLL', price: 60, inStock: true },
];

const Menu = () => {
  const [order, setOrder] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);

  const handleAddToOrder = (item: MenuItem) => {
    if (!item.inStock) return;
    const updatedOrder = { ...order, [item.name]: (order[item.name] || 0) + 1 };
    setOrder(updatedOrder);
    setTotal(total + item.price);
  };

  const handleRemoveFromOrder = (item: MenuItem) => {
    if (!item.inStock || !order[item.name]) return;
    const updatedOrder = { ...order, [item.name]: order[item.name] - 1 };
    if (updatedOrder[item.name] <= 0) {
      delete updatedOrder[item.name];
    }
    setOrder(updatedOrder);
    setTotal(total - item.price);
  };

  const handlePlaceOrder = () => {
    alert(`Order placed! Total: ₹${total}`);
    setOrder({});
    setTotal(0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8 bg-base-300 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Menu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`p-6 border rounded-lg shadow-lg ${
                item.inStock ? 'bg-black-base-300' : 'bg-red-500'
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">{item.name}</h2>
              <p className="text-lg mb-4">₹{item.price}</p>
              <div className="flex items-center justify-between">
                {item.inStock ? (
                  <>
                    <button
                      className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleRemoveFromOrder(item)}
                    >
                      -
                    </button>
                    <span className="text-lg">{order[item.name] || 0}</span>
                    <button
                      className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handleAddToOrder(item)}
                    >
                      +
                    </button>
                  </>
                ) : (
                  <span className="text-lg font-bold text-red-300">Not Available</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Your Order</h2>
          {Object.keys(order).length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="list-disc ml-5 mb-4">
                {Object.entries(order).map(([name, qty]) => (
                  <li key={name} className="mb-2">
                    {name} x {qty}
                  </li>
                ))}
              </ul>
              <h3 className="text-xl font-bold mb-4">Total: ₹{total}</h3>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
