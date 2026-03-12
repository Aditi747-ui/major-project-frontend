// Shared store for jobs and applications
// This uses localStorage to persist data across both HR and Candidate dashboards

export interface Job {
  id: number
  title: string
  department: string
  location: string
  salary: string
  type: string
  description: string
  applicants: number
  status: "active" | "paused" | "closed"
  postedAt: string
  isRemote: boolean
  skills: string[]
  vacancies: number
  company: string
}

export interface Application {
  id: number
  jobId: number
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  skills: string[]
  experience: string
  coverLetter: string
  resumeFileName: string
  resumeFileSize: number
  appliedAt: string
  status: "new" | "reviewing" | "interviewed" | "shortlisted" | "rejected"
  aiScore?: number
  resumeMatch?: number
  skillsMatch?: number
  experienceMatch?: number
}

const JOBS_KEY = "hireai_jobs"
const APPLICATIONS_KEY = "hireai_applications"

// Default jobs for initial state
const defaultJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    description: "We are looking for a skilled frontend developer to join our team. You will work on building responsive web applications using modern frameworks and collaborate with cross-functional teams.",
    applicants: 0,
    status: "active",
    postedAt: "2024-01-15",
    isRemote: true,
    skills: ["React", "TypeScript", "Next.js"],
    vacancies: 2,
    company: "TechCorp Inc.",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    salary: "$100k - $140k",
    type: "Full-time",
    description: "Join our design team to create amazing user experiences. You will lead design projects from conception to implementation.",
    applicants: 0,
    status: "active",
    postedAt: "2024-01-14",
    isRemote: false,
    skills: ["Figma", "UI/UX", "Prototyping"],
    vacancies: 3,
    company: "DesignHub",
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Austin, TX",
    salary: "$90k - $120k",
    type: "Full-time",
    description: "Lead our marketing initiatives and grow our brand. You will manage marketing campaigns and analyze performance metrics.",
    applicants: 0,
    status: "active",
    postedAt: "2024-01-10",
    isRemote: true,
    skills: ["SEO", "Content Strategy", "Analytics"],
    vacancies: 1,
    company: "GrowthCo",
  },
  {
    id: 4,
    title: "Data Scientist",
    department: "Engineering",
    location: "Remote",
    salary: "$130k - $170k",
    type: "Full-time",
    description: "Analyze data and build machine learning models. You will work with large datasets to derive insights and build predictive models.",
    applicants: 0,
    status: "active",
    postedAt: "2024-01-12",
    isRemote: true,
    skills: ["Python", "Machine Learning", "SQL"],
    vacancies: 2,
    company: "DataDriven",
  },
]

// Jobs functions
export function getJobs(): Job[] {
  if (typeof window === "undefined") return defaultJobs
  const stored = localStorage.getItem(JOBS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  // Initialize with default jobs
  localStorage.setItem(JOBS_KEY, JSON.stringify(defaultJobs))
  return defaultJobs
}

export function saveJobs(jobs: Job[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent("jobs-updated"))
}

export function addJob(job: Omit<Job, "id" | "applicants" | "postedAt">): Job {
  const jobs = getJobs()
  const newJob: Job = {
    ...job,
    id: Date.now(),
    applicants: 0,
    postedAt: new Date().toISOString().split('T')[0],
  }
  saveJobs([newJob, ...jobs])
  return newJob
}

export function updateJobApplicantCount(jobId: number): void {
  const jobs = getJobs()
  const applications = getApplications()
  const jobApplications = applications.filter(app => app.jobId === jobId)
  
  const updatedJobs = jobs.map(job => 
    job.id === jobId 
      ? { ...job, applicants: jobApplications.length }
      : job
  )
  saveJobs(updatedJobs)
}

// Applications functions
export function getApplications(): Application[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(APPLICATIONS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

export function saveApplications(applications: Application[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications))
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent("applications-updated"))
}

export function addApplication(application: Omit<Application, "id" | "appliedAt" | "status">): Application {
  const applications = getApplications()
  const newApplication: Application = {
    ...application,
    id: Date.now(),
    appliedAt: new Date().toISOString().split('T')[0],
    status: "new",
  }
  saveApplications([newApplication, ...applications])
  
  // Update job applicant count
  updateJobApplicantCount(application.jobId)
  
  return newApplication
}

export function getApplicationsForJob(jobId: number): Application[] {
  const applications = getApplications()
  return applications.filter(app => app.jobId === jobId)
}

export function hasApplied(jobId: number, candidateEmail: string): boolean {
  const applications = getApplications()
  return applications.some(app => app.jobId === jobId && app.candidateEmail === candidateEmail)
}

export function updateApplicationStatus(applicationId: number, status: Application["status"]): void {
  const applications = getApplications()
  const updatedApplications = applications.map(app =>
    app.id === applicationId ? { ...app, status } : app
  )
  saveApplications(updatedApplications)
}

export function updateApplicationScores(
  applicationId: number, 
  scores: { aiScore: number; resumeMatch: number; skillsMatch: number; experienceMatch: number }
): void {
  const applications = getApplications()
  const updatedApplications = applications.map(app =>
    app.id === applicationId ? { ...app, ...scores } : app
  )
  saveApplications(updatedApplications)
}

// Get active jobs only (for candidate view)
export function getActiveJobs(): Job[] {
  return getJobs().filter(job => job.status === "active")
}
