export function pick<T extends object, U = T>(obj: T, ...keys: string[]): U {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  ) as U
}

export function omit<T extends object, U = T>(obj: T, ...keys: string[]): U {
  return Object.fromEntries<T>(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  ) as U
}
