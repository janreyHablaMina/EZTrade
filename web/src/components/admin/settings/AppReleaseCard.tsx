import { useState, useRef } from "react";
import { Upload, File, CheckCircle2, X, AlertCircle, Smartphone, Clock, Download, HardDrive } from "lucide-react";

export function AppReleaseCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
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
        if (onShowToast) onShowToast("APK published successfully");
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
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-5 bg-card-elevated">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-bright">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">App Release Management</h2>
            <p className="mt-0.5 text-xs text-muted-2">Manage the live Android APK for your users</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold text-success uppercase tracking-wider">v2.0.4 Live</span>
        </div>
      </div>

      <div className="p-5 space-y-8">
        {/* Current Release Info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/50 bg-bg-deep/50 p-4">
            <div className="flex items-center gap-2 text-muted-2 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-semibold">Last Updated</span>
            </div>
            <p className="text-sm font-bold text-white">{lastUpdated}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-bg-deep/50 p-4">
            <div className="flex items-center gap-2 text-muted-2 mb-2">
              <HardDrive className="h-4 w-4" />
              <span className="text-xs font-semibold">File Size</span>
            </div>
            <p className="text-sm font-bold text-white">42.8 MB</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-bg-deep/50 p-4">
            <div className="flex items-center gap-2 text-muted-2 mb-2">
              <Download className="h-4 w-4" />
              <span className="text-xs font-semibold">Total Installs</span>
            </div>
            <p className="text-sm font-bold text-white">12,450</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold text-white mb-4">Publish New Update</h3>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg-deep/30 px-6 py-8 transition-colors hover:border-purple-bright/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple/20 text-purple-bright mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">Select or drag .apk here</p>
            <p className="mt-1 text-xs text-muted-2">Max size: 100MB</p>
            
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
              className="mt-6 rounded-lg bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.1] border border-white/[0.05] cursor-pointer"
            >
              Browse Files
            </button>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-purple-bright/30 bg-purple/10 p-3">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-purple-bright" />
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-muted-2 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1 text-muted hover:text-white transition cursor-pointer"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-2">Uploading...</span>
                <span className="text-purple-bright">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-deep">
                <div
                  className="h-full bg-purple-bright transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-xs font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-bg-deep/50 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="rounded-lg bg-purple px-6 py-2 text-xs font-bold text-white transition hover:bg-purple-bright disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Publishing..." : "Publish Release"}
        </button>
      </div>
    </div>
  );
}
