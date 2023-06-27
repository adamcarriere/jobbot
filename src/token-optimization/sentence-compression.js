import natural from 'natural'

export function applySentenceCompression (str) {
  return natural.PorterStemmer.tokenizeAndStem(str).join(' ')
}
