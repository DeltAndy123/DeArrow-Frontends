/**
 * Wait for a value to be defined in an object or map
 * @param {Object | Map} obj - The object or map to listen to
 * @param key - The key to wait for
 * @param {number} timeout - The timeout in milliseconds
 * @returns {Promise<*>} - The value of the key
 */
export function waitForValue<K, V>(obj: Record<string, V> | Map<K, V>, key: K, timeout: number): Promise<V> {
  return new Promise((resolve, reject) => {
    const timeoutID = setTimeout(() => {
      reject(new Error(`Couldn't find key ${key} in object ${obj} in ${timeout} milliseconds`))
    }, timeout)
    const intervalID = setInterval(() => {
      let val: V | undefined;
      if (obj instanceof Map) {
        val = obj.get(key)
      } else {
        val = obj[(key as string)]
      }
      if (val === undefined || val === null) return
      resolve(val)
      clearTimeout(timeoutID)
      clearInterval(intervalID)
    }, 10)
  })
}

/**
 * Round a number to a certain number of digits
 * @param num - The number to round
 * @param digits - The number of digits to round to
 */
export function roundDigits(num: number, digits?: number): number {
  const factor = 10 ** (digits || 0)
  return Math.round(num * factor) / factor
}