
"use client";

export default function CredentialLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[1px] cursor-not-allowed select-none">
      <div className="flex flex-col items-center gap-4">
        {/* Loading spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
      </div>
    </div>
  );
}
