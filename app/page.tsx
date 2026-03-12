"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Briefcase, Users, Sparkles, ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"candidate" | "hr">("candidate")
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [signupRole, setSignupRole] = useState<"candidate" | "hr">("candidate")
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    
    // Store user data in sessionStorage
    sessionStorage.setItem("userName", name)
    sessionStorage.setItem("userEmail", email)
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (activeTab === "candidate") {
      router.push("/candidate")
    } else {
      router.push("/hr")
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setSignupSuccess(true)
    
    // Close dialog after showing success
    setTimeout(() => {
      setIsSignupOpen(false)
      setSignupSuccess(false)
    }, 2000)
  }

  const openSignup = (role: "candidate" | "hr") => {
    setSignupRole(role)
    setIsSignupOpen(true)
    setSignupSuccess(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-card border-r border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">HireAI</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-foreground leading-tight text-balance">
              Smart Hiring
              <br />
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Transform your recruitment process with AI-driven resume screening, 
              intelligent candidate ranking, and seamless job management.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-8">
              <FeatureCard 
                icon={<Users className="h-5 w-5" />}
                title="For Candidates"
                description="Browse jobs and track applications"
              />
              <FeatureCard 
                icon={<Briefcase className="h-5 w-5" />}
                title="For HR Teams"
                description="AI-powered candidate ranking"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Trusted by 500+ companies worldwide
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">HireAI</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to continue to your dashboard</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "candidate" | "hr")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="candidate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4 mr-2" />
                Candidate
              </TabsTrigger>
              <TabsTrigger value="hr" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                HR Manager
              </TabsTrigger>
            </TabsList>

            <TabsContent value="candidate" className="mt-6">
              <LoginForm 
                role="candidate"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLoading={isLoading}
                onSubmit={handleLogin}
                onSignupClick={() => openSignup("candidate")}
              />
            </TabsContent>

            <TabsContent value="hr" className="mt-6">
              <LoginForm 
                role="hr"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLoading={isLoading}
                onSubmit={handleLogin}
                onSignupClick={() => openSignup("hr")}
              />
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <button 
              onClick={() => openSignup(activeTab)}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create {signupRole === "hr" ? "HR Manager" : "Candidate"} Account
            </DialogTitle>
            <DialogDescription>
              Fill in your details to create a new account
            </DialogDescription>
          </DialogHeader>
          
          {signupSuccess ? (
            <div className="py-8 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Account Created!</h3>
              <p className="text-muted-foreground mt-2">You can now sign in with your credentials</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="text-foreground">Email</Label>
                <Input 
                  id="signupEmail"
                  name="email"
                  type="email" 
                  placeholder="name@company.com"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              {signupRole === "hr" && (
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground">Company Name</Label>
                  <Input 
                    id="company"
                    name="company"
                    placeholder="Your Company Inc."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="signupPassword" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input 
                    id="signupPassword"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create a password"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your password"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-secondary/50 border-border">
      <CardContent className="p-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function LoginForm({ 
  role, 
  showPassword, 
  setShowPassword, 
  isLoading, 
  onSubmit,
  onSignupClick
}: { 
  role: string
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  isLoading: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onSignupClick: () => void
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Sign in as {role === "hr" ? "HR Manager" : "Candidate"}</CardTitle>
        <CardDescription>
          Enter your credentials to access your {role === "hr" ? "recruitment" : "job"} dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${role}-email`} className="text-foreground">Email</Label>
            <Input 
              id={`${role}-email`}
              name="email"
              type="email" 
              placeholder="name@company.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${role}-password`} className="text-foreground">Password</Label>
            <div className="relative">
              <Input 
                id={`${role}-password`}
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="rounded border-border bg-input accent-primary" />
              Remember me
            </label>
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
