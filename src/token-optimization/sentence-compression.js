// Copyright: (c) 2023, Adam Carriere <carriere.ae@gmail.com>
// GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)

import natural from 'natural'

export function tokenizeAndStemString (str) {
  return natural.PorterStemmer.tokenizeAndStem(str).join(' ')
}
