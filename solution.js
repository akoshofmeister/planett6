/**
 * LeetCode 2619 - Array Prototype Last
 *
 * Enhances all arrays so that calling array.last()
 * returns the last element, or -1 if the array is empty.
 */

Array.prototype.last = function () {
  return this.length === 0 ? -1 : this[this.length - 1];
};
