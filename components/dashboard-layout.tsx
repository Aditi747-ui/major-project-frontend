"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Sparkles, 
  LogOut, 
  Settings, 
  User, 
  Menu, 
  X,
  ChevronRight,
  type LucideIcon
} from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

interface DashboardLayoutProps {
  role: "candidate" | "hr"
  navItems: NavItem[]
  activeSection: string
  onSectionChange: (section: string) => void
  userName: string
  userEmail: string
  children: React.ReactNode
}

export function DashboardLayout({
  role,
  navItems,
  activeSection,
  onSectionChange,
  userName,
  userEmail,
  children,
}: DashboardLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">HireAI</span>
          </div>
        </div>
        <UserMenu userName={userName} userEmail={userEmail} onLogout={handleLogout} />
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HireAI</span>
            </Link>
          </div>

          {/* Role Badge */}
          <div className="px-4 py-4">
            <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {role === "hr" ? "HR Dashboard" : "Candidate Portal"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-150 group
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-3 text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-border bg-card">
          <div>
            <h1 className="text-lg font-semibold text-foreground capitalize">
              {navItems.find(item => item.id === activeSection)?.label}
            </h1>
          </div>
          <UserMenu userName={userName} userEmail={userEmail} onLogout={handleLogout} />
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function UserMenu({ userName, userEmail, onLogout }: { userName: string; userEmail: string; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <DropdownMenuLabel className="text-foreground">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={onLogout} className="text-destructive hover:bg-destructive/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
