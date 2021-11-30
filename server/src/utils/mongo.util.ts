import mongoose from "mongoose";

/**
 * Connect to the database using the connection string
 * passed to the function
 *
 * @param   {String} connString mongoDB connection string
 * @return  void
 */

const connectToDB = async (connString: string): Promise<void> => {
  try {
    const conn = await mongoose.connect(connString);
    console.log(`--> Connected to MongoDB on ${conn.connection.host}`);
  } catch (err) {
    console.log(`Can't connect to Mongo DB\nError: ${err}`);
    process.exit(1);
  }
};

export { connectToDB };
