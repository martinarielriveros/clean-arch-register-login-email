import mongoose from "mongoose";

interface MongoConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(
    options: MongoConnectionOptions
  ): Promise<mongoose.Mongoose> {
    const { mongoUrl, dbName } = options;

    console.log(mongoUrl);

    try {
      const mongooseInstance = await mongoose.connect(mongoUrl, {
        dbName,
      });
      console.log(
        `There is ${mongooseInstance.connection.readyState} instance connected`
      );

      return mongooseInstance;
    } catch (error) {
      console.log(`There has been an error connecting to: ${dbName}`);
      throw error;
    }
  }

  static async disconnect() {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
}
