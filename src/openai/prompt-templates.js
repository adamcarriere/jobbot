// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

const postingEvaluation = ({ posting, resume, interests, prompt }) =>
`[JOB POSTING]
${posting}
[END JOB POSTING]

[RESUME]
${resume}
[END RESUME]

[CAREER INTERESTS]
${interests}
[END CAREER INTERESTS]

[EVALUATION]
${prompt}`

export default postingEvaluation
