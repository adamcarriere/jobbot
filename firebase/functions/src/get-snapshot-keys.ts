import { type DataSnapshot } from 'firebase-admin/database'

export default (snapshot: DataSnapshot): string[] => {
  if (snapshot.exists()) return Object.keys(snapshot.val())

  return []
}
