"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Briefcase, 
  Users,
  Clock,
  CheckCircle2,
  X,
  Plus,
  Sparkles,
  Send,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react"

interface PostedJob {
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
}

const initialJobs: PostedJob[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    description: "We are looking for a skilled frontend developer to join our team.",
    applicants: 45,
    status: "active",
    postedAt: "2024-01-15",
    isRemote: true,
    skills: ["React", "TypeScript", "Next.js"],
    vacancies: 2,
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    salary: "$100k - $140k",
    type: "Full-time",
    description: "Join our design team to create amazing user experiences.",
    applicants: 32,
    status: "active",
    postedAt: "2024-01-14",
    isRemote: false,
    skills: ["Figma", "UI/UX", "Prototyping"],
    vacancies: 3,
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Austin, TX",
    salary: "$90k - $120k",
    type: "Full-time",
    description: "Lead our marketing initiatives and grow our brand.",
    applicants: 28,
    status: "paused",
    postedAt: "2024-01-10",
    isRemote: true,
    skills: ["SEO", "Content Strategy", "Analytics"],
    vacancies: 1,
  },
  {
    id: 4,
    title: "Data Scientist",
    department: "Engineering",
    location: "Remote",
    salary: "$130k - $170k",
    type: "Full-time",
    description: "Analyze data and build machine learning models.",
    applicants: 38,
    status: "active",
    postedAt: "2024-01-12",
    isRemote: true,
    skills: ["Python", "Machine Learning", "SQL"],
    vacancies: 2,
  },
]

export function PostJobSection() {
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>(initialJobs)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isRemote, setIsRemote] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedJob, setSelectedJob] = useState<PostedJob | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    type: "",
    location: "",
    salary: "",
    description: "",
    vacancies: "1",
  })

  // Load jobs from localStorage on mount
  useEffect(() => {
    const storedJobs = localStorage.getItem("hireai_jobs")
    if (storedJobs) {
      setPostedJobs(JSON.parse(storedJobs))
    } else {
      // Save initial jobs to localStorage
      localStorage.setItem("hireai_jobs", JSON.stringify(initialJobs))
    }
  }, [])

  // Save jobs to localStorage whenever they change
  const saveJobs = (jobs: PostedJob[]) => {
    setPostedJobs(jobs)
    localStorage.setItem("hireai_jobs", JSON.stringify(jobs))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newJob: PostedJob = {
      id: Date.now(),
      title: formData.title,
      department: formData.department,
      location: formData.location,
      salary: formData.salary,
      type: formData.type,
      description: formData.description,
      applicants: 0,
      status: "active",
      postedAt: new Date().toISOString().split('T')[0],
      isRemote: isRemote,
      skills: skills,
      vacancies: parseInt(formData.vacancies) || 1,
    }
    
    const updatedJobs = [newJob, ...postedJobs]
    saveJobs(updatedJobs)
    
    setSkills([])
    setIsRemote(false)
    setIsSubmitting(false)
    setFormData({
      title: "",
      department: "",
      type: "",
      location: "",
      salary: "",
      description: "",
      vacancies: "1",
    })
  }

  const handleViewDetails = (job: PostedJob) => {
    setSelectedJob(job)
    setIsDetailsOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary border-0">Active</Badge>
      case "paused":
        return <Badge className="bg-chart-4/10 text-chart-4 border-0">Paused</Badge>
      case "closed":
        return <Badge className="bg-muted text-muted-foreground border-0">Closed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{postedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Total Jobs Posted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {postedJobs.filter(j => j.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {postedJobs.reduce((sum, job) => sum + job.applicants, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {postedJobs.reduce((sum, job) => sum + job.vacancies, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Vacancies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post New Job Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Post New Job</CardTitle>
            </div>
            <CardDescription>
              Create a new job posting with AI-powered candidate matching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Job Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-foreground">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    required
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground">Employment Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground">Location</Label>
                  <Input 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-foreground">Salary Range</Label>
                  <Input 
                    id="salary" 
                    name="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $120k - $160k"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* New Vacancies Field */}
              <div className="space-y-2">
                <Label htmlFor="vacancies" className="text-foreground">Number of Vacancies</Label>
                <Input 
                  id="vacancies" 
                  name="vacancies"
                  type="number"
                  min="1"
                  value={formData.vacancies}
                  onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                  placeholder="e.g. 2"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This determines how many top candidates will be recommended in the AI ranking
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Job Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Required Skills</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addSkill}
                    className="border-border text-foreground hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-secondary text-secondary-foreground pr-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Remote Work Available</p>
                  <p className="text-sm text-muted-foreground">Allow candidates to work remotely</p>
                </div>
                <Switch 
                  checked={isRemote} 
                  onCheckedChange={setIsRemote}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Job
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Posted Jobs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Job Postings</CardTitle>
            <CardDescription>
              Overview of your recent job listings and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{job.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{job.department}</p>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants} applicants
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">Posted {job.postedAt}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                      onClick={() => handleViewDetails(job)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              {selectedJob?.department} {selectedJob && getStatusBadge(selectedJob.status)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm text-foreground">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm text-foreground">{selectedJob.salary || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vacancies</p>
                    <p className="text-sm text-foreground">{selectedJob.vacancies} positions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Posted</p>
                    <p className="text-sm text-foreground">{selectedJob.postedAt}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm text-foreground">{selectedJob.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Applicants</p>
                    <p className="text-sm text-foreground">{selectedJob.applicants} candidates</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
              </div>

              {selectedJob.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-secondary text-secondary-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {selectedJob.isRemote && (
                  <Badge className="bg-primary/10 text-primary border-0">Remote Friendly</Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
