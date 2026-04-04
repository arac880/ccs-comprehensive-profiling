require("dotenv").config();
const { MongoClient } = require("mongodb");

async function migrate() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db("ccs_profiling_system");
    const students = await db.collection("students").find().toArray();

    let updatedCount = 0;

    for (const student of students) {
      const updates = {};

      // skills: string → { name, category }
      if (Array.isArray(student.skills) && student.skills.length > 0) {
        const converted = student.skills.map((item) => {
          if (typeof item === "string") return { name: item, category: "" };
          if (item && typeof item === "object" && item.name) return { name: item.name, category: item.category || "" };
          return null;
        }).filter(Boolean);
        updates.skills = converted;
      }

      // organizations: string → { orgName, memberType, membershipDate }
      if (Array.isArray(student.organizations) && student.organizations.length > 0) {
        const converted = student.organizations.map((item) => {
          if (typeof item === "string") return { orgName: item, memberType: "", membershipDate: "" };
          if (item && typeof item === "object" && item.orgName) return { orgName: item.orgName, memberType: item.memberType || "", membershipDate: item.membershipDate || "" };
          if (item && typeof item === "object" && item.name) return { orgName: item.name, memberType: item.memberType || "", membershipDate: item.membershipDate || "" };
          return null;
        }).filter(Boolean);
        updates.organizations = converted;
      }

      // sports: string → { sportName, position, level }
      if (Array.isArray(student.sports) && student.sports.length > 0) {
        const converted = student.sports.map((item) => {
          if (typeof item === "string") return { sportName: item, position: "", level: "" };
          if (item && typeof item === "object" && item.sportName) return { sportName: item.sportName, position: item.position || "", level: item.level || "" };
          if (item && typeof item === "object" && item.name) return { sportName: item.name, position: item.position || "", level: item.level || "" };
          return null;
        }).filter(Boolean);
        updates.sports = converted;
      }

      // activities: string → { title, category, date, description }
      if (Array.isArray(student.activities) && student.activities.length > 0) {
        const converted = student.activities.map((item) => {
          if (typeof item === "string") return { title: item, category: "", date: "", description: "" };
          if (item && typeof item === "object" && item.title) return { title: item.title, category: item.category || "", date: item.date || "", description: item.description || "" };
          if (item && typeof item === "object" && item.name) return { title: item.name, category: item.category || "", date: item.date || "", description: item.description || "" };
          return null;
        }).filter(Boolean);
        updates.activities = converted;
      }

      if (Object.keys(updates).length > 0) {
        await db.collection("students").updateOne(
          { _id: student._id },
          { $set: updates }
        );
        updatedCount++;
      }
    }

    console.log(`Migration complete — ${updatedCount} students updated`);
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    await client.close();
  }
}

migrate();