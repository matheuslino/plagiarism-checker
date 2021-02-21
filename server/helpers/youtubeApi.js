import axios from "axios";

const getTranscription = async (videoId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions/${videoId}`
    );
    if (response.status === 200) {
      console.log("response", response);
    } else {
      throw response.data;
    }
  } catch (error) {
    console.log("[Youtube Api Error]", error);
    return [];
  }
};

export { getTranscription };
