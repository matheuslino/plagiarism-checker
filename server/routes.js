import { Router } from "express";

const router = Router();

// default response
const response = {
  message: "resource not foud",
};

router.get("/video-match", (req, res) => {
  response.message = "";
  return res.status(200).send(response);
});

router.get("*", (req, res) => {
  return res.status(404).send(response);
});

export { router };
