import { Router } from "express";
import { requestOtp, verifyOtp, resendOtp } from "../controllers/authController";

const router = Router();

router.post("/login", requestOtp);
router.post("/verify_otp", verifyOtp);
router.post("/resend_otp", resendOtp);
export default router;
