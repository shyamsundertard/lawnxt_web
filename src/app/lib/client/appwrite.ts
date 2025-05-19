import { Client, Account, ID } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const account = new Account(client);

  export const getCurrentUserDetails = async () => {
    try {
      const user =  await account.get();
      return user
    } catch (error) {
      console.error('Error getting user:', error);
    }
  };
  

export { client, account, ID};