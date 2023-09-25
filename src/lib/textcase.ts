// Taken and modified from
// https://github.com/ajayyy/DeArrow/blob/master/src/titles/titleFormatter.ts

const titleCaseNotCapitalized = new Set(["a","an","the","and","but","or","nor","for","yet","so","as","in","of","on","to","from","into","like","over","with","w/","upon","at","by","via","to","vs","v.s.","vs.","ft","ft.","feat","feat.","etc.","etc"])
const allowlistedWords=new Set(["NASA","osu!","PETA","DEFCONConference","DEFCON","HDHR","HDDT","HDDTHR","TUYU","umu.","MIMI","S3RL","NOMA","DECO*27","EVO+","VINXIS","IOSYS","fhána","LGBT","LGBTQ","LGBTQIA","LGBTQ+IA","LGBTQ2S","BIPOC","STFU","TLDR","TOTK","BOTW","SAINTCON","TASBOT","FNAF","IANA","OSHA","NAFTA","SCOTUS","CPAN","SWAT","USAF","ADHD","IONOS","NORAD","UNHRC","LDAC","NVENC","HEVC","NVBFC","IMAX","CUDA","VAAPI","JPEG","IETF","zstd","LZMA","ANOVA","HEIF","HTML","HDTV","HDMI","EULA","GDPR","CCPA","HTTP","HTTPS","BIOS","DMCA","GUID","JSON","MIDI","MMORPG","OLED","RHEL","SFTP","PCIe","SSID","UEFI","UUID","VRAM","XMPP","YAML","OWSLA","DJVI","PSYQUI","INZO","MYRNE","KNOWER","PYLOT","USAO","TESV","WRLD","LAPD","NYPD","NVMe","WYSIWYG","TAS","USSR","Yu-Gi-Oh!","II","III","IV","VI","VII","VIII","XIV","XV","XVI","XVII","XVIII"])
const acronymBlocklist=new Set(["not","see","be","you","are","is","it","of","the","to","new","end","won","sue","day","fly","so","one","two","six","ten","can"]);

export function toLowerCase(str: string) {
  const words = str.split(" ");

  let result = "";
  for (const word of words) {
    if (forceKeepFormatting(word) || keepCase(word)) {
      result += word + " ";
    } else {
      if (word.match(/[ıİ]/u)) {
        result += word.toLocaleLowerCase("tr-TR");
      } else {
        result += word.toLowerCase() + " ";
      }
    }
  }

  return result.trim();
}
export function toUpperCase(str: string) {
  const words = str.split(" ");

  let result = "";
  for (const word of words) {
    if (forceKeepFormatting(word) || keepCase(word)) {
      result += word + " ";
    } else {
      if (word.match(/[ıİ]/u)) {
        result += word.toLocaleLowerCase("az-AZ");
      } else {
        result += word.toUpperCase() + " ";
      }
    }
  }

  return result.trim();
}

export function toFirstLetterUppercase(str: string) {
  const words = str.split(" ");

  let result = "";
  let index = 0;
  for (const word of words) {
    if (forceKeepFormatting(word) || keepCase(word)) {
      result += word + " ";
    } else if (startOfSentence(index, words) && !isNumberThenLetter(word)) {
      result += capitalizeFirstLetter(word) + " ";
    } else {
      result += word.toLowerCase() + " ";
    }

    index++;
  }

  return result.trim();
}

export function toSentenceCase(str: string, ignoreCaps: boolean) {
  const words = str.split(" ");
  const inTitleCase = isInTitleCase(words);
  const mostlyAllCaps = isMostlyAllCaps(words);

  let result = "";
  let index = 0;
  for (const word of words) {
    const trustCaps = shouldTrustCaps(mostlyAllCaps, words, index);

    if (word.match(/^[Ii]$|^[Ii]['’][\p{L}]{1,3}$/u)) {
      result += capitalizeFirstLetter(word) + " ";
    } else if (forceKeepFormatting(word)
        || isAcronymStrict(word)
        || ((!inTitleCase || !isWordCapitalCase(word)) && trustCaps && isAcronym(word))
        || (!inTitleCase && isWordCapitalCase(word))
        || (ignoreCaps && isWordCustomCapitalization(word))
        || (!isAllCaps(word) && isWordCustomCapitalization(word))
        || keepCase(word)) {
      result += word + " ";
    } else {
      if (startOfSentence(index, words) && !isNumberThenLetter(word)) {
        if (!isAllCaps(word) && isWordCustomCapitalization(word)) {
          result += word + " ";
        } else {
          result += capitalizeFirstLetter(word) + " ";
        }
      } else {
        result += word.toLowerCase() + " ";
      }
    }

    index++;
  }

  return result.trim();
}

export function toTitleCase(str: string, ignoreCaps: boolean) {
  const words = str.split(" ");
  const mostlyAllCaps = isMostlyAllCaps(words);

  let result = "";
  let index = 0;
  for (const word of words) {
    const trustCaps = shouldTrustCaps(mostlyAllCaps, words, index);

    if (forceKeepFormatting(word)
        || (ignoreCaps && isWordCustomCapitalization(word))
        || (!isAllCaps(word) && (isWordCustomCapitalization(word) || isNumberThenLetter(word)))
        || isYear(word)
        || keepCase(word)) {
      result += word + " ";
    } else if (!startOfSentence(index, words) && listHasWord(titleCaseNotCapitalized, word.toLowerCase())) {
      // Skip lowercase check for the first word
      result += word.toLowerCase() + " ";
    } else if (isFirstLetterCapital(word) &&
        ((trustCaps && isAcronym(word)) || isAcronymStrict(word))) {
      // Trust it with capitalization
      result += word + " ";
    } else {
      result += capitalizeFirstLetter(word) + " ";
    }

    index++;
  }

  return result.trim();
}

export function toCapitalizeCase(str: string, ignoreCaps: boolean) {
  const words = str.split(" ");
  const mostlyAllCaps = isMostlyAllCaps(words);

  let result = "";
  for (const word of words) {
    if (forceKeepFormatting(word)
        || (ignoreCaps && isWordCustomCapitalization(word))
        || (!isAllCaps(word) && isWordCustomCapitalization(word))
        || (isFirstLetterCapital(word) &&
            ((!mostlyAllCaps && isAcronym(word)) || isAcronymStrict(word)))
        || isYear(word)
        || keepCase(word)) {
      result += word + " ";
    } else {
      result += capitalizeFirstLetter(word) + " ";
    }
  }

  return result.trim();
}

export function isInTitleCase(words: string | string[]) {
  let count = 0;
  let ignored = 0;
  for (const word of words) {
    if (isWordCapitalCase(word)) {
      count++;
    } else if (!isWordAllLower(word) ||
        listHasWord(titleCaseNotCapitalized, word.toLowerCase())) {
      ignored++;
    }
  }

  const length = words.length - ignored;
  return (length > 4 && count > length * 0.8) || count >= length;
}

function shouldTrustCaps(mostlyAllCaps: boolean, words: any[], index: number) {
  return !mostlyAllCaps &&
      !((isAllCaps(words[index - 1]) && !forceKeepFormatting(words[index - 1]))
          || isAllCaps(words[index + 1]) && !forceKeepFormatting(words[index + 1]));
}

export function isMostlyAllCaps(words: string | string[]) {
  let count = 0;
  for (const word of words) {
    // Has at least one char and is upper case
    if (isAllCaps(word)) {
      count++;
    }
  }

  return count > words.length * 0.5;
}

/**
 * Has at least one char and is upper case
 */
function isAllCaps(word: string) {
  return !!word && !!word.match(/[\p{L}]/u)
      && word.toUpperCase() === word
      && !isAcronymStrict(word)
      && !word.match(/^[\p{L}]{1,3}[-~—]/u); // USB-C not all caps, HANDS-ON is
}

function capitalizeFirstLetter(word: string) {
  const result = [];

  if (startsWithEmojiLetter(word)) {
    // Emoji letter is already "capitalized"
    return word.toLowerCase();
  }

  for (const char of word) {
    if (char.match(/[\p{L}]/u)) {
      // converts to an array in order to slice by Unicode code points
      // (for Unicode characters outside the BMP)
      result.push(char.toUpperCase() + [...word].slice(result.length + 1).join("").toLowerCase());
      break;
    } else {
      result.push(char);
    }
  }

  return result.join("");
}

export function isWordCapitalCase(word: string) {
  return !!word.match(/^[^\p{L}]*[\p{Lu}][^\p{Lu}]+$/u);
}

function startsWithEmojiLetter(word: string) {
  return !!word.match(/^[^\p{L}]*[🅰🆎🅱🆑🅾][^\p{Lu}]+$/u);
}

/**
 * Not just capital at start
 */
function isWordCustomCapitalization(word: string) {
  const capitalMatch = word.match(/[\p{Lu}]/gu);
  if (!capitalMatch) return false;

  const capitalNumber = capitalMatch.length;
  return capitalNumber > 1 || (capitalNumber === 1 && !isFirstLetterCapital(word));
}

/**
 * 3rd, 45th
 */
function isNumberThenLetter(word: string) {
  return !!word.match(/^[「〈《【〔⦗『〖〘<({["'‘]*[0-9]+\p{L}[〙〗』⦘〕】》〉」)}\]"']*/u);
}

function isYear(word: string) {
  return !!word.match(/^[「〈《【〔⦗『〖〘<({["'‘]*[0-9]{2,4}'?s[〙〗』⦘〕】》〉」)}\]"']*$/);
}

export function isWordAllLower(word: string) {
  return !!word.match(/^[\p{Ll}]+$/u);
}

export function isFirstLetterCapital(word: string) {
  return !!word.match(/^[^\p{L}]*[\p{Lu}]/u);
}

function forceKeepFormatting(word: string, ignorePunctuation = true) {
  let result = !!word.match(/^>/)
      || listHasWord(allowlistedWords, word);

  if (ignorePunctuation) {
    const withoutPunctuation = word.replace(/[:?.!+\]]+$|^[[+:/]+/, "");
    if (word !== withoutPunctuation) {
      result ||= listHasWord(allowlistedWords, withoutPunctuation);
    }
  }

  // Allow hashtags
  if (!isAllCaps(word) && word.startsWith("#")) {
    return true;
  }

  return result;
}

/**
 * Keep mathematical greek symbols in original case
 */
function keepCase(word: string) {
  return !!word.match(/[Ͱ-Ͽ]/);
}

function isAcronym(word: string) {
  // 2 - 3 chars, or has dots after each letter except last word
  // U.S.A allowed
  // US allowed
  return ((word.length <= 3 || countLetters(word) <= 3)
          && word.length > 1 && isAllCaps(word) && !listHasWord(acronymBlocklist, word.toLowerCase()))
      || isAcronymStrict(word);
}

function countLetters(word: string) {
  return word.match(/[\p{L}]/gu)?.length ?? 0;
}

function isAcronymStrict(word: string) {
  // U.S.A allowed
  return !!word.match(/^[^\p{L}]*(\S\.)+(\S)?$/u);
}

function startOfSentence(index: number, words: string[]) {
  return index === 0 || isDelimiter(words[index - 1]);
}

function isDelimiter(word: string) {
  return (word.match(/^[-:;~—|]$/) !== null
          || word.match(/[:?.!\]]$/) !== null)
      && !listHasWord(allowlistedWords, word);
}

function listHasWord(list: Set<string>, word: string) {
  return list.has(word.replace(/[[「〈《【〔⦗『〖〘<({:〙〗』⦘〕】》〉」)}\]]/g, ""))
}