import { generateText, Output } from 'ai'
import { z } from 'zod'

const CandidateScoreSchema = z.object({
  candidateId: z.number(),
  aiScore: z.number().min(0).max(100),
  resumeMatch: z.number().min(0).max(100),
  skillsMatch: z.number().min(0).max(100),
  experienceMatch: z.number().min(0).max(100),
  reasoning: z.string(),
})

const RankingResultSchema = z.object({
  rankings: z.array(CandidateScoreSchema),
})

export async function POST(req: Request) {
  try {
    const { job, applications } = await req.json()

    if (!job || !applications || applications.length === 0) {
      return Response.json(
        { error: 'Job and applications are required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert HR recruiter AI assistant. Analyze the following job posting and candidate applications, then rank each candidate based on their fit for the position.

## Job Posting
Title: ${job.title}
Department: ${job.department}
Location: ${job.location}
Employment Type: ${job.type}
Remote: ${job.isRemote ? 'Yes' : 'No'}
Required Skills: ${job.skills.join(', ')}
Description: ${job.description}
Number of Vacancies: ${job.vacancies}

## Candidates to Evaluate
${applications.map((app: {
  id: number
  candidateName: string
  experience: string
  skills: string[]
  coverLetter: string
}, index: number) => `
### Candidate ${index + 1} (ID: ${app.id})
- Name: ${app.candidateName}
- Experience: ${app.experience}
- Skills: ${app.skills.join(', ')}
- Cover Letter: ${app.coverLetter || 'Not provided'}
`).join('\n')}

## Instructions
For each candidate, provide:
1. **aiScore** (0-100): Overall match score considering all factors
2. **resumeMatch** (0-100): How well their experience aligns with the job
3. **skillsMatch** (0-100): How many required skills they possess
4. **experienceMatch** (0-100): How relevant their experience level is
5. **reasoning**: Brief explanation for the scores

Be critical but fair. Consider:
- Exact skill matches vs related skills
- Years of experience vs job requirements
- Cover letter quality and relevance
- Location/remote work compatibility`

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      output: Output.object({ schema: RankingResultSchema }),
    })

    return Response.json(result.output)
  } catch (error) {
    console.error('Error ranking candidates:', error)
    return Response.json(
      { error: 'Failed to rank candidates' },
      { status: 500 }
    )
  }
}
