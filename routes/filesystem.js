import express from 'express';

const router = express.Router();

router.get("/", async (req, res, next) => {
  logger.info("Getting overall file system index of users");
  try{
    res.status(200).json({"abc":"Def"});
  } catch (err) {
    logger.error(`Error: ${err} `)
    if (err.status) {
      return res.status(err.status).json({ error: err.error });
    }
    return res.status(500).json({ err: "Something went wrong! While getting users list." });
  }
});

export default router;