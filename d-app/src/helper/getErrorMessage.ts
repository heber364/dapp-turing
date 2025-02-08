import { extractQuotedText } from "./extractQuotedText";

function getErrorMessage(error: any) {
  if (error?.error?.body) {
      const errorParser = JSON.parse(error.error.body);
      if (errorParser?.error?.message) {
          return extractQuotedText(errorParser.error.message);
      }
  }
  return null;
}

export { getErrorMessage }