export function shortenString(longString: string, maxLength = 40): string {
  if (longString.length <= maxLength) {
    return longString;
  }

  const shortString = longString.substring(0, maxLength - 3) + "...";
  return shortString;
}
