import React, { useEffect, useState } from "react";
import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "@headlessui/react";
import { account, databases } from "@/lib/appwrite";
import clsx from "clsx";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await account.get(); // Fetch logged-in user's data
        setUser({ name: response.name, email: response.email });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Save additional user data to Appwrite database
      await databases.createDocument(
        databaseId, // Database ID from .env
        collectionId, // Collection ID from .env
        "unique()", // Generate a unique document ID
        {
          email: user.email,
          phone,
          department,
          yearOfStudy,
        }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save user data:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-lg px-4 ">
        <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
          <Legend className="text-base/7 font-semibold text-white">
            Profile Details
          </Legend>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Full Name</Label>
            <Input
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              value={user.name}
              readOnly
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">
              Email Address
            </Label>
            <Input
              type="email"
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              value={user.email}
              readOnly
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">
              Phone Number
            </Label>
            <Input
              type="tel"
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              placeholder="+1 234 567 8901"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Department</Label>
            <Input
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              placeholder="Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Year of Study</Label>
            <div className="relative">
              <Select
                className={clsx(
                  "mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  "*:text-black"
                )}
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </Select>
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                aria-hidden="true"
              />
            </div>
          </Field>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              Save changes
            </Button>
          </div>
        </Fieldset>
      </div>
    </div>
  );
}
