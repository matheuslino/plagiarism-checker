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
  const initial = {
    start: { text: null, time: null, formattedTime: null, accuracy: {} },
    end: { text: null, time: null, formattedTime: null, accuracy: {} },
    accuracyList: [],
  };

  const cutVideoSize = cutVideo.length - 1;
  const cutVideoDuration =
    cutVideo[cutVideoSize]?.start +
    cutVideo[cutVideoSize]?.dur -
    cutVideo[0]?.start;
  let accuracyList = [];
  let matches = [];
  let startAt = 0;

  for (let i = 0; i < cutVideo.length; i++) {
    const pos = matches.length ? matches.length - 1 : 0;

    for (let j = startAt; j < sourceVideo.length; j++) {
      const similarity = parseFloat(
        stringSimilarity.compareTwoStrings(
          cutVideo[i].text,
          sourceVideo[j].text
        ) * 100
      ).toFixed(2);

      if (!accuracyList.includes(similarity)) accuracyList.push(similarity);

      if (similarity >= accuracy) {
        if (!matches[pos]?.start?.time) {
          const obj = { ...initial };
          obj.start.text = sourceVideo[j].text;
          obj.start.time = sourceVideo[j].start;
          obj.start.formattedTime = sourceVideo[j].startFormatted;

          matches.push(obj);

          // update startAt to not process frames BEFORE this point in next iterations
          startAt = sourceVideo.findIndex(
            (el) => el.start === sourceVideo[j].start
          );

          matches[pos].start.accuracy = {
            cutVideo: similarity + "%",
            cutVideo: cutVideo[i].text,
            original: sourceVideo[j].text,
          };

          break;
        } else {
          if (sourceVideo[j].start - matches[pos].start.time > cutVideoDuration)
            break;

          matches[pos].end.text = sourceVideo[j].text;
          matches[pos].end.time = sourceVideo[j].start;
          matches[pos].end.formattedTime = sourceVideo[j].startFormatted;

          // TEMP
          matches[pos].end.accuracy = {
            cutVideo: similarity + "%",
            cutVideo: cutVideo[i].text,
            original: sourceVideo[j].text,
          };
        }
      }
    }

    accuracyList.sort((a, b) => b - a);
    if (matches[pos]) matches[pos].accuracyList = accuracyList;

    // Remove element if any end match was found
    // if (!matches[pos]?.end?.time) matches.pop();
  }

  return matches;
};

export { convertTranscription, findMatch };
