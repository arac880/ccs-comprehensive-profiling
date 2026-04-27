const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const { MongoClient } = require("mongodb");

const migrate = async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to Atlas!");

    const db = client.db("ccs_profiling_system");
    const faculties = db.collection("faculty");

    const updates = [
      {
        filter: { facultyId: "2203375" },
        data: {
          role: "Dean",
          middleName: "Santos",
          isDean: true,
          isChair: false,
        },
      },
      {
        filter: { facultyId: "2203374" },
        data: {
          role: "Faculty",
          middleName: "Escobar",
          isDean: false,
          isChair: false,
        },
      },
      {
        filter: { facultyId: "3001001" },
        data: {
          role: "Department Chair",
          middleName: "Reyes",
          isDean: false,
          isChair: true,
        },
      },
      {
        filter: { facultyId: "3001002" },
        data: {
          role: "Department Chair",
          middleName: "Lopez",
          isDean: false,
          isChair: false,
        },
      },
    ];

    for (const update of updates) {
      const result = await faculties.updateOne(update.filter, {
        $set: {
          role: update.data.role, // ←
          middleName: update.data.middleName, // ←
          gender: null,
          civilStatus: null,
          contactNumber: null,
          address: null,
          isDean: update.data.isDean,
          isChair: update.data.isChair,
        },
        $unset: {
          middleInitial: "", //
        },
      });
      console.log(
        `facultyId ${update.filter.facultyId}: ${result.modifiedCount} updated`,
      );
    }

    console.log("Migration done!");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await client.close();
  }
};

migrate();
