const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const seedData = require("./db.json");

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(process.cwd(), ".env"));

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "jobportal";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI. Add it to backend/.env before starting the server.");
}

const schemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
};

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    description: { type: String, required: true, trim: true },
  },
  schemaOptions
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true, trim: true },
    coverLetter: { type: String, required: true, trim: true },
    appliedAt: { type: String, required: true, trim: true },
    status: { type: String, default: "submitted", trim: true },
  },
  schemaOptions
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
  },
  schemaOptions
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/jobs", async (_req, res) => {
  const jobs = await Job.find().sort({ createdAt: 1 });
  res.json(jobs);
});

app.get("/jobs/:id", async (req, res) => {
  const job = await findByIdOr404(Job, req.params.id, "Job");
  res.json(job);
});

app.post("/jobs", async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
});

app.put("/jobs/:id", async (req, res) => {
  ensureObjectId(req.params.id, "Job");
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  return res.json(job);
});

app.delete("/jobs/:id", async (req, res) => {
  ensureObjectId(req.params.id, "Job");
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await Application.deleteMany({ jobId: req.params.id });
  return res.sendStatus(204);
});

app.get("/applications", async (_req, res) => {
  const applications = await Application.find().sort({ createdAt: -1 });
  res.json(applications);
});

app.post("/applications", async (req, res) => {
  const application = await Application.create(req.body);
  res.status(201).json(application);
});

app.get("/users", async (req, res) => {
  const filters = {};

  if (req.query.email) {
    filters.email = String(req.query.email).trim().toLowerCase();
  }
  if (req.query.password) {
    filters.password = String(req.query.password);
  }
  if (req.query.role) {
    filters.role = String(req.query.role).trim();
  }

  const users = await User.find(filters).select("-password").sort({ createdAt: 1 });
  res.json(users);
});

app.use((error, _req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error?.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: `${error.path} not found` });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`MongoDB backend running on http://localhost:${PORT}`);
  });
}

async function seedDatabase() {
  const [jobCount, applicationCount, userCount] = await Promise.all([
    Job.countDocuments(),
    Application.countDocuments(),
    User.countDocuments(),
  ]);

  if (jobCount === 0 && Array.isArray(seedData.jobs) && seedData.jobs.length) {
    await Job.insertMany(
      seedData.jobs.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salaryMin: job.salaryMin ?? null,
        salaryMax: job.salaryMax ?? null,
        description: job.description,
      }))
    );
  }

  if (applicationCount === 0 && Array.isArray(seedData.applications) && seedData.applications.length) {
    await Application.insertMany(
      seedData.applications.map((application) => ({
        jobId: String(application.jobId),
        jobTitle: application.jobTitle,
        company: application.company,
        name: application.name,
        email: application.email,
        phone: application.phone,
        resumeUrl: application.resumeUrl,
        coverLetter: application.coverLetter,
        appliedAt: application.appliedAt,
        status: application.status || "submitted",
      }))
    );
  }

  if (userCount === 0 && Array.isArray(seedData.users) && seedData.users.length) {
    await User.insertMany(
      seedData.users.map((user) => ({
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
      }))
    );
  }
}

async function findByIdOr404(Model, id, label) {
  ensureObjectId(id, label);
  const document = await Model.findById(id);
  if (!document) {
    const error = new Error(`${label} not found`);
    error.statusCode = 404;
    throw error;
  }
  return document;
}

function ensureObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`${label} not found`);
    error.statusCode = 404;
    throw error;
  }
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

startServer().catch((error) => {
  console.error("Failed to start MongoDB backend:", error.message);
  process.exit(1);
});
