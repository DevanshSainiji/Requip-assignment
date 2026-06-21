/**
 * parseId — safely parses a URL route parameter as a positive integer.
 *
 * Returns null when:
 *   - param is undefined (route param missing — shouldn't happen but noUncheckedIndexedAccess
 *     types req.params values as `string | undefined`)
 *   - param is not a valid integer string (e.g. "abc", "1.5")
 *   - parsed value is zero or negative
 *
 * Usage:
 *   const id = parseId(req.params['id']);
 *   if (id === null) { sendError(res, 'Invalid user ID', 400); return; }
 */
export const parseId = (param: string | undefined): number | null => {
  if (!param) return null;
  const id = parseInt(param, 10);
  // isNaN guard: parseInt('abc') → NaN; <= 0 guard: IDs are always positive
  return isNaN(id) || id <= 0 ? null : id;
};
