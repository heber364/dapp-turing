import { extractQuotedText } from "./extractQuotedText";

function getErrorMessage(error: any) {
  if (error?.error?.data?.message) {
    return extractQuotedText(error.error.data.message);
  }else if(error?.reason){
    return error.reason;
  }
  return null;
}

export { getErrorMessage }