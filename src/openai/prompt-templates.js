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
