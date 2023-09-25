import {toCapitalizeCase, toLowerCase, toSentenceCase, toTitleCase} from "./lib/textcase";
import axios from "axios";

const videos: Map<string, { thumbnailTimestamp: number | null }> = new Map()

/**
 * Update the title with the crowdsourced and title-cased title
 * @param el - The title p element
 * @param id - The YouTube video ID
 * @param config - The GM_config object
 */
async function updateTitle(el: HTMLElement, id: string, config: GM_configStruct) {
  let title = el.innerText;
  let modified = false;
  // if (getInstanceSetting("replaceTitles", instanceSetting)) {
  if (config.get("replace-titles")) {
    // const res = await GM_fetch(`${config.get("api-url")}/api/branding?videoID=${id}`)
    const res = await axios.get<DeArrowAPI>(`${config.get("api-url")}/api/branding?videoID=${id}`)
    const info: DeArrowAPI = res.data
    if (info.thumbnails.length) {
      videos.set(id, { thumbnailTimestamp: info.thumbnails[0].timestamp })
    } else if (info.videoDuration) {
      videos.set(id, { thumbnailTimestamp: info.randomTime * info.videoDuration })
    } else {
      videos.set(id, { thumbnailTimestamp: null })
    }
    // console.log(info)
    const first = info.titles[0]
    if (first && (first.locked || first.votes >= 0 || config.get("force-show"))) {
      modified = true;
      title = first.title;
    }
  }
  switch (config.get("title-casing")) {
    case "Title Case":
      title = toTitleCase(title, modified);
      break;
    case "Sentence case":
      title = toSentenceCase(title, modified);
      break;
    case "lower case":
      title = toLowerCase(title);
      break;
    case "Capitalize Every Word":
      title = toCapitalizeCase(title, modified)
      break;
  }
  el.innerText = title
}
async function updateThumbnail(el: HTMLElement, id: string) {
  console.log(el, id)
}

export default (config: GM_configStruct) => {
  document.querySelectorAll<HTMLDivElement>('div.thumbnail').forEach((e) => {
    const thumbnailEl = e;
    const titleEl = e.parentElement?.children[1].querySelector('p');
    if (!titleEl) return;
    if (!(titleEl.parentElement instanceof HTMLAnchorElement)) return;
    const videoID = new URL(titleEl.parentElement?.href).search.match(/v=([A-Za-z0-9_\-]+)/)?.[1];
    if (!videoID) return;
    updateTitle(titleEl, videoID, config);
    updateThumbnail(thumbnailEl, videoID);
    // console.log(thumbnailEl, titleEl, videoID)
  })
}