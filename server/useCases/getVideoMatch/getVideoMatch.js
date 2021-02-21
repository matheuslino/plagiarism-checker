import { findMatch } from "../../helpers/videoRecognition.js";

// Temporary. Remove it when youtubeApi is working
import cutTranscript from "../../transcripts/cut.js";
import fullTranscript from "../../transcripts/full.js";

const output = findMatch(cutTranscript, fullTranscript, 70);
