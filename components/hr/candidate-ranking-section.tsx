"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Sparkles, 
  Trophy, 
  Users, 
  TrendingUp,
  Star,
  Mail,
  Phone,
  FileText,
  Calendar,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Briefcase
} from "lucide-react"

interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  position: string
  jobId: string
  aiScore: number
  experience: string
  skills: string[]
  appliedAt: string
  status: "new" | "reviewing" | "interviewed" | "shortlisted" | "rejected"
  resumeMatch: number
  skillsMatch: number
  experienceMatch: number
}

interface Job {
  id: string
  title: string
  vacancies: number
}

const defaultJobs: Job[] = [
  { id: "1", title: "Senior Frontend Developer", vacancies: 2 },
  { id: "2", title: "Product Designer", vacancies: 3 },
  { id: "3", title: "Marketing Manager", vacancies: 1 },
  { id: "4", title: "Data Scientist", vacancies: 2 },
]

const allCandidates: Candidate[] = [
  {
    id: 1,
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Frontend Developer",
    jobId: "1",
    aiScore: 95,
    experience: "6 years",
    skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
    appliedAt: "2024-01-15",
    status: "shortlisted",
    resumeMatch: 98,
    skillsMatch: 94,
    experienceMatch: 92,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1 (555) 234-5678",
    position: "Senior Frontend Developer",
    jobId: "1",
    aiScore: 88,
    experience: "5 years",
    skills: ["React", "JavaScript", "Vue.js", "CSS", "REST APIs"],
    appliedAt: "2024-01-14",
    status: "interviewed",
    resumeMatch: 85,
    skillsMatch: 90,
    experienceMatch: 88,
  },
  {
    id: 3,
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "+1 (555) 345-6789",
    position: "Senior Frontend Developer",
    jobId: "1",
    aiScore: 82,
    experience: "4 years",
    skills: ["React", "TypeScript", "Angular", "SCSS", "Jest"],
    appliedAt: "2024-01-13",
    status: "reviewing",
    resumeMatch: 80,
    skillsMatch: 85,
    experienceMatch: 78,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    position: "Senior Frontend Developer",
    jobId: "1",
    aiScore: 78,
    experience: "3 years",
    skills: ["React", "JavaScript", "HTML/CSS", "Redux", "Webpack"],
    appliedAt: "2024-01-12",
    status: "new",
    resumeMatch: 75,
    skillsMatch: 80,
    experienceMatch: 76,
  },
  {
    id: 5,
    name: "Jessica Martinez",
    email: "jessica.m@email.com",
    phone: "+1 (555) 567-8901",
    position: "Senior Frontend Developer",
    jobId: "1",
    aiScore: 72,
    experience: "4 years",
    skills: ["Vue.js", "JavaScript", "Nuxt.js", "Tailwind CSS", "Git"],
    appliedAt: "2024-01-11",
    status: "new",
    resumeMatch: 68,
    skillsMatch: 75,
    experienceMatch: 72,
  },
  {
    id: 6,
    name: "Alex Thompson",
    email: "alex.t@email.com",
    phone: "+1 (555) 678-9012",
    position: "Product Designer",
    jobId: "2",
    aiScore: 91,
    experience: "5 years",
    skills: ["Figma", "UI/UX", "Adobe XD", "Prototyping", "User Research"],
    appliedAt: "2024-01-15",
    status: "shortlisted",
    resumeMatch: 92,
    skillsMatch: 90,
    experienceMatch: 91,
  },
  {
    id: 7,
    name: "Rachel Green",
    email: "rachel.g@email.com",
    phone: "+1 (555) 789-0123",
    position: "Product Designer",
    jobId: "2",
    aiScore: 85,
    experience: "4 years",
    skills: ["Figma", "Sketch", "Design Systems", "CSS", "Motion Design"],
    appliedAt: "2024-01-14",
    status: "reviewing",
    resumeMatch: 84,
    skillsMatch: 86,
    experienceMatch: 85,
  },
  {
    id: 8,
    name: "Michael Brown",
    email: "michael.b@email.com",
    phone: "+1 (555) 890-1234",
    position: "Marketing Manager",
    jobId: "3",
    aiScore: 89,
    experience: "7 years",
    skills: ["SEO", "Content Strategy", "Analytics", "Social Media", "PPC"],
    appliedAt: "2024-01-15",
    status: "interviewed",
    resumeMatch: 90,
    skillsMatch: 88,
    experienceMatch: 89,
  },
  {
    id: 9,
    name: "Lisa Wang",
    email: "lisa.w@email.com",
    phone: "+1 (555) 901-2345",
    position: "Data Scientist",
    jobId: "4",
    aiScore: 93,
    experience: "5 years",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
    appliedAt: "2024-01-15",
    status: "shortlisted",
    resumeMatch: 94,
    skillsMatch: 92,
    experienceMatch: 93,
  },
  {
    id: 10,
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "+1 (555) 012-3456",
    position: "Data Scientist",
    jobId: "4",
    aiScore: 86,
    experience: "4 years",
    skills: ["Python", "R", "Deep Learning", "NLP", "Data Visualization"],
    appliedAt: "2024-01-14",
    status: "reviewing",
    resumeMatch: 85,
    skillsMatch: 87,
    experienceMatch: 86,
  },
]

export function CandidateRankingSection() {
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [showRanking, setShowRanking] = useState(false)
  const [jobs, setJobs] = useState<Job[]>(defaultJobs)

  // Load jobs from localStorage (includes vacancies from posted jobs)
  useEffect(() => {
    const storedJobs = localStorage.getItem("hireai_jobs")
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs)
      // Convert posted jobs to ranking format
      const formattedJobs: Job[] = parsedJobs.map((job: { id: number; title: string; vacancies: number }) => ({
        id: job.id.toString(),
        title: job.title,
        vacancies: job.vacancies || 1
      }))
      setJobs(formattedJobs)
    }
  }, [])

  const selectedJobData = jobs.find(job => job.id === selectedJob)
  
  const filteredCandidates = allCandidates.filter(
    candidate => candidate.jobId === selectedJob
  )

  const sortedCandidates = [...filteredCandidates].sort((a, b) => 
    sortOrder === "desc" ? b.aiScore - a.aiScore : a.aiScore - b.aiScore
  )

  // Get top candidates based on vacancies
  const topCandidates = sortedCandidates.slice(0, selectedJobData?.vacancies || 0)
  const otherCandidates = sortedCandidates.slice(selectedJobData?.vacancies || 0)

  const topCandidate = sortedCandidates[0]
  const averageScore = filteredCandidates.length > 0 
    ? Math.round(filteredCandidates.reduce((sum, c) => sum + c.aiScore, 0) / filteredCandidates.length)
    : 0

  const handleViewRanking = () => {
    if (selectedJob) {
      setShowRanking(true)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "shortlisted":
        return <Badge className="bg-primary/10 text-primary border-0">Shortlisted</Badge>
      case "interviewed":
        return <Badge className="bg-chart-2/10 text-chart-2 border-0">Interviewed</Badge>
      case "reviewing":
        return <Badge className="bg-chart-4/10 text-chart-4 border-0">Reviewing</Badge>
      case "new":
        return <Badge className="bg-secondary text-secondary-foreground border-0">New</Badge>
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-0">Rejected</Badge>
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-primary"
    if (score >= 70) return "text-chart-4"
    return "text-destructive"
  }

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-primary"
    if (score >= 70) return "bg-chart-4"
    return "bg-destructive"
  }

  return (
    <div className="space-y-6">
      {/* Job Selection Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">Select Job Position</label>
              <Select value={selectedJob} onValueChange={(value) => {
                setSelectedJob(value)
                setShowRanking(false)
              }}>
                <SelectTrigger className="w-full bg-input border-border text-foreground">
                  <SelectValue placeholder="Choose a job to view candidate ranking" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{job.title}</span>
                        <span className="text-muted-foreground text-sm">
                          {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleViewRanking}
              disabled={!selectedJob}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              View AI Ranking
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show ranking results */}
      {showRanking && selectedJobData && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{filteredCandidates.length}</p>
                    <p className="text-sm text-muted-foreground">Total Applicants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{selectedJobData.vacancies}</p>
                    <p className="text-sm text-muted-foreground">Open Vacancies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                    <p className="text-sm text-muted-foreground">Avg AI Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{topCandidate?.aiScore || 0}%</p>
                    <p className="text-sm text-muted-foreground">Top Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Ranking Info */}
          <Card className="bg-card border-border border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI-Powered Candidate Ranking for {selectedJobData.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {selectedJobData.vacancies} open {selectedJobData.vacancies === 1 ? 'vacancy' : 'vacancies'}, 
                    the top {selectedJobData.vacancies} {selectedJobData.vacancies === 1 ? 'candidate is' : 'candidates are'} highlighted 
                    as recommended hires. Rankings are based on resume match, skills alignment, and experience relevance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sort Controls - Removed AI Score tab and Export button */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {sortedCandidates.length} candidates sorted by AI match score
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  Sort: {sortOrder === "desc" ? "Highest First" : "Lowest First"}
                  {sortOrder === "desc" ? (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Candidates - Recommended based on vacancies */}
          {topCandidates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Recommended Candidates ({topCandidates.length} for {selectedJobData.vacancies} {selectedJobData.vacancies === 1 ? 'vacancy' : 'vacancies'})
              </h3>
              {topCandidates.map((candidate, index) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  index={index}
                  isRecommended={true}
                  getStatusBadge={getStatusBadge}
                  getScoreColor={getScoreColor}
                  getProgressColor={getProgressColor}
                />
              ))}
            </div>
          )}

          {/* Other Candidates */}
          {otherCandidates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Other Applicants ({otherCandidates.length})
              </h3>
              {otherCandidates.map((candidate, index) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  index={index + topCandidates.length}
                  isRecommended={false}
                  getStatusBadge={getStatusBadge}
                  getScoreColor={getScoreColor}
                  getProgressColor={getProgressColor}
                />
              ))}
            </div>
          )}

          {sortedCandidates.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No applicants yet</h3>
                <p className="text-muted-foreground mt-1">No candidates have applied for this position</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Initial state - no job selected */}
      {!showRanking && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Select a Job Position</h3>
            <p className="text-muted-foreground mt-1">
              Choose a job from the dropdown above to view AI-powered candidate rankings based on available vacancies
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  index: number
  isRecommended: boolean
  getStatusBadge: (status: string) => React.ReactNode
  getScoreColor: (score: number) => string
  getProgressColor: (score: number) => string
}

function CandidateCard({ 
  candidate, 
  index, 
  isRecommended,
  getStatusBadge, 
  getScoreColor, 
  getProgressColor 
}: CandidateCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card className={`bg-card border-border hover:border-primary/50 transition-colors ${isRecommended ? 'ring-2 ring-primary/20' : ''}`}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Rank & Avatar */}
            <div className="flex items-center gap-4">
              <div className={`
                h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg
                ${isRecommended ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}
              `}>
                #{index + 1}
              </div>
              <Avatar className="h-14 w-14 border-2 border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-lg">{candidate.name}</h3>
                  {isRecommended && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{candidate.experience} experience</p>
              </div>
            </div>

            {/* AI Score */}
            <div className="flex-1 lg:max-w-[200px]">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">AI Match Score</span>
                </div>
                <p className={`text-3xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                  {candidate.aiScore}%
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">Resume</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(candidate.resumeMatch)} transition-all`}
                    style={{ width: `${candidate.resumeMatch}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10">{candidate.resumeMatch}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">Skills</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(candidate.skillsMatch)} transition-all`}
                    style={{ width: `${candidate.skillsMatch}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10">{candidate.skillsMatch}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">Experience</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(candidate.experienceMatch)} transition-all`}
                    style={{ width: `${candidate.experienceMatch}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10">{candidate.experienceMatch}%</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="bg-secondary text-secondary-foreground text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 3 && (
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground text-xs">
                    +{candidate.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              {getStatusBadge(candidate.status)}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsOpen(true)}
                className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  {candidate.name}
                  {isRecommended && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-normal text-muted-foreground">{candidate.position}</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Applied on {candidate.appliedAt}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* AI Score Card */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">AI Match Score</span>
                </div>
                <span className={`text-3xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                  {candidate.aiScore}%
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-24">Resume Match</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(candidate.resumeMatch)}`}
                      style={{ width: `${candidate.resumeMatch}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground w-12">{candidate.resumeMatch}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-24">Skills Match</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(candidate.skillsMatch)}`}
                      style={{ width: `${candidate.skillsMatch}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground w-12">{candidate.skillsMatch}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-24">Experience</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(candidate.experienceMatch)}`}
                      style={{ width: `${candidate.experienceMatch}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground w-12">{candidate.experienceMatch}%</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{candidate.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm text-foreground">{candidate.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Applied</p>
                  <p className="text-sm text-foreground">{candidate.appliedAt}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
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

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Shortlist
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
