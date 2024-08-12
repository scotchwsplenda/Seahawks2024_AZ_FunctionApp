const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('SampleDatabase');
        const collection = database.collection('SampleCollection');

        // Sample query to fetch all documents
        const items = await collection.find({}).toArray();

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: items
        };
    } catch (err) {
        context.log('Error connecting to MongoDB:', err);
        context.res = {
            status: 500,
            body: "Error connecting to MongoDB"
        };
    } finally {
        await client.close();
    }
};
