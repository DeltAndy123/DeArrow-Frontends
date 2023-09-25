/**
 * @typedef {Object} DeArrowAPITitle
 * @property {string} title - The video title
 * @property {boolean} original
 * @property {number} votes - The amount of votes for the title
 * @property {boolean} locked - Whether the title is locked
 * @property {string} UUID - The unique identifier of the title
 */
/**
 * @typedef {Object} DeArrowAPIThumbnail
 * @property {number} timestamp - The timestamp of the thumbnail in seconds
 * @property {boolean} original
 * @property {number} votes - The number of votes for the thumbnail
 * @property {boolean} locked - Whether the thumbnail is locked
 * @property {string} UUID - The unique identifier of the thumbnail
 */
/**
 * @typedef {Object} DeArrowAPI
 * @property {Array.<DeArrowAPITitle>} titles - An array of objects that contain information about the titles of the video
 * @property {Array.<DeArrowAPIThumbnail>} thumbnails - An array of objects that contain information about the thumbnails of the video
 * @property {number} randomTime - A number that should be multiplied by `videoDuration` for the timestamp of the randomly generated thumbnail
 * @property {number} videoDuration - The duration of the video in seconds
 */
interface DeArrowAPI {
  titles: DeArrowAPITitle[];
  thumbnails: DeArrowAPIThumbnail[];
  randomTime: number;
  videoDuration: number;
}
interface DeArrowAPITitle {
  title: string;
  original: boolean;
  votes: number;
  locked: boolean;
  UUID: string;
}
interface DeArrowAPIThumbnail {
  timestamp: number;
  original: boolean;
  votes: number;
  locked: boolean;
  UUID: string;
}