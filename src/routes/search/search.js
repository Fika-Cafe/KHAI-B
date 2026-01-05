import { Router } from "express";
import { querySearch } from "../../controllers/search/search.js";

const router = Router();

router.post("/query/:profileId", querySearch);

export default router;