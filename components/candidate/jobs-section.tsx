"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2,
  Bookmark,
  BookmarkCheck,
  Send,
  Filter,
  Briefcase,
  ExternalLink,
  Upload,
  X,
  CheckCircle2
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Job {
  id: number
  title: string
  company: string
  department: string
  location: string
  type: string
  salary: string
  posted: string
  description: string
  skills: string[]
  remote: boolean
  vacancies: number
  status: "active" | "paused" | "closed"
}

interface ApplicationFormData {
  fullName: string
  email: string
  phone: string
  skills: string
  experience: string
  coverLetter: string
  resumeFile: File | null
}

// Helper function to format date
function formatPostedDate(dateString: string): string {
  const posted = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - posted.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return "1 week ago"
  return `${Math.floor(diffDays / 7)} weeks ago`
}

export function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    coverLetter: "",
    resumeFile: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load jobs from localStorage (posted by HR)
  useEffect(() => {
    const loadJobs = () => {
      const storedJobs = localStorage.getItem("hireai_jobs")
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs)
        // Transform HR-posted jobs to candidate job format, only show active jobs
        const candidateJobs: Job[] = parsedJobs
          .filter((job: { status: string }) => job.status === "active")
          .map((job: {
            id: number
            title: string
            department: string
            location: string
            type: string
            salary: string
            description: string
            skills: string[]
            isRemote: boolean
            vacancies: number
            postedAt: string
            status: "active" | "paused" | "closed"
          }) => ({
            id: job.id,
            title: job.title,
            company: "HireAI Corp", // Default company name
            department: job.department,
            location: job.location,
            type: job.type,
            salary: job.salary,
            posted: formatPostedDate(job.postedAt),
            description: job.description,
            skills: job.skills,
            remote: job.isRemote,
            vacancies: job.vacancies,
            status: job.status
          }))
        setJobs(candidateJobs)
      }
    }

    loadJobs()
    // Listen for storage changes from HR dashboard
    window.addEventListener("storage", loadJobs)
    return () => window.removeEventListener("storage", loadJobs)
  }, [])

  // Load applied jobs from localStorage
  useEffect(() => {
    const storedApplications = localStorage.getItem("hireai_applications")
    if (storedApplications) {
      const applications = JSON.parse(storedApplications)
      const appliedJobIds = applications.map((app: { jobId: number }) => app.jobId)
      setAppliedJobs(appliedJobIds)
    }
  }, [])

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const openApplyDialog = (job: typeof jobs[0]) => {
    setSelectedJob(job)
    setApplyDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeFile: e.target.files[0] })
    }
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedJob) {
      setIsSubmitting(true)
      
      // Get candidate info from session storage
      const candidateName = sessionStorage.getItem("userName") || formData.fullName
      const candidateEmail = sessionStorage.getItem("userEmail") || formData.email
      
      // Create application object
      const application = {
        id: Date.now(),
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        phone: formData.phone,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
        experience: formData.experience,
        coverLetter: formData.coverLetter,
        appliedAt: new Date().toISOString().split('T')[0],
        status: "new" as const,
        resumeFileName: formData.resumeFile?.name || null
      }
      
      // Save to localStorage
      const existingApplications = localStorage.getItem("hireai_applications")
      const applications = existingApplications ? JSON.parse(existingApplications) : []
      applications.push(application)
      localStorage.setItem("hireai_applications", JSON.stringify(applications))
      
      // Update job's applicant count in jobs storage
      const storedJobs = localStorage.getItem("hireai_jobs")
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs)
        const updatedJobs = parsedJobs.map((job: { id: number; applicants: number }) => 
          job.id === selectedJob.id 
            ? { ...job, applicants: (job.applicants || 0) + 1 }
            : job
        )
        localStorage.setItem("hireai_jobs", JSON.stringify(updatedJobs))
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAppliedJobs(prev => [...prev, selectedJob.id])
      setApplyDialogOpen(false)
      setIsSubmitting(false)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        skills: "",
        experience: "",
        coverLetter: "",
        resumeFile: null,
      })
      setSelectedJob(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Available Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{appliedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Applications Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{savedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Saved Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Apply for Position</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedJob?.title} at {selectedJob?.company}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-foreground">Years of Experience *</Label>
                <Input
                  id="experience"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5 years"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-foreground">Skills *</Label>
              <Input
                id="skills"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., React, TypeScript, Node.js (comma separated)"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Enter your skills separated by commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-foreground">Upload Resume *</Label>
              <div className="relative">
                <input
                  id="resume"
                  type="file"
                  required={!formData.resumeFile}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div 
                  onClick={() => document.getElementById('resume')?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {formData.resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-foreground font-medium">{formData.resumeFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(formData.resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, resumeFile: null })
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-foreground font-medium">Click to upload resume</p>
                      <p className="text-sm text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-foreground">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                placeholder="Tell us why you're interested in this position..."
                rows={4}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyDialogOpen(false)}
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(job.id)}
                      className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {job.type}
                    </Badge>
                    {job.remote && (
                      <Badge className="bg-primary/10 text-primary border-0">
                        Remote
                      </Badge>
                    )}
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="border-border text-muted-foreground">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex lg:flex-col items-center gap-2 lg:items-end">
                  <button
                    onClick={() => toggleSave(job.id)}
                    className="hidden lg:flex p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    {savedJobs.includes(job.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-foreground text-xl">{job.title}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          {job.company} - {job.location}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{job.type}</Badge>
                          {job.remote && <Badge className="bg-primary/10 text-primary border-0">Remote</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Posted {job.posted}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Description</h4>
                          <p className="text-muted-foreground">{job.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="border-border text-muted-foreground">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button 
                            className={appliedJobs.includes(job.id) 
                              ? "flex-1 bg-chart-2/10 text-chart-2 hover:bg-chart-2/20" 
                              : "flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            }
                            onClick={() => {
                              if (!appliedJobs.includes(job.id)) {
                                openApplyDialog(job)
                              }
                            }}
                            disabled={appliedJobs.includes(job.id)}
                          >
                            {appliedJobs.includes(job.id) ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Applied
                              </>
                            ) : "Apply Now"}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-secondary"
                            onClick={() => toggleSave(job.id)}
                          >
                            {savedJobs.includes(job.id) ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    className={appliedJobs.includes(job.id) 
                      ? "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }
                    size="sm"
                    onClick={() => !appliedJobs.includes(job.id) && openApplyDialog(job)}
                    disabled={appliedJobs.includes(job.id)}
                  >
                    {appliedJobs.includes(job.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Applied
                      </>
                    ) : "Quick Apply"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && jobs.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}

      {jobs.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No jobs available yet</h3>
            <p className="text-muted-foreground mt-1">Check back later for new job postings from HR</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
