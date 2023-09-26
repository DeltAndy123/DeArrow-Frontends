import {toCapitalizeCase, toLowerCase, toSentenceCase, toTitleCase} from "./lib/textutil";
import axios from "axios";
import {roundDigits, waitForValue} from "./lib/util";
import {Buffer} from "buffer";

const videos: Map<string, DeArrowAPI> = new Map()

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
    const info = await waitForValue(videos, id, 5_000)
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
async function updateThumbnail(el: HTMLImageElement, id: string, config: GM_configStruct) {
  const thumbnail = await axios.get<ArrayBuffer>(`${config.get("thumbnail-url")}/api/v1/getThumbnail?videoID=${id}`, {
    responseType: "arraybuffer"
  })
  if (thumbnail.status !== 200) {
    console.error(`Error ${thumbnail.status} getting thumbnail for ${id}:\n`, JSON.parse(new TextDecoder().decode(thumbnail.data)))
    return
  }
  const thumbnailTimestamp = thumbnail.headers["x-timestamp"]
  let base64: string
  const apiRes = await waitForValue(videos, id, 5_000)
  if (!apiRes) return
  let timestamp: number | null = null
  if (apiRes.thumbnails.length) {
    timestamp = apiRes.thumbnails[0].timestamp
  } else if (apiRes.videoDuration) {
    timestamp = apiRes.randomTime * apiRes.videoDuration
  }
  if (!timestamp || roundDigits(timestamp, 4) === roundDigits(thumbnailTimestamp, 4)) {
    //TODO: If timestamp doesn't exist in the API, so we have to manually extract it from the DOM
    // For now, just accept the thumbnail
    base64 = Buffer.from(thumbnail.data).toString("base64")
  } else {
    // Get the thumbnail using the API time instead
    const newThumbnail = await axios.get<string>(`${config.get("thumbnail-url")}/api/v1/getThumbnail?videoID=${id}&time=${timestamp}`, {
      responseType: "arraybuffer"
    })
    base64 = Buffer.from(newThumbnail.data).toString("base64")
  }
  el.src = `data:${thumbnail.headers["content-type"]};base64,${base64}`
}

export default (config: GM_configStruct) => {
  document.querySelectorAll<HTMLDivElement>('div.thumbnail').forEach((e) => {
    const imgEl = e.querySelector('img');
    if (!imgEl) return;
    const titleEl = e.parentElement?.children[1].querySelector('p');
    if (!titleEl) return;
    if (!(titleEl.parentElement instanceof HTMLAnchorElement)) return;
    const videoID = new URL(titleEl.parentElement?.href).search.match(/v=([A-Za-z0-9_\-]+)/)?.[1];
    if (!videoID) return;
    axios.get<DeArrowAPI>(`${config.get("api-url")}/api/branding?videoID=${videoID}`)
        .then((res) => {
          videos.set(videoID, res.data)
        })
    if (config.get("replace-titles")) updateTitle(titleEl, videoID, config);
    if (config.get("replace-thumbnails")) updateThumbnail(imgEl, videoID, config);
    // console.log(thumbnailEl, titleEl, videoID)
  })
}