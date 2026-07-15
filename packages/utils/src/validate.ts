/**
 * 判断值是否为空
 * - null / undefined → true
 * - 空字符串 / 仅含空白字符 / 字符串 "null" → true
 * - 空数组 [] → true
 * - 空对象 {} → true
 * - 其他（数字 0、布尔 false 等）→ false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    if (value.trim() === "null") {
      return true;
    }
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (Object.prototype.toString.call(value) === "[object Object]") {
    return Object.keys(value).length === 0;
  }

  return false;
}

/** isEmpty 的取反 */
export const isNotEmpty = (value: unknown): boolean => !isEmpty(value);
