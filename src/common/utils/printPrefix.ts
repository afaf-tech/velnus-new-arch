import { isNumber } from 'lodash';

/**
 * Print prefix
 *
 * @description
 * Kebanyakan digunakan di error message untuk merapikan pesan
 * jika terdapat 2 ops dengan number atau string pada 1 argumen
 * contohnya:
 * 'User "admin" tidak dapat ditemukan' // jika menggunakan username
 * 'User #10 tidak dapat ditemukan' // jika menggunakan id
 *
 * @example if integer
 * printPrefix(10) // #10
 *
 * @example if string
 * printPrefix('testing') // "testing"
 *
 * @param value
 */
export function printPrefix(value: string | number): string {
  if (isNumber(value)) {
    return `#${value}`;
  }

  return `"${value}"`;
}
