"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { JobsSection } from "@/components/candidate/jobs-section"
import { DocumentsSection } from "@/components/candidate/documents-section"
import { Briefcase, FileText } from "lucide-react"

const navItems = [
  { id: "jobs", label: "Available Jobs", icon: Briefcase },
  { id: "documents", label: "My Documents", icon: FileText },
]

export default function CandidateDashboard() {
  const [activeSection, setActiveSection] = useState("jobs")
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
      role="candidate"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      userName={userName}
      userEmail={userEmail}
    >
      {activeSection === "jobs" && <JobsSection />}
      {activeSection === "documents" && <DocumentsSection />}
    </DashboardLayout>
  )
}
