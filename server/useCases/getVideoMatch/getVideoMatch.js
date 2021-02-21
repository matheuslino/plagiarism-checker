import { getTranscription } from "../../helpers/youtubeApi.js";
import { findMatch } from "../../helpers/videoRecognition.js";

// Temporary. Remove it when youtubeApi is working
// import cutTranscript from "../../transcripts/cut.js";
// import fullTranscript from "../../transcripts/full.js";

const getVideoMatch = (sourceVideo, cutVideo) => {
  const cutTranscript = getTranscription();
  const fullTranscript = getTranscription();
  const matches = findMatch(cutTranscript, fullTranscript, 70);

  const message = matches.length > 0 ? "match found" : "match not found";
  let error = [];

  if (!cutTranscript?.length > 0)
    error.push({
      key: "sourceVideo",
      message: "no transcript found for source video",
    });

  if (!cutTranscript?.length > 0)
    error.push({
      key: "cutVideo",
      message: "no transcript found for cut video",
    });

  return {
    message,
    matches,
    error,
  };
};

export { getVideoMatch };
