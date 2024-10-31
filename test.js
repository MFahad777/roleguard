const AuthRealm = require("./dist");
const MongoDBStrategy = require("./dist/Stratagies/MongoDB/MongoDBStrategy");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pkgUser:B36ALc0vWxVuWTV6@personalcluster.8gybo.mongodb.net/?retryWrites=true&w=majority&appName=PersonalCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const authRealm = new AuthRealm();

    authRealm.use(new MongoDBStrategy(client, "sample_mflix","roles","users"));

    // await authRealm.removeRole("TestRole");

    // await authRealm.addRole({name:"TestRole", permissions:["EDIT","VIEW"]});

    const d = await authRealm.assignRoleToUser("59b99db4cfa9a34dcd7885b6", "TestRole");

    console.log(d);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);