import { Client, Account, ID , Databases , Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID


const account = new Account(client);
export const databases = new Databases(client);

// Example: Creating a new user
async function createUser() {
  try {
    const response = await account.create(
      ID.unique(), // Automatically generate a valid userId
      'email@example.com', // Email
      'yourpassword', // Password
      'John Doe' // Name (optional)
    );

    console.log('User created successfully:', response);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}



// Call the function to create a user
createUser();

export { ID, client, account , Query };
