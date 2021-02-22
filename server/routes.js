import { Router } from "express";
import { getVideoMatch } from "./useCases/getVideoMatch/getVideoMatch.js";

const router = Router();

router.get("/video-match/:sourceVideo/:cutVideo", async (req, res) => {
  const { sourceVideo, cutVideo } = req.params;
  const response = await getVideoMatch(sourceVideo, cutVideo);
  return res.status(200).send(response);
});

router.get("*", (req, res) => {
  return res.status(404).send({
    message: "resource not foud",
  });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: "Internal server error",
  });
});

export { router };
