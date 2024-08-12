const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('SampleDatabase');
        const collection = database.collection('SampleCollection');

        if (req.method === 'POST') {
            const data = req.body;

            if (!data || Object.keys(data).length === 0) {
                context.res = {
                    status: 400,
                    body: "Please pass valid data in the request body"
                };
                return;
            }

            const result = await collection.insertOne(data);

            context.res = {
                status: 201,
                body: {
                    message: "Document inserted successfully",
                    insertedId: result.insertedId
                }
            };
        } else {
            context.res = {
                status: 405,
                body: "Method not allowed. Please use POST."
            };
        }
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
