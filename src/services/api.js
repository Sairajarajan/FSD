import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 2000,
});

const STORAGE_KEY = "jobboard_local_db";

const defaultDb = {
  jobs: [
    {
      id: 1,
      title: "Frontend React Developer",
      company: "Nova Tech",
      location: "Remote",
      type: "Full-time",
      salaryMin: 70000,
      salaryMax: 95000,
      description: "Build and maintain modern React interfaces and collaborate with design and backend teams.",
    },
    {
      id: 2,
      title: "Backend Node.js Engineer",
      company: "CloudForge",
      location: "Austin",
      type: "Full-time",
      salaryMin: 80000,
      salaryMax: 110000,
      description: "Design REST APIs, optimize database queries, and improve backend reliability.",
    },
    {
      id: 3,
      title: "UI/UX Intern",
      company: "PixelMint",
      location: "New York",
      type: "Internship",
      salaryMin: 20000,
      salaryMax: 30000,
      description: "Support product designers with wireframes, prototypes, and design system updates.",
    },
  ],
  applications: [],
  users: [
    {
      id: 1,
      email: "admin@jobboard.com",
      password: "admin123",
      name: "Admin",
      role: "admin",
    },
  ],
};

function isNetworkError(error) {
  return Boolean(error?.isAxiosError && !error.response);
}

function readLocalDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return { ...defaultDb };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [...defaultDb.jobs],
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      users: Array.isArray(parsed.users) ? parsed.users : [...defaultDb.users],
    };
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return { ...defaultDb };
  }
}

function writeLocalDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function nextId(items) {
  const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return maxId + 1;
}

async function withLocalFallback(remoteAction, localAction) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return localAction();
  }

  try {
    return await remoteAction();
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    return localAction();
  }
}

export async function fetchJobs() {
  return withLocalFallback(
    async () => {
      const { data } = await api.get("/jobs");
      return data;
    },
    () => readLocalDb().jobs
  );
}

export async function fetchJobById(id) {
  return withLocalFallback(
    async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    },
    () => {
      const job = readLocalDb().jobs.find((item) => String(item.id) === String(id));
      if (!job) {
        throw new Error("Job not found");
      }
      return job;
    }
  );
}

export async function createApplication(payload) {
  return withLocalFallback(
    async () => {
      const { data } = await api.post("/applications", payload);
      return data;
    },
    () => {
      const db = readLocalDb();
      const newApplication = { id: nextId(db.applications), ...payload };
      db.applications.push(newApplication);
      writeLocalDb(db);
      return newApplication;
    }
  );
}

export async function fetchApplications() {
  return withLocalFallback(
    async () => {
      const { data } = await api.get("/applications");
      return data;
    },
    () => readLocalDb().applications
  );
}

export async function loginAdmin(email, password) {
  return withLocalFallback(
    async () => {
      const { data } = await api.get("/users", {
        params: {
          email,
          password,
          role: "admin",
        },
      });

      if (!data.length) {
        throw new Error("Invalid credentials");
      }

      return data[0];
    },
    () => {
      const admin = readLocalDb().users.find(
        (user) => user.email === email && user.password === password && user.role === "admin"
      );
      if (!admin) {
        throw new Error("Invalid credentials");
      }
      return admin;
    }
  );
}

export async function createJob(payload) {
  return withLocalFallback(
    async () => {
      const { data } = await api.post("/jobs", payload);
      return data;
    },
    () => {
      const db = readLocalDb();
      const newJob = { id: nextId(db.jobs), ...payload };
      db.jobs.push(newJob);
      writeLocalDb(db);
      return newJob;
    }
  );
}

export async function updateJob(id, payload) {
  return withLocalFallback(
    async () => {
      const { data } = await api.put(`/jobs/${id}`, payload);
      return data;
    },
    () => {
      const db = readLocalDb();
      const index = db.jobs.findIndex((job) => String(job.id) === String(id));
      if (index < 0) {
        throw new Error("Job not found");
      }
      const updated = { ...db.jobs[index], ...payload, id: db.jobs[index].id };
      db.jobs[index] = updated;
      writeLocalDb(db);
      return updated;
    }
  );
}

export async function deleteJob(id) {
  return withLocalFallback(
    async () => {
      await api.delete(`/jobs/${id}`);
    },
    () => {
      const db = readLocalDb();
      db.jobs = db.jobs.filter((job) => String(job.id) !== String(id));
      writeLocalDb(db);
    }
  );
}

export default api;
