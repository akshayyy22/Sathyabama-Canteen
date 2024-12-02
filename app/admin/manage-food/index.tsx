"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // Adjust import path
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@headlessui/react";
import clsx from "clsx";

import { client, databases } from "@/lib/appwrite"; // Adjust import path as needed

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FOOD_COLLECTION_ID!;

const ManageFoodPage = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [selectedStall, setSelectedStall] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [foodPrice, setFoodPrice] = useState<string>("");
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true); // Added availability status
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      setFoodItems(response.documents);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert foodPrice to a float
      const price = parseFloat(foodPrice);

      if (isNaN(price)) {
        throw new Error("Price must be a valid number");
      }

      if (editingItem) {
        // Update item
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          editingItem.$id,
          {
            name: foodName,
            price: price, // Use the float value
            stallId: selectedStall,
            availabilityStatus: availabilityStatus,
          }
        );
      } else {
        // Add new item
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", {
          name: foodName,
          price: price, // Use the float value
          stallId: selectedStall,
          availabilityStatus: availabilityStatus,
        });
      }
      fetchFoodItems(); // Refresh the list
      resetForm();
    } catch (error) {
      console.error("Error saving food item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      fetchFoodItems(); // Refresh the list
    } catch (error) {
      console.error("Error deleting food item:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFoodName("");
    setFoodPrice("");
    setSelectedStall("");
    setAvailabilityStatus(true); // Reset availability status
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setFoodName(item.name);
    setFoodPrice(item.price.toString()); // Ensure price is a string for the input field
    setSelectedStall(item.stallId);
    setAvailabilityStatus(item.availabilityStatus);
    setEditingItem(item);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Food Items</h1>
      <form onSubmit={handleAddOrUpdate} className="mb-4">
        <div className="grid gap-4 mb-4">
          <div>
            <Label htmlFor="stall">Stall</Label>
            <Select
              name="status"
              aria-label="Project status"
              id="stall"
              value={selectedStall}
              onChange={(e) => setSelectedStall(e.target.value)}
              required
              className={clsx(
                "mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                // Make the text of each option black on Windows
                "*:text-black"
              )}
            >
              <option value="" disabled>
                Select a stall
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              {/* Add more stalls as needed */}
            </Select>
          </div>
          <div>
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01" // Ensure decimal values are allowed
              value={foodPrice}
              onChange={(e) => setFoodPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Select
              name="status"
              aria-label="Project status"
              id="availability"
              value={availabilityStatus ? "Available" : "Not Available"}
              onChange={(e) =>
                setAvailabilityStatus(e.target.value === "Available")
              }
              required
              className={clsx(
                "mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                // Make the text of each option black on Windows
                "*:text-black"
              )}
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {editingItem ? "Update Item" : "Add Item"}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="animate-pulse rounded-full bg-gray-500 h-12 w-12"></div>
                  <div className="space-y-2">
                    <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[200px]"></div>
                    <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[170px]"></div>
                  </div>
                </div>
              ))
          : foodItems.map((item) => (
              <div key={item.$id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title font-semibold">{item.name}</h2>
                  <p className="text-sm">Price: ₹{item.price.toFixed(2)}</p>
                  <p className="text-sm">Stall No: {item.stallId}</p>
                  <p className="text-sm">
                    Availability:{" "}
                    {item.availabilityStatus ? "Available" : "Not Available"}
                  </p>
                  <div className="card-actions justify-end space-x-2">
                    {/* Edit Button */}
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      className="btn text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2"
                    >
                      Edit
                    </Button>

                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDelete(item.$id)}
                      variant="secondary"
                      className="btn text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ManageFoodPage;
