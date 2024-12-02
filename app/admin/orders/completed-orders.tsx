import { useEffect, useState } from "react";
import { Client, Databases, Query } from "appwrite";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"; // Import your table components
import QRCodeImage from "@/components/QRCodeImage"; // Import the QRCodeImage component
import { Input } from "@/components/ui/input";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const databases = new Databases(client);

interface Order {
  orderId: string;
  customerId: string;
  stallId: string;
  items: string[];
  totalAmount: number;
  orderStatus: string;
  qrCode: string;
  paymentStatus: string;
  timestamp: string;
}

const CompletedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(""); // Add a state for filter input

  const fetchCompletedOrders = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
        [Query.equal("orderStatus", "completed")]
      );

      const fetchedOrders: Order[] = response.documents.map((doc: any) => {
        return {
          orderId: doc.$id,
          customerId: doc.customerId,
          stallId: doc.stallId,
          items: doc.items || [], // Ensure items is an array
          totalAmount: doc.totalAmount,
          orderStatus: doc.orderStatus,
          qrCode: doc.qrCode,
          paymentStatus: doc.paymentStatus,
          timestamp: doc.$createdAt,
        };
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching completed orders:", error);
      setError("Failed to load completed orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  // Function to handle filtering the orders
  const filteredOrders = orders.filter((order) => {
    const filterValue = filter.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(filterValue) ||
      order.customerId.toLowerCase().includes(filterValue)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse rounded-full bg-gray-500 h-12 w-12"></div>
        <div className="space-y-2">
          <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[200px]"></div>
          <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[170px]"></div>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-white text-2xl mb-4">Completed Orders</h1>

      {/* Filter Input */}
      <div className="mb-4">

         {/* Filter by Order ID */}
         <Input
          placeholder="Filter by Order ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Update filter state
        />
      </div>

      <div className="rounded-lg border border-gray-700 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>QR Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const qrCodeUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${order.qrCode}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;

                return (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customerId}</TableCell>
                    <TableCell>{order.items.join(", ")}</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell>
                      <QRCodeImage
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="inline cursor-pointer" // Add cursor style for interactivity
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompletedOrders;
