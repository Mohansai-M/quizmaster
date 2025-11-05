import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.dev"
  );
}


let cached = global._mongoClient;

if (!cached) {
  cached = global._mongoClient = { client: null, promise: null };
}

export async function connectDB() {
  if (cached.client) return cached.client;

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cached.promise = client.connect();
  }

  cached.client = await cached.promise;
  return cached.client;
}

export async function getDB() {
  const client = await connectDB();
  return client.db("quizmaster"); 
}
