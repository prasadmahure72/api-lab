export function isValidJson(str: string): boolean {
  if (!str.trim()) return false
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function parseJson(str: string): { data: unknown; error: string | null } {
  try {
    return { data: JSON.parse(str), error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}
