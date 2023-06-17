export default async function evaluateListingElement (element) {
  const resultContent = await element.$eval('.resultContent', content => {
    const parseMetadata = (metadata) => {
      if (metadata.length === 0) {
        return []
      }

      return [...metadata].map(d => d.innerText)
    }

    const parseSalary = salaryElement => {
      if (salaryElement == null) {
        return null
      }

      const text = salaryElement.innerText

      const getRate = rate => {
        if (text.includes('hour')) return 'hourly'
        if (text.includes('year')) return 'annually'

        return 'unknown'
      }

      const rate = getRate()

      const [min, max] = text.replace('an hour', '')
        .replace('a year', '')
        .replace(/[F?f]rom/, '')
        .trim()
        .split('–')

      const range = {
        min,
        max
      }
      return {
        range,
        rate
      }
    }

    const { href, innerText, id } = content.querySelector('h2.jobTitle a')

    const company = {
      name: content.querySelector('.company_location .companyName').innerText.trim() ?? 'unknown',
      location: content.querySelector('.company_location .companyLocation').innerText.trim() ?? 'unknown'
    }

    const dataElements = content.querySelectorAll('.metadataContainer .metadata')
    const metadata = parseMetadata(dataElements)
    const salaryElement = content.querySelector('.metadataContainer .metadata.salary-snippet-container')
    const salary = parseSalary(salaryElement)

    return {
      id,
      title: innerText,
      url: href,
      company,
      salary,
      metadata

    }
  })

  const snippet = await element.$eval('.job-snippet', el => el.innerText)
  const { id, ...data } = resultContent
  return {
    [id]: {
      ...data,
      snippet
    }
  }
}
