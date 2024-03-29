// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import englishKeywords from './english-keywords.js'
import frenchHalts from './french-halts.js'
import filterByLanguageComparison from './filter-by-language-comparison.js'
import { tokenizeAndStemString } from './sentence-compression.js'
import { encode } from 'gpt-3-encoder'
export default function optimizeListing (listing) {
  // remove any french text from the description
  const { description } = listing

  console.log(`======== Optimizing ${listing.id} ==========`)
  console.log(listing.url)

  const initTokenCount = encode(description).length
  console.log(`Initial token count: ${initTokenCount}`)

  const english = filterByLanguageComparison(description,
    'eng',
    'fra',
    {
      matchExpression: englishKeywords,
      haltExpression: frenchHalts
      // verbose: true
    }
  )

  if (english == null) {
    console.log('... french only')
    return {
      ...listing,
      status: 'NO_ENGLISH'
    }
  }

  const englishTokenCount = encode(english).length
  console.log(`... after English: ${englishTokenCount}`)

  const compressed = tokenizeAndStemString(english)

  const compressedTokenCount = encode(compressed).length
  console.log(`... after compression: ${compressedTokenCount}`)

  return {
    ...listing,
    english,
    compressed,
    status: 'OPTIMIZED'
  }
}
