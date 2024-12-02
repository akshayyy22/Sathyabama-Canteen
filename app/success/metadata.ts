import { Metadata } from "next";
import { Client, Databases, Query } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const databases = new Databases(client);

// Generate Metadata for the Success Page
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { session_id?: string };
}): Promise<Metadata> {
  const sessionId = searchParams.session_id as string;

  if (!sessionId) {
    return { title: "Order Success" };
  }

  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
    [Query.equal("customerId", sessionId)]
  );

  if (response.documents.length > 0) {
    return { title: `Order ${response.documents[0].$id}` };
  }

  return { title: "Order Not Found" };
}

// Default Export is for server-side rendering, metadata generation, etc.
export default function MetadataPage() {
  return null; // No UI needed
}
