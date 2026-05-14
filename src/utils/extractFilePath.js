export function extractFilePath(
  imageUrl
) {
  const url =
    new URL(imageUrl);

  const parts =
    url.pathname.split("/");

  return parts.slice(3).join("/");
}