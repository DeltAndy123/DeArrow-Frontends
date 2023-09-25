import axios from "axios";
import fetchAdapter from "./lib/adapter";
import {$$, settingsIcon} from "./lib/elements";
import {list} from "./lib/gmconfigtypes";
import invidious from "./invidious";
axios.defaults.adapter = fetchAdapter;

const frame = $$("div")
document.body.appendChild(frame);

// GM.registerMenuCommand("Settings", () => {
//   alert("pressed")
// })
const config = new GM_config<"list">({
  id: "dearrow",
  title: "DeArrow Settings",
  fields: {
    "instances": {
      label: "Instance Hosts",
      type: "list",
      default: ["invidious.asir.dev"],
      title: "Domains for the instances to run on. Don't include the protocol (http:// or https://) or the slash at the end.",
    },
    "replace-titles": {
      label: "Replace Titles",
      type: "checkbox",
      default: true,
      title: "Replace the video titles with crowd-sourced titles from DeArrow.",
    },
    "replace-thumbnails": {
      label: "Replace Thumbnails",
      type: "checkbox",
      default: true,
      title: "Replace the video thumbnails with crowd-sourced thumbnails from DeArrow.",
    },
    "title-casing": {
      label: "Title Casing",
      type: "select",
      options: ["Don't change case", "Title Case", "Sentence case", "lower case", "Capitalize Every Word"],
      default: "Title Case",
      title: "Change the case of the video titles.",
    },
    "clean-title": {
      label: "Clean Title Punctuation",
      type: "checkbox",
      default: true,
      title: "Remove excess punctuation from the video titles.",
    },
    "force-show": {
      label: "Force Show Titles",
      type: "checkbox",
      default: false,
      title: "Show crowd-sourced video titles even if they are unverified (might be unrelated to the video).",
    },
    "api-url": {
      label: "DeArrow API URL",
      type: "text",
      default: "https://sponsor.ajay.app",
      title: "The URL of the DeArrow API to use. If you don't know what this is, don't change it.",
    },
    "thumbnail-url": {
      label: "Thumbnail Cache URL",
      type: "text",
      default: "https://dearrow-thumb.ajay.app",
      title: "The URL of the thumbnail cache API to use. If you don't know what this is, don't change it.",
    }
  },
  events: {
    init: () => {
      console.log("init");
      invidious(config)
    },
    save: () => {
      console.log("save")
    }
  },
  types: {
    list,
  },
  css: `
  #dearrow {
    background-color: rgba(30, 30, 30, 1);
    color: #f0f0f0;
  }
  #dearrow_wrapper {
    margin: 20px;
  }
  #dearrow .config_var {
    margin-bottom: 1em;
  }
  .config_var select {
    height: 2.25em;
    padding: .5em .6em;
    border-radius: 4px;
    background: #fff;
    border: 1px solid #ccc;
  }
  .config_var input:not([type="checkbox"]) {
    background-color: #fff;
    color: rgba(35, 35, 35, 1);
    border: 1px solid #444;
    height: 2.25em;
    padding: 0.5em 0.6em;
    border-radius: 4px;
    font-size: 12pt;
    box-sizing: border-box;
  }
  .config_var span.input-container:after {
    display: block;
    content: "";
  }
  .config_var span.input-container:not(.config_var span.input-container:first-of-type) {
    left: calc(192px + 1em);
    position: relative;
  }
  #dearrow .field_label {
    font-size: 12pt;
    font-weight: normal;
    display: inline-block;
    width: 12em;
    text-align: right;
    margin-right: 1em;
  }
  #dearrow .field_label:after {
    content: ":";
  }
  .list-add, .list-remove {
    font-size: 20pt;
    background: none;
    border: none;
    position: relative;
  }
  .list-add {
    left: 455px;
    bottom: 33px;
  }
  .list-remove {
    top: 5px;
  }
  button.list-remove:hover i:before {
    content: "\uf1fb";
    color: rgba(0, 182, 240, 1);
  }
  button.list-add:hover i:before {
    content: "\uf101";
    color: rgba(0, 182, 240, 1);
  }
  #dearrow .saveclose_buttons {
    padding: 0.5em 1em;
    background-color: #a0a0a0;
    color: rgba(35, 35, 35, 1);
    border: 1px solid #a0a0a0;
    border-radius: 3px;
  }
  #dearrow #dearrow_closeBtn {
    background-color: #0002;
    color: #ddd;
  }
  #dearrow .saveclose_buttons:hover, #dearrow .saveclose_buttons:focus {
    color: #fff !important;
    border-color: rgb(0, 182, 240) !important;
    background-color: rgba(0, 182, 240, 1) !important;
  }
  .reset_holder {
    text-align: left;
  }
  #dearrow .reset {
    color: #a0a0a0;
    font-size: 10pt;
  }
  #dearrow .reset:hover {
    color: rgb(0, 182, 240);
  }
  `,
  frame: frame
})


if (document.querySelector("link[title=Invidious]")) {
  const buttonBar = document.querySelector(".user-field");
  if (!buttonBar) throw new Error("Could not find button bar");
  const settingsButton = $$<"div">("div.pure-u-1-4",
      $$("a.pure-menu-heading.dearrow-settings", {
        title: "DeArrow Settings",
        href: "#",
        listeners: {
          click: (e) => {
            e.preventDefault();
            config.open();
          }
        }
      }, settingsIcon)
  )

  document.head.appendChild($$("style", `
    .dearrow-settings {
      filter: grayscale(100%);
      position: relative;
      top: 1px;
    }
    .dearrow-settings:hover {
      filter: grayscale(0%);
    }
  `))
  buttonBar.insertBefore(settingsButton, buttonBar.children[2])
}