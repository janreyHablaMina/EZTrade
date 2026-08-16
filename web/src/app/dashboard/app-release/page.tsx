"use client";

import { useState, useRef } from "react";
import { Upload, File, CheckCircle2, X, AlertCircle, Smartphone, Activity, Clock, Download, HardDrive } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AppReleasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [lastUpdated, setLastUpdated] = useState("Aug 14, 2026");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".apk")) {
        setStatus("error");
        setMessage("Please select a valid .apk file.");
        setFile(null);
        return;
      }
      setFile(selected);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus("idle");
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("apk", file);

      const res = await fetch("/api/upload-apk", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (res.ok) {
        setStatus("success");
        setMessage("APK uploaded and published successfully.");
        setFile(null);
        setLastUpdated("Just now");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
    } catch (err: any) {
      clearInterval(interval);
      setStatus("error");
      setMessage(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          App Release Management
        </h1>
        <p className="mt-1.5 text-sm text-muted-2">
          Dashboard <span className="mx-1">&gt;</span> App Release
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Uploader */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h2 className="text-lg font-bold text-white mb-6">Upload New APK</h2>

            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg-deep/50 px-6 py-12 transition-colors hover:border-purple-bright/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple/20 text-purple-bright mb-4 shadow-[0_0_20px_rgba(123,44,255,0.2)]">
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-base font-semibold text-white">Click to select or drag and drop</p>
              <p className="mt-1.5 text-xs text-muted-2">Only .apk files are supported. Max size: 100MB</p>
              
              <input
                type="file"
                accept=".apk"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-8 rounded-xl bg-white/[0.06] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] border border-white/[0.05] cursor-pointer"
              >
                Browse Files
              </button>
            </div>

            {file && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-purple-bright/30 bg-purple/10 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/20 text-purple-bright">
                    <File className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{file.name}</p>
                    <p className="text-xs text-muted-2 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="rounded-lg p-2 text-muted hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
                  disabled={isUploading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-2 flex items-center gap-2">
                    <span className="animate-spin inline-block h-3 w-3 border-2 border-purple-bright border-t-transparent rounded-full" />
                    Uploading Release...
                  </span>
                  <span className="text-purple-bright">{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-deep shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple to-purple-bright transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-success shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-semibold">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-danger">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-semibold">{message}</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="rounded-xl bg-purple px-8 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(123,44,255,0.3)] transition hover:bg-purple-bright disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? "Publishing to Users..." : "Publish Release"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Status */}
        <div className="space-y-6">
          {/* Current Live Release Card */}
          <div className="rounded-2xl border border-purple-bright/20 bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-muted-2 uppercase tracking-wider mb-6">Current Live Release</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-bright/20 to-blue-500/20 flex items-center justify-center shadow-inner">
                <Smartphone className="h-8 w-8 text-purple-bright" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">v2.0.4</p>
                <p className="text-xs text-success font-semibold mt-1">Stable Production</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                <span className="text-sm text-muted flex items-center gap-2"><Clock className="h-4 w-4" /> Last Updated</span>
                <span className="text-sm font-semibold text-white">{lastUpdated}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                <span className="text-sm text-muted flex items-center gap-2"><HardDrive className="h-4 w-4" /> File Size</span>
                <span className="text-sm font-semibold text-white">42.8 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted flex items-center gap-2"><Download className="h-4 w-4" /> Total Installs</span>
                <span className="text-sm font-semibold text-white">12,450</span>
              </div>
            </div>
          </div>

          {/* Release History */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <h3 className="text-sm font-bold text-white mb-6">Recent History</h3>
            
            <div className="space-y-6">
              {[
                { version: "v2.0.3", date: "Aug 10, 2026", type: "Bug Fixes", color: "text-blue-400", bg: "bg-blue-400/10" },
                { version: "v2.0.0", date: "Aug 01, 2026", type: "Major Update", color: "text-purple-bright", bg: "bg-purple-bright/10" },
                { version: "v1.9.5", date: "Jul 15, 2026", type: "Security", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 2 && <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-border/50" />}
                  <div className="mt-1 h-6 w-6 rounded-full bg-bg-deep border border-border flex items-center justify-center shrink-0 z-10">
                    <div className="h-2 w-2 rounded-full bg-muted-2" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">{item.version}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-2">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
