import { Router } from "express";
import { getVideoMatch } from "./useCases/getVideoMatch/getVideoMatch.js";

const router = Router();

// default response
const response = {
  message: "resource not foud",
};

router.get("/video-match/:sourceVideo/:cutVideo", (req, res) => {
  const { sourceVideo, cutVideo } = req.params;
  const response = getVideoMatch(sourceVideo, cutVideo);
  return res.status(200).send(response);
});

router.get("*", (req, res) => {
  return res.status(404).send(response);
});

export { router };
