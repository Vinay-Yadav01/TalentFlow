import localforage from "localforage";

// Configure localforage
localforage.config({
  name: "TalentFlow",
  storeName: "jobs",
});

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Initial job data for demo
const initialJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    tags: ["React", "TypeScript", "Tailwind"],
    status: "active",
    slug: "senior-frontend-developer",
    description:
      "We are looking for an experienced frontend developer to join our team.",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    order: 1,
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    title: "Backend Engineer",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    status: "active",
    slug: "backend-engineer",
    description: "Join our backend team to build scalable APIs and services.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    order: 2,
    createdAt: new Date("2024-01-02").toISOString(),
    updatedAt: new Date("2024-01-02").toISOString(),
  },
  {
    id: "3",
    title: "Product Manager",
    tags: ["Strategy", "Analytics", "Agile"],
    status: "active",
    slug: "product-manager",
    description: "Lead product strategy and work with cross-functional teams.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    order: 3,
    createdAt: new Date("2024-01-03").toISOString(),
    updatedAt: new Date("2024-01-03").toISOString(),
  },
  {
    id: "4",
    title: "UX Designer",
    tags: ["Figma", "Design Systems", "User Research"],
    status: "archived",
    slug: "ux-designer",
    description: "Create beautiful and intuitive user experiences.",
    location: "Remote",
    type: "Contract",
    salary: "$70,000 - $90,000",
    order: 4,
    createdAt: new Date("2024-01-04").toISOString(),
    updatedAt: new Date("2024-01-04").toISOString(),
  },
];

class JobsService {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Check if we have existing data
    const existingJobs = await localforage.getItem("jobs");
    if (!existingJobs) {
      // Initialize with demo data
      await localforage.setItem("jobs", initialJobs);
    }
    this.initialized = true;
  }

  async getJobs({ page = 1, pageSize = 8, search = "", status = "all" } = {}) {
    await this.init();

    let jobs = (await localforage.getItem("jobs")) || [];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (status !== "all") {
      jobs = jobs.filter((job) => job.status === status);
    }

    // Sort by order
    jobs.sort((a, b) => a.order - b.order);

    // Paginate
    const total = jobs.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = jobs.slice(start, end);

    return {
      jobs: paginatedJobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getJobById(id) {
    await this.init();
    const jobs = (await localforage.getItem("jobs")) || [];
    return jobs.find((job) => job.id === id || job.slug === id);
  }

  async createJob(jobData) {
    await this.init();

    if (!jobData.title) {
      throw new Error("Title is required");
    }

    const jobs = (await localforage.getItem("jobs")) || [];
    const slug = jobData.slug || generateSlug(jobData.title);

    // Check slug uniqueness
    if (jobs.some((job) => job.slug === slug)) {
      throw new Error("A job with this slug already exists");
    }

    const newJob = {
      id: Date.now().toString(),
      title: jobData.title,
      tags: jobData.tags || [],
      status: "active",
      slug,
      description: jobData.description || "",
      location: jobData.location || "",
      type: jobData.type || "Full-time",
      salary: jobData.salary || "",
      order: jobs.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jobs.push(newJob);
    await localforage.setItem("jobs", jobs);

    return newJob;
  }

  async updateJob(id, jobData) {
    await this.init();
    const jobs = (await localforage.getItem("jobs")) || [];
    const jobIndex = jobs.findIndex((job) => job.id === id);

    if (jobIndex === -1) {
      throw new Error("Job not found");
    }

    const existingJob = jobs[jobIndex];
    const slug =
      jobData.slug || generateSlug(jobData.title || existingJob.title);

    // Check slug uniqueness (excluding current job)
    if (
      slug !== existingJob.slug &&
      jobs.some((job) => job.id !== id && job.slug === slug)
    ) {
      throw new Error("A job with this slug already exists");
    }

    jobs[jobIndex] = {
      ...existingJob,
      ...jobData,
      slug,
      updatedAt: new Date().toISOString(),
    };

    await localforage.setItem("jobs", jobs);
    return jobs[jobIndex];
  }

  async updateJobStatus(id, status) {
    return this.updateJob(id, { status });
  }

  async reorderJobs(jobIds) {
    await this.init();
    const jobs = (await localforage.getItem("jobs")) || [];

    // Update order based on new position
    jobIds.forEach((id, index) => {
      const job = jobs.find((j) => j.id === id);
      if (job) {
        job.order = index + 1;
        job.updatedAt = new Date().toISOString();
      }
    });

    await localforage.setItem("jobs", jobs);
    return jobs;
  }

  // For deterministic testing
  async reset() {
    await localforage.clear();
    this.initialized = false;
  }

  async seed(testJobs) {
    await localforage.setItem("jobs", testJobs);
    this.initialized = true;
  }
}

export const jobsService = new JobsService();
