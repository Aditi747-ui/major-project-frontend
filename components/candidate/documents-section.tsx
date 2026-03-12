"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Upload, 
  File, 
  Trash2, 
  Download,
  Plus
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Document {
  id: number
  name: string
  type: string
  size: string
  uploadedAt: string
}

const initialDocuments: Document[] = [
  {
    id: 1,
    name: "Resume_Alex_Johnson.pdf",
    type: "Resume",
    size: "245 KB",
    uploadedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Cover_Letter_TechCorp.pdf",
    type: "Cover Letter",
    size: "128 KB",
    uploadedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Portfolio_2024.pdf",
    type: "Portfolio",
    size: "2.4 MB",
    uploadedAt: "2024-01-10",
  },
  {
    id: 4,
    name: "Certificate_AWS.pdf",
    type: "Certificate",
    size: "512 KB",
    uploadedAt: "2024-01-08",
  },
]

export function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    const newDoc: Document = {
      id: Date.now(),
      name: file.name,
      type: "Other",
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().split('T')[0],
    }
    setDocuments([newDoc, ...documents])
    setIsUploadOpen(false)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Stats - Only Total Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-5 w-5 mr-2" />
                  Upload New
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload your resume, cover letter, certificates, or portfolio
                  </DialogDescription>
                </DialogHeader>
                <div
                  className={`
                    mt-4 border-2 border-dashed rounded-xl p-8 text-center
                    transition-colors cursor-pointer
                    ${dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">My Documents</CardTitle>
          <CardDescription>
            Manage your uploaded documents for job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-card border border-border flex items-center justify-center">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>-</span>
                      <span>{doc.size}</span>
                      <span>-</span>
                      <span>Uploaded {doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No documents uploaded</h3>
              <p className="text-muted-foreground mt-1">Upload your first document to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
