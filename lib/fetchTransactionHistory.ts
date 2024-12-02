import { Client, Databases } from "appwrite";

// Initialize the Appwrite client and database
const client = new Client()
.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID

const databases = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!; // Replace with your database ID
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!; // Replace with your Orders Collection ID

export async function fetchTransactionHistory() {
  const response = await databases.listDocuments(databaseId, collectionId);
  const orders = response.documents;

  // Group orders by date and calculate total transactions per day
  const groupedData = orders.reduce((acc: any, order: any) => {
    const date = new Date(order.timestamp).toLocaleDateString("en-US");
    if (!acc[date]) {
      acc[date] = { date, desktop: 0, mobile: 0 };
    }
    // Assume desktop and mobile transactions are stored as order.desktop and order.mobile
    acc[date].desktop += order.desktop || 0;
    acc[date].mobile += order.mobile || 0;
    return acc;
  }, {});

  return Object.values(groupedData);
}
