// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import fs from 'node:fs'
import postingEvaluation from './prompt-templates.js'

const resume = fs.readFileSync('./config/resume.txt', 'utf-8')
const interests = fs.readFileSync('./config/interests.txt', 'utf-8')
const prompt = 'Based on the skills and experience on my resume and based on my career interests, assess the suitability of this job posting with a score from 0 to 100. Format your answer with the score as the first line, a short paragraph summarizing the posting in less than 50 words, and finally a summary of your assessment in less than 50 words.'

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
