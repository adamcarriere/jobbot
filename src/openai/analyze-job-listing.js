import fs from 'node:fs'
import postingEvaluation from './prompt-templates.js'

const resume = fs.readFileSync('./config/resume.txt', 'utf-8')
const interests = fs.readFileSync('./config/interests.txt', 'utf-8')
const prompt = fs.readFileSync('./config/prompt.txt', 'utf-8')

export default posting => {
  const content = postingEvaluation({ posting, resume, interests, prompt })

  return {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert career counsellor helping me find a new job.' },
      { role: 'user', content }
    ]
  }
}
