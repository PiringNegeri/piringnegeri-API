import supabase from "../lib/supabase.js";

import { extractFilePath }
  from "../utils/extractFilePath.js";

export async function deleteReportFiles(
  images
) {
  try {
    if (!images?.length) return;

    const filePaths =
      images.map((img) =>
        extractFilePath(
          img.imageUrl
        )
      );

    await supabase.storage
      .from("reports")
      .remove(filePaths);

    console.log(
      "Success: Storage cleaned"
    );
  } catch (error) {
    console.error(
      "Failed: Storage cleanup failed wok",
      error
    );
  }
}