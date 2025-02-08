function extractQuotedText(text: string) {
  const match = text.match(/'([^']+)'/);
  return match ? match[1] : "";
}
export { extractQuotedText}
