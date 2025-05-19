import { Client, ID, Databases, Storage, Account, Users } from "node-appwrite";

const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const sessionClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

const serverAccount = new Account(serverClient);
const sessionAccount = new Account(sessionClient);
const databases = new Databases(serverClient);
const storage = new Storage(serverClient);
const users = new Users(serverClient);

export { ID, databases, storage, serverAccount, sessionAccount, users};