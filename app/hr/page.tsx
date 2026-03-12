"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PostJobSection } from "@/components/hr/post-job-section"
import { CandidateRankingSection } from "@/components/hr/candidate-ranking-section"
import { PlusCircle, BarChart3 } from "lucide-react"

const navItems = [
  { id: "post-job", label: "Post a Job", icon: PlusCircle },
  { id: "ranking", label: "Candidate Ranking", icon: BarChart3 },
]

export default function HRDashboard() {
  const [activeSection, setActiveSection] = useState("post-job")
  const [userName, setUserName] = useState("Guest User")
  const [userEmail, setUserEmail] = useState("guest@email.com")

  useEffect(() => {
    // Get user data from sessionStorage
    const storedName = sessionStorage.getItem("userName")
    const storedEmail = sessionStorage.getItem("userEmail")
    
    if (storedName) setUserName(storedName)
    if (storedEmail) setUserEmail(storedEmail)
  }, [])

  return (
    <DashboardLayout 
      role="hr"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      userName={userName}
      userEmail={userEmail}
    >
      {activeSection === "post-job" && <PostJobSection />}
      {activeSection === "ranking" && <CandidateRankingSection />}
    </DashboardLayout>
  )
}
