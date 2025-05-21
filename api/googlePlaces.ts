import axios from "axios";

export type Headers = {
  contentType: string;
  apiKey: string;
  fieldMask: string;
};

export type Data = {
  textQuery: string;
  languageCode: string;
  regionCode: string;
  pageToken?: string;
};

export async function fetchPlaceSuggestions(data: Data, headers: Headers) {
  const requestBody: any = {
    textQuery: data.textQuery,
    languageCode: data.languageCode,
    regionCode: data.regionCode,
  };

  // ✅ pageToken이 있을 때만 추가
  if (data.pageToken) {
    requestBody.pageToken = data.pageToken;
  }
  const res = await axios.post(
    "https://places.googleapis.com/v1/places:searchText",
    requestBody,
    {
      headers: {
        "Content-Type": headers.contentType,
        "X-Goog-Api-Key": headers.apiKey,
        "X-Goog-FieldMask": headers.fieldMask,
      },
    }
  );
  return res;
}
