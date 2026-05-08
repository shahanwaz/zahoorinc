import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { sendWhatsAppOtp } from "@/functions/sendWhatsAppOtp";
import { Loader2, ChevronDown, ArrowLeft, MessageCircle } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
];

const OTP_LENGTH = 6;

export default function WhatsAppLogin() {
  const navigate = useNavigate();

  const [step, setStep] = useState("phone");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (step !== "otp") return;
    setCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const fullPhone = `${selectedCountry.code}${phone}`;
  const isPhoneValid = phone.replace(/\D/g, "").length >= 7;
  const isOtpComplete = otp.every((d) => d !== "");

  const handleSendOtp = async () => {
    setPhoneError("");
    if (!isPhoneValid) { setPhoneError("Please enter a valid WhatsApp number."); return; }
    setSendingOtp(true);
    try {
      await sendWhatsAppOtp({ phone: fullPhone, action: "send" });
      setStep("otp");
    } catch (err) {
      setPhoneError(err?.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setOtpError("");
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index]) { newOtp[index] = ""; setOtp(newOtp); }
      else if (index > 0) { otpRefs.current[index - 1]?.focus(); newOtp[index - 1] = ""; setOtp(newOtp); }
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    if (!isOtpComplete) { setOtpError("Please enter the complete 6-digit OTP."); return; }
    setVerifying(true);
    try {
      const res = await sendWhatsAppOtp({ phone: fullPhone, otp: otp.join(""), action: "verify" });
      if (res.data?.isExistingUser) {
        navigate(createPageUrl("Home"));
      } else {
        navigate(createPageUrl("Onboarding"));
      }
    } catch (err) {
      setOtpError(err?.response?.data?.error || "Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setSendingOtp(true);
    try {
      await sendWhatsAppOtp({ phone: fullPhone, action: "send" });
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: "linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 40%, #d1fae5 100%)" }}>

      {/* Islamic geometric bg */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23059669' stroke-width='1'%3E%3Cpolygon points='30,5 55,20 55,40 30,55 5,40 5,20'/%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }} />

      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 w-full max-w-sm mx-auto px-5 py-10 flex flex-col items-center">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white ring-opacity-60 mb-4"
            style={{ boxShadow: "0 8px 32px rgba(16,185,129,0.25)" }}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png"
              alt="Zahoor" className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-emerald-900 leading-tight">Welcome to Zahoor</h1>
          <p className="text-emerald-600 text-sm font-medium mt-1 tracking-wide">ظهور — Hearts Await Zahoor</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ─── PHONE STEP ─── */}
          {step === "phone" && (
            <motion.div key="phone"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 8px 40px rgba(16,185,129,0.12)", border: "1px solid rgba(167,243,208,0.5)" }}>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-emerald-900">Enter Your Number</h2>
                <p className="text-sm text-gray-500 mt-1">We'll send a verification code to your WhatsApp</p>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 block">
                  WhatsApp Number
                </label>
                <div className="flex gap-2 relative">
                  {/* Country picker trigger */}
                  <button type="button"
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="flex items-center gap-1.5 px-3 rounded-xl font-semibold text-sm focus:outline-none transition-colors whitespace-nowrap flex-shrink-0"
                    style={{ height: "48px", border: "2px solid #a7f3d0", background: "#f0fdf4", color: "#065f46" }}>
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown className="w-3 h-3" style={{ color: "#10b981" }} />
                  </button>

                  {showCountryPicker && (
                    <div className="absolute z-50 top-14 left-0 w-56 rounded-2xl shadow-2xl border border-emerald-100 max-h-60 overflow-y-auto"
                      style={{ background: "white" }}>
                      {COUNTRY_CODES.map((c) => (
                        <button key={c.code} type="button"
                          onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${selectedCountry.code === c.code ? "bg-emerald-50 text-emerald-700 font-bold" : "text-gray-700 hover:bg-emerald-50"}`}>
                          <span>{c.flag}</span>
                          <span className="font-medium">{c.name}</span>
                          <span className="ml-auto text-gray-400 text-xs">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <input
                    type="tel" inputMode="numeric"
                    placeholder="Enter WhatsApp Number"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setPhoneError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && isPhoneValid) handleSendOtp(); }}
                    autoFocus
                    className="flex-1 px-4 rounded-xl font-medium text-base focus:outline-none transition-colors placeholder:text-gray-400 text-emerald-900"
                    style={{ height: "48px", border: "2px solid #a7f3d0", background: "white" }}
                    onFocus={(e) => e.target.style.borderColor = "#10b981"}
                    onBlur={(e) => e.target.style.borderColor = "#a7f3d0"}
                  />
                </div>
                {phoneError && <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>}
              </div>

              {/* WhatsApp badge */}
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <svg viewBox="0 0 24 24" fill="#22c55e" className="w-5 h-5 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <p className="text-green-700 text-xs font-medium">OTP will be sent via WhatsApp message</p>
              </div>

              <button onClick={handleSendOtp} disabled={!isPhoneValid || sendingOtp}
                className="w-full font-bold text-base text-white transition-all duration-300 flex items-center justify-center gap-2 rounded-xl"
                style={{
                  height: "48px",
                  background: isPhoneValid && !sendingOtp ? "linear-gradient(135deg, #10b981, #059669)" : "#d1d5db",
                  boxShadow: isPhoneValid ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
                  cursor: isPhoneValid && !sendingOtp ? "pointer" : "not-allowed"
                }}>
                {sendingOtp ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</>
                ) : (
                  <><MessageCircle className="w-5 h-5" /> Send OTP</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </motion.div>
          )}

          {/* ─── OTP STEP ─── */}
          {step === "otp" && (
            <motion.div key="otp"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 8px 40px rgba(16,185,129,0.12)", border: "1px solid rgba(167,243,208,0.5)" }}>

              <button onClick={() => { setStep("phone"); setOtp(Array(OTP_LENGTH).fill("")); setOtpError(""); }}
                className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mb-5 hover:text-emerald-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Change Number
              </button>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-emerald-900">Verify OTP</h2>
                <p className="text-sm text-gray-500 mt-1">
                  We have sent a verification code to your WhatsApp number
                </p>
                <p className="text-sm font-bold text-emerald-700 mt-1">{fullPhone}</p>
              </div>

              {/* OTP input boxes */}
              <div className="flex gap-2 justify-center mb-5">
                {otp.map((digit, i) => (
                  <input key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="tel" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onFocus={(e) => { e.target.select(); e.target.style.borderColor = "#10b981"; e.target.style.background = "#f0fdf4"; }}
                    onBlur={(e) => { if (!digit) { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "white"; } }}
                    autoFocus={i === 0}
                    className="text-center text-xl font-bold rounded-xl focus:outline-none transition-all"
                    style={{
                      width: "44px", height: "52px",
                      border: digit ? "2px solid #10b981" : "2px solid #e5e7eb",
                      background: digit ? "#f0fdf4" : "white",
                      color: digit ? "#065f46" : "#374151",
                      boxShadow: digit ? "0 2px 8px rgba(16,185,129,0.15)" : "none"
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-red-500 text-xs text-center mb-4 font-medium">{otpError}</p>
              )}

              <div className="text-center mb-5">
                {!canResend ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="font-bold text-emerald-700">{countdown}s</span>
                  </p>
                ) : (
                  <button onClick={handleResend} disabled={sendingOtp}
                    className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors underline underline-offset-2 disabled:opacity-50">
                    {sendingOtp ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>

              <button onClick={handleVerifyOtp} disabled={!isOtpComplete || verifying}
                className="w-full font-bold text-base text-white transition-all duration-300 flex items-center justify-center gap-2 rounded-xl"
                style={{
                  height: "48px",
                  background: isOtpComplete && !verifying ? "linear-gradient(135deg, #10b981, #059669)" : "#d1d5db",
                  boxShadow: isOtpComplete ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
                  cursor: isOtpComplete && !verifying ? "pointer" : "not-allowed"
                }}>
                {verifying ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}