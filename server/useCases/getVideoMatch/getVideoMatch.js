import { getTranscription } from "../../helpers/youtubeApi.js";
import { findMatch } from "../../helpers/videoRecognition.js";

// Temporary. Remove it when youtubeApi is working
// import cutTranscript from "../../transcripts/cut.js";
// import fullTranscript from "../../transcripts/full.js";

const getVideoMatch = async (sourceVideo, cutVideo) => {
  const fullTranscript = await getTranscription(sourceVideo);
  const cutTranscript = await getTranscription(cutVideo);
  let message;
  let matches = [];
  let error = [];

  //TEMP
  console.log("Cut", cutTranscript);
  console.log("Cut1", fullTranscript);

  if (cutTranscript?.length > 0 && fullTranscript?.length > 0) {
    matches = findMatch(cutTranscript, fullTranscript, 70);
  } else {
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
  }

  message = matches.length > 0 ? "match found" : "match not found";

  return {
    message,
    matches,
    error,
  };
};

export { getVideoMatch };
