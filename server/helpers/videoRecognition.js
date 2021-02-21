/*
====================
  REFERENCES
  ==================
  https://medium.com/@sumn2u/string-similarity-comparision-in-js-with-examples-4bae35f13968
  https://itnext.io/string-similarity-the-basic-know-your-algorithms-guide-3de3d7346227
  https://www.npmjs.com/package/string-similarity
  https://codepad.co/snippet/javascript-calculating-similarity-between-two-strings
*/

import stringSimilarity from "string-similarity";

const convertTranscription = (obj) => {
  return (
    obj?.map((e) => {
      const data = e.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer;
      const formattedOffset = e.transcriptCueGroupRenderer.formattedStartOffset;

      return {
        text: data.cue.simpleText,
        startFormatted: formattedOffset.simpleText,
        start: parseInt(data.startOffsetMs),
        duration: parseInt(data.durationMs),
      };
    }) ?? []
  );
};

const findMatch = (cutVideo, sourceVideo, accuracy) => {
  const timeSpent = Date.now();
  const cut = convertTranscription(cutVideo);
  const source = convertTranscription(sourceVideo);
  const initial = {
    start: { text: null, time: null, formattedTime: null, accuracy: {} },
    end: { text: null, time: null, formattedTime: null, accuracy: {} },
    accuracyList: [],
  };

  const cutSize = cut.length - 1;
  const cutDuration =
    cut[cutSize]?.start + cut[cutSize]?.duration - cut[0]?.start;
  let accuracyList = [];
  let matches = [];
  let startAt = 0;

  for (let i = 0; i < cut.length; i++) {
    const pos = matches.length ? matches.length - 1 : 0;

    for (let j = startAt; j < source.length; j++) {
      const similarity = parseFloat(
        stringSimilarity.compareTwoStrings(cut[i].text, source[j].text) * 100
      ).toFixed(2);

      if (!accuracyList.includes(similarity)) accuracyList.push(similarity);

      if (similarity >= accuracy) {
        if (!matches[pos]?.start?.time) {
          const obj = { ...initial };
          obj.start.text = source[j].text;
          obj.start.time = source[j].start;
          obj.start.formattedTime = source[j].startFormatted;

          matches.push(obj);

          // update startAt to not process frames BEFORE this point in next iterations
          startAt = source.findIndex((el) => el.start === source[j].start);

          matches[pos].start.accuracy = {
            cut: similarity + "%",
            cut: cut[i].text,
            original: source[j].text,
          };

          break;
        } else {
          if (source[j].start - matches[pos].start.time > cutDuration) break;

          matches[pos].end.text = source[j].text;
          matches[pos].end.time = source[j].start;
          matches[pos].end.formattedTime = source[j].startFormatted;

          // TEMP
          matches[pos].end.accuracy = {
            cut: similarity + "%",
            cut: cut[i].text,
            original: source[j].text,
          };
        }
      }
    }

    accuracyList.sort((a, b) => b - a);
    if (matches[pos]) matches[pos].accuracyList = accuracyList;

    // Total time spent
    matches.timeSpent = Date.now() - timeSpent + "ms";

    // Remove element if any end match was found
    // if (!matches[pos]?.end?.time) matches.pop();
  }

  return matches;
};

export { convertTranscription, findMatch };
