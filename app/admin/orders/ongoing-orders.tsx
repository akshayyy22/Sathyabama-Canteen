"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Client, Databases, Query } from "appwrite";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import QRCodeImage from "@/components/QRCodeImage"; // Import the QRCodeImage component

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const databases = new Databases(client);

// Define Order type
type Order = {
  orderId: string;
  customerId: string;
  stallId: string;
  items: string[];
  totalAmount: number;
  orderStatus: string;
  qrCode: string;
  paymentStatus: string;
  timestamp: string;
};

// Define columns for the table
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      const orderId = row.getValue("orderId") as string;
      return (
        <Tooltip content={orderId}>
          <span>{orderId}</span>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
    cell: ({ row }) => {
      const customerId = row.getValue("customerId") as string;
      return (
        <Tooltip content={customerId}>
          <span>{customerId}</span>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as string[];
      if (!items || items.length === 0) {
        return <div>No items</div>;
      }
      return (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const totalAmount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(totalAmount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "qrCode",
    header: "QR Code",
    cell: ({ row }) => {
      const qrCode = row.getValue("qrCode") as string;
      const qrCodeUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${qrCode}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;

      return (
        <div style={{ cursor: "pointer" }}>
          <QRCodeImage src={qrCodeUrl} alt="QR Code" className="inline" />
        </div>
      );
    },
  },
];

export default function OngoingOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterById, setFilterById] = useState<string>("");
  const [sortByTimestamp, setSortByTimestamp] = useState<string>("latest");

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
          [Query.equal("orderStatus", "pending")]
        );

        const fetchedOrders: Order[] = response.documents.map((doc: any) => {
          return {
            orderId: doc.$id,
            customerId: doc.customerId,
            stallId: doc.stallId,
            items: doc.items || [],
            totalAmount: doc.totalAmount,
            orderStatus: doc.orderStatus,
            qrCode: doc.qrCode,
            paymentStatus: doc.paymentStatus,
            timestamp: doc.$createdAt,
          };
        });

        // Apply filtering by order ID
        const filteredOrders = filterById
          ? fetchedOrders.filter((order) => order.orderId.includes(filterById))
          : fetchedOrders;

        // Apply sorting by timestamp
        const sortedOrders = sortByTimestamp === "latest"
          ? filteredOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          : filteredOrders.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load pending orders");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, [filterById, sortByTimestamp]);

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-white text-2xl mb-4">Ongoing Orders</h1>
      <div className="mb-4">        {/* Filter by Order ID */}
        <Input
          placeholder="Filter by Order ID..."
          value={filterById}
          onChange={(event) => setFilterById(event.target.value)}
        />

        
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
