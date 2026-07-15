import { v4 as uuidv4 } from "uuid";

/** 生成去除横杠的 UUID v4 字符串 */
export function generateId(): string {
  return uuidv4().replace(/-/g, "");
}
