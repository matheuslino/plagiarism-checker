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
import cutTranscript from "./transcripts/cut.js";
import fullTranscript from "./transcripts/full.js";

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

const findMatch = (value, source, accuracy) => {
  const timeSpent = Date.now();
  const initial = {
    start: { text: null, time: null, formattedTime: null, accuracy: {} },
    end: { text: null, time: null, formattedTime: null, accuracy: {} },
    accuracyList: [],
  };

  const cutSize = value.length - 1;
  const cutDuration =
    value[cutSize]?.start + value[cutSize]?.duration - value[0]?.start;
  let accuracyList = [];
  let matches = [];
  let startAt = 0;

  for (let i = 0; i < value.length; i++) {
    const pos = matches.length ? matches.length - 1 : 0;

    for (let j = startAt; j < source.length; j++) {
      const similarity = parseFloat(
        stringSimilarity.compareTwoStrings(value[i].text, source[j].text) * 100
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
            value: similarity + "%",
            original: source[j].text,
            cut: value[i].text,
          };

          break;
        } else {
          if (source[j].start - matches[pos].start.time > cutDuration) break;

          matches[pos].end.text = source[j].text;
          matches[pos].end.time = source[j].start;
          matches[pos].end.formattedTime = source[j].startFormatted;

          // TEMP
          matches[pos].end.accuracy = {
            value: similarity + "%",
            original: source[j].text,
            cut: value[i].text,
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

const cut = convertTranscription(cutTranscript);
const full = convertTranscription(fullTranscript);
const output = findMatch(cut, full, 70);

console.log("=============================================================");
console.log(" OUTPUT DETAILS - VIDEO MATCH");
console.log("=============================================================");
console.log(output);

const aa = [
  {
    start: {
      text: "Lost era uma coisa que mesmo para Lost",
      time: 2136670,
      formattedTime: "35:36",
      accuracy: {
        value: "76.67%",
        original: "Lost era uma coisa que mesmo para Lost",
        cut: "o seriado Lost era uma coisa que mesmo",
      },
    },
    end: {
      text: "acabou encontrando uma casa abandonada e",
      time: 2316610,
      formattedTime: "38:36",
      accuracy: {
        value: "76.19%",
        original: "acabou encontrando uma casa abandonada e",
        cut: "oi e ela acabou encontrando uma casa",
      },
    },
    accuracyList: [
      "100.00",
      "98.41",
      "96.67",
      "96.30",
      "95.24",
      "94.74",
      "93.55",
      "86.67",
      "84.75",
      "84.38",
      "83.87",
      "83.64",
      "83.33",
      "82.14",
      "80.65",
      "80.00",
      "79.31",
      "78.57",
      "77.42",
      "76.67",
      "76.36",
      "76.19",
      "75.41",
      "75.00",
      "73.33",
      "73.02",
      "72.00",
      "71.70",
      "71.19",
      "70.00",
      "69.84",
      "69.23",
      "68.97",
      "66.67",
      "65.63",
      "65.52",
      "64.62",
      "62.07",
      "61.54",
      "61.29",
      "61.02",
      "60.00",
      "59.26",
      "58.62",
      "57.58",
      "57.14",
      "56.67",
      "56.14",
      "55.74",
      "55.17",
      "53.33",
      "53.13",
      "52.83",
      "52.46",
      "51.72",
      "51.61",
      "50.91",
      "50.79",
      "50.00",
      "49.18",
      "49.12",
      "49.06",
      "48.39",
      "48.28",
      "48.15",
      "48.00",
      "47.62",
      "47.46",
      "47.27",
      "47.06",
      "46.88",
      "46.67",
      "46.43",
      "46.15",
      "45.90",
      "45.61",
      "45.28",
      "45.16",
      "45.00",
      "44.90",
      "44.83",
      "44.44",
      "44.07",
      "44.00",
      "43.75",
      "43.64",
      "43.33",
      "43.24",
      "43.14",
      "43.08",
      "42.86",
      "42.62",
      "42.42",
      "42.31",
      "42.11",
      "41.94",
      "41.51",
      "41.38",
      "41.27",
      "40.82",
      "40.74",
      "40.68",
      "40.63",
      "40.00",
      "39.39",
      "39.34",
      "39.29",
      "39.22",
      "39.02",
      "38.89",
      "38.81",
      "38.71",
      "38.60",
      "38.46",
      "38.30",
      "38.24",
      "38.10",
      "37.93",
      "37.84",
      "37.74",
      "37.50",
      "37.29",
      "37.21",
      "37.04",
      "36.92",
      "36.84",
      "36.73",
      "36.67",
      "36.36",
      "36.07",
      "36.00",
      "35.90",
      "35.82",
      "35.71",
      "35.56",
      "35.48",
      "35.29",
      "35.09",
      "35.00",
      "34.92",
      "34.78",
      "34.62",
      "34.48",
      "34.38",
      "34.29",
      "34.15",
      "34.04",
      "33.96",
      "33.90",
      "33.85",
      "33.33",
      "32.84",
      "32.79",
      "32.73",
      "32.65",
      "32.56",
      "32.43",
      "32.26",
      "32.14",
      "32.00",
      "31.82",
      "31.75",
      "31.58",
      "31.37",
      "31.25",
      "31.11",
      "31.03",
      "30.77",
      "30.51",
      "30.43",
      "30.30",
      "30.19",
      "30.00",
      "29.85",
      "29.79",
      "29.63",
      "29.51",
      "29.41",
      "29.27",
      "29.17",
      "29.09",
      "29.03",
      "28.57",
      "28.13",
      "28.07",
      "28.00",
      "27.91",
      "27.78",
      "27.69",
      "27.59",
      "27.45",
      "27.27",
      "27.12",
      "27.03",
      "26.92",
      "26.87",
      "26.67",
      "26.47",
      "26.42",
      "26.32",
      "26.23",
      "26.09",
      "25.93",
      "25.81",
      "25.64",
      "25.53",
      "25.45",
      "25.40",
      "25.00",
      "24.62",
      "24.56",
      "24.49",
      "24.39",
      "24.24",
      "24.14",
      "24.00",
      "23.88",
      "23.81",
      "23.73",
      "23.53",
      "23.33",
      "23.26",
      "23.08",
      "22.95",
      "22.86",
      "22.73",
      "22.64",
      "22.58",
      "22.22",
      "21.88",
      "21.82",
      "21.74",
      "21.62",
      "21.54",
      "21.43",
      "21.28",
      "21.21",
      "21.05",
      "20.90",
      "20.83",
      "20.69",
      "20.59",
      "20.51",
      "20.41",
      "20.34",
      "20.00",
      "19.67",
      "19.61",
      "19.51",
      "19.35",
      "19.23",
      "19.05",
      "18.87",
      "18.75",
      "18.60",
      "18.52",
      "18.46",
      "18.18",
      "17.91",
      "17.86",
      "17.78",
      "17.65",
      "17.54",
      "17.39",
      "17.24",
      "17.14",
      "17.02",
      "16.95",
      "16.67",
      "16.39",
      "16.33",
      "16.22",
      "16.13",
      "16.00",
      "15.87",
      "15.79",
      "15.69",
      "15.63",
      "15.38",
      "15.15",
      "15.09",
      "15.00",
      "14.93",
      "14.81",
      "14.71",
      "14.63",
      "14.55",
      "14.29",
      "14.04",
      "13.95",
      "13.79",
      "13.64",
      "13.56",
      "13.33",
      "13.11",
      "13.04",
      "12.90",
      "12.77",
      "12.70",
      "12.50",
      "12.31",
      "12.24",
      "12.12",
      "12.00",
      "11.94",
      "11.76",
      "11.54",
      "11.43",
      "11.32",
      "11.11",
      "10.91",
      "10.81",
      "10.71",
      "10.53",
      "10.34",
      "10.26",
      "10.17",
      "10.00",
      "9.84",
      "9.76",
      "9.68",
      "9.52",
      "9.38",
      "9.30",
      "9.23",
      "9.09",
      "8.96",
      "8.89",
      "8.82",
      "8.70",
      "8.51",
      "8.33",
      "8.16",
      "8.00",
      "7.84",
      "7.69",
      "7.55",
      "7.41",
      "7.27",
      "7.14",
      "7.02",
      "6.90",
      "6.78",
      "6.67",
      "6.56",
      "6.45",
      "6.35",
      "6.25",
      "6.15",
      "6.06",
      "5.97",
      "5.88",
      "5.71",
      "5.56",
      "5.41",
      "5.26",
      "5.13",
      "5.00",
      "4.88",
      "4.76",
      "4.65",
      "4.55",
      "4.44",
      "4.35",
      "4.26",
      "4.17",
      "4.08",
      "4.00",
      "3.92",
      "3.85",
      "3.77",
      "3.70",
      "3.64",
      "3.57",
      "3.51",
      "3.45",
      "3.39",
      "3.33",
      "3.28",
      "3.23",
      "3.17",
      "3.13",
      "3.08",
      "3.03",
      "2.99",
      "2.94",
      "0.00",
    ],
  },
];
