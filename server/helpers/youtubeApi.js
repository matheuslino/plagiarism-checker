import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const getTranscription = async (videoId) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `https://subtitles-for-youtube.p.rapidapi.com/subtitles/${videoId}`,
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "subtitles-for-youtube.p.rapidapi.com",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw response.data;
    }
  } catch (error) {
    console.log("[Youtube Api Error]", error);
    return [];
  }
};

export { getTranscription };
