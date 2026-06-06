require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Database connection string from the first file setup
const mongoStr = process.env.MongoDB;

app.use(cors());
app.use(express.json());

const client = new MongoClient(mongoStr, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("City-Resolved");
    const usersCollection = database.collection("users");
    const issuesCollection = database.collection("issues");
    const timelinesCollection = database.collection("timelines");

    // ==========================================
    // USER ROUTES
    // ==========================================
    
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      const newUser = {
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: "citizen",
        isVerified: false,
        isBlocked: false,
        createdAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.patch('/users/profile/:email', async (req, res) => {
      const email = req.params.email;
      const { name, photo } = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          name: name,
          photo: photo
        }
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const role = req.query.role;
      let query = {};
      if (role) {
        query.role = role;
      }
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.patch('/users/status/:id', async (req, res) => {
      const id = req.params.id;
      const { isBlocked } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { isBlocked: isBlocked }
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Add staff directly to MongoDB (No Firebase SDK needed)
    app.post('/users/add-staff', async (req, res) => {
      const { name, email, photo } = req.body;
      try {
        const existing = await usersCollection.findOne({ email });
        if (existing) {
          return res.send({ success: false, message: "User already exists" });
        }

        const newStaff = {
          name: name,
          email: email,
          photo: photo,
          role: 'staff',
          isVerified: true,
          isBlocked: false,
          createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newStaff);
        res.send({ success: true, result });
      } catch (error) {
        console.error("Error creating staff:", error);
        res.status(500).send({ success: false, message: error.message });
      }
    });

    app.patch('/users/info/:id', async (req, res) => {
      const id = req.params.id;
      const { name, email } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: name,
          email: email
        }
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // ==========================================
    // ISSUE ROUTES
    // ==========================================

    app.post("/issues", async (req, res) => {
      const issue = req.body;
      const userEmail = issue.reportedBy?.email;

      const user = await usersCollection.findOne({ email: userEmail });

      if (user?.isBlocked) {
        return res.status(403).send({ message: "You are blocked from posting issues." });
      }

      // Checking the limit of free posts
      if (user && !user.isVerified) {
        const count = await issuesCollection.countDocuments({
          "reportedBy.email": userEmail,
        });

        if (count >= 3) {
          return res.send({
            insertedId: null,
            message: "Free limit reached.",
          });
        }
      }

      const newIssue = {
        ...issue,
        status: "pending",
        priority: "normal",
        upvotes: 0,
        upvotedBy: [],
        createdAt: new Date(),
      };

      const result = await issuesCollection.insertOne(newIssue);

      const timelineEntry = {
        issueId: result.insertedId,
        status: "pending",
        message: "Issue reported by citizen",
        updatedBy: user?.name || "Citizen",
        role: "citizen",
        date: new Date(),
      };

      await timelinesCollection.insertOne(timelineEntry);
      res.send(result);
    });

    app.get("/issues", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12; 
      const skip = (page - 1) * limit;

      const { search, status, category } = req.query;
      let query = {};

      if (search) query.title = { $regex: search, $options: 'i' };
      if (status) query.status = status;
      if (category) query.category = category;

      const total = await issuesCollection.countDocuments(query);
      const result = await issuesCollection.find(query)
        .sort({ priority: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      res.send({ issues: result, total });
    });

    app.get('/issues/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await issuesCollection.findOne(query);
      res.send(result);
    });

    app.delete('/issues/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await issuesCollection.deleteOne(query);
      res.send(result);
    });

    app.patch('/issues/:id', async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: item.title,
          description: item.description,
          category: item.category,
          location: item.location,
          ...(item.photo && { photo: item.photo }) 
        }
      };
      const result = await issuesCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch('/issues/upvote/:id', async (req, res) => {
      const id = req.params.id;
      const { userEmail } = req.body;
      const filter = { _id: new ObjectId(id) };
      const issue = await issuesCollection.findOne(filter);

      if (!issue) return res.status(404).send({ message: "Issue not found" });
      if (issue.reportedBy?.email === userEmail) {
        return res.send({ message: "You cannot upvote your own issue." });
      }
      if (issue.upvotedBy?.includes(userEmail)) {
        return res.send({ message: "You have already upvoted this issue." });
      }

      const updateDoc = {
        $inc: { upvotes: 1 },
        $push: { upvotedBy: userEmail }
      };

      const result = await issuesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.get("/my-issues/:email", async (req, res) => {
      const email = req.params.email;
      const result = await issuesCollection
        .find({ "reportedBy.email": email })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    // ==========================================
    // STAFF & ADMIN ACTIONS ON ISSUES
    // ==========================================

    app.patch('/issues/:id/assign', async (req, res) => {
      const id = req.params.id;
      const { staffId, staffName, staffEmail, staffPhoto } = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          assignedStaff: {
            staffId,
            name: staffName,
            email: staffEmail,
            photo: staffPhoto
          },
          status: 'in-progress'
        }
      };
      
      const result = await issuesCollection.updateOne(filter, updateDoc);

      await timelinesCollection.insertOne({
        issueId: new ObjectId(id),
        status: 'in-progress',
        message: `Issue assigned to Staff: ${staffName}`,
        updatedBy: 'Admin',
        role: 'admin',
        date: new Date()
      });

      res.send(result);
    });

    app.patch('/issues/:id/reject', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { status: 'rejected' }
      };
      const result = await issuesCollection.updateOne(filter, updateDoc);

      await timelinesCollection.insertOne({
        issueId: new ObjectId(id),
        status: 'rejected',
        message: 'Issue rejected by Admin',
        updatedBy: 'Admin',
        role: 'admin',
        date: new Date()
      });

      res.send(result);
    });

    app.patch('/issues/status/:id', async (req, res) => {
      const id = req.params.id;
      const { status, userEmail, userName } = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status: status } };
      const result = await issuesCollection.updateOne(filter, updateDoc);

      await timelinesCollection.insertOne({
        issueId: new ObjectId(id),
        status: status,
        message: `Status changed to ${status}`,
        updatedBy: userName,
        role: 'staff',
        date: new Date()
      });

      res.send(result);
    });

    app.get('/issues/assigned/:email', async (req, res) => {
      const email = req.params.email;
      const result = await issuesCollection.find({ 'assignedStaff.email': email })
        .sort({ priority: 1, createdAt: -1 })
        .toArray();
      res.send(result);
    });

    app.get('/issues/resolved/recent', async (req, res) => {
      const result = await issuesCollection.find({ status: 'resolved' })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // ==========================================
    // TIMELINES
    // ==========================================
    
    app.get('/timelines/:issueId', async (req, res) => {
      const issueId = req.params.issueId;
      const query = { issueId: new ObjectId(issueId) };
      const result = await timelinesCollection.find(query).sort({ date: -1 }).toArray();
      res.send(result);
    });

    // ==========================================
    // STATS & DASHBOARDS
    // ==========================================

    app.get("/admin-stats", async (req, res) => {
      const totalUsers = await usersCollection.estimatedDocumentCount();
      const totalIssues = await issuesCollection.estimatedDocumentCount();

      const pendingIssues = await issuesCollection.countDocuments({ status: "pending" });
      const resolvedIssues = await issuesCollection.countDocuments({ status: "resolved" });

      res.send({
        totalUsers,
        totalIssues,
        pendingIssues,
        resolvedIssues,
      });
    });

    app.get('/staff-stats/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'assignedStaff.email': email };
      
      const totalAssigned = await issuesCollection.countDocuments(query);
      const totalResolved = await issuesCollection.countDocuments({ ...query, status: 'resolved' });
      const totalClosed = await issuesCollection.countDocuments({ ...query, status: 'closed' });

      res.send({ totalAssigned, totalResolved, totalClosed });
    });

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Server running"));

app.listen(port, () => console.log(`Listening on port ${port}`));