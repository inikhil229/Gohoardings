export const getImageUrl = (item) => {
  if (!item?.thumb) {
    return "/images/web_pics/alter-img.png";
  }

  // Remove spaces from the beginning/end first
  const thumb = item.thumb.trim();

  // If thumb is already a complete URL
  if (thumb.startsWith("https://")) {
    let url = thumb;

    // Fix only the broken URLs
    if (
      url.includes("other_company.odoads.com") &&
      url.includes("/media/other_company/media/images/")
    ) {
      url = url
        .replace(/^https:\/\/[^/]+\.odoads\.com/, "https://odoads.com")
        .replace(
          "/media/other_company/media/images/",
          "/media/goh_v197/media/images/",
        );
    }


    return url;
  }

  // Existing logic for relative image names
  const company = (item?.mediaownercompanyname ?? "default_name")
    .trim()
    .split(" ")
    .slice(0, 2)
    .join("_")
    .toLowerCase();

  return `https://${company}.odoads.com/media/${company}/media/images/new${thumb}`;
};
