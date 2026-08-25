"use client";

import { useState, useEffect, useRef } from "react";
import { Wallet, Save, Loader2, Upload, X } from "lucide-react";
import { webApi } from "@/lib/api";

type AddressState = {
  trc20_address: string;
  erc20_address: string;
  polygon_address: string;
  bep20_address: string;
};

type QrUrls = {
  trc20_qr?: string;
  erc20_qr?: string;
  polygon_qr?: string;
  bep20_qr?: string;
};

export function DepositAddressesCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [addresses, setAddresses] = useState<AddressState>({
    trc20_address: "",
    erc20_address: "",
    polygon_address: "",
    bep20_address: ""
  });
  
  const [qrUrls, setQrUrls] = useState<QrUrls>({});
  const [qrFiles, setQrFiles] = useState<{ [key: string]: File | null }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    webApi.get("/settings/system").then((data) => {
      if (data.deposit_addresses) {
        setAddresses({
          trc20_address: data.deposit_addresses.trc20_address || "",
          erc20_address: data.deposit_addresses.erc20_address || "",
          polygon_address: data.deposit_addresses.polygon_address || "",
          bep20_address: data.deposit_addresses.bep20_address || ""
        });
        setQrUrls({
          trc20_qr: data.deposit_addresses.trc20_qr,
          erc20_qr: data.deposit_addresses.erc20_qr,
          polygon_qr: data.deposit_addresses.polygon_qr,
          bep20_qr: data.deposit_addresses.bep20_qr,
        });
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const removeFile = (key: string) => {
    setQrFiles(prev => ({ ...prev, [key]: null }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("trc20_address", addresses.trc20_address);
      formData.append("erc20_address", addresses.erc20_address);
      formData.append("polygon_address", addresses.polygon_address);
      formData.append("bep20_address", addresses.bep20_address);

      if (qrFiles.trc20_qr) formData.append("trc20_qr", qrFiles.trc20_qr);
      if (qrFiles.erc20_qr) formData.append("erc20_qr", qrFiles.erc20_qr);
      if (qrFiles.polygon_qr) formData.append("polygon_qr", qrFiles.polygon_qr);
      if (qrFiles.bep20_qr) formData.append("bep20_qr", qrFiles.bep20_qr);

      const res = await fetch("http://192.168.254.104:8000/api/settings/system/deposit_addresses", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      
      if (data.settings) {
        setQrUrls({
          trc20_qr: data.settings.trc20_qr || qrUrls.trc20_qr,
          erc20_qr: data.settings.erc20_qr || qrUrls.erc20_qr,
          polygon_qr: data.settings.polygon_qr || qrUrls.polygon_qr,
          bep20_qr: data.settings.bep20_qr || qrUrls.bep20_qr,
        });
        setQrFiles({});
      }

      if (onShowToast) onShowToast("Deposit addresses saved successfully");
      else alert("Deposit addresses saved!");
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast("Failed to save settings");
      else alert("Failed to save addresses");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-purple-bright" />
      </div>
    );
  }

  const renderNetworkField = (
    label: string, 
    addressKey: keyof AddressState, 
    qrKey: keyof QrUrls
  ) => {
    const file = qrFiles[qrKey];
    const existingUrl = qrUrls[qrKey];
    const previewUrl = file ? URL.createObjectURL(file) : (existingUrl ? `http://192.168.254.104:8000/${existingUrl}` : null);

    return (
      <div className="rounded-xl border border-border/50 bg-bg-deep/50 p-4">
        <label className="block text-sm font-medium text-muted-2 mb-3">{label}</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={addresses[addressKey]}
              onChange={(e) => setAddresses({ ...addresses, [addressKey]: e.target.value })}
              placeholder="Enter wallet address..."
              className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-white focus:border-purple-bright/50 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="shrink-0 flex items-center gap-3">
            {previewUrl ? (
              <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border bg-white">
                <img src={previewUrl} alt={`${label} QR`} className="h-full w-full object-contain" />
                {file && (
                  <button 
                    onClick={() => removeFile(qrKey)}
                    className="absolute top-0.5 right-0.5 h-4 w-4 bg-black/50 rounded-full flex items-center justify-center text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : null}
            
            <label className="flex h-12 px-4 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-purple-bright/30 bg-purple-bright/5 hover:bg-purple-bright/10 transition-colors">
              <Upload className="h-4 w-4 text-purple-bright" />
              <span className="text-xs font-medium text-purple-bright">Upload QR</span>
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => handleFileChange(qrKey, e)}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-purple-bright/10 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-purple-bright" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Deposit Addresses & QR Codes</h2>
          <p className="text-sm text-muted-2">Configure the receiving wallets and their optional QR code images.</p>
        </div>
      </div>

      <div className="space-y-4">
        {renderNetworkField("TRC20 (Tether/Tron)", "trc20_address", "trc20_qr")}
        {renderNetworkField("ERC20 (Ethereum)", "erc20_address", "erc20_qr")}
        {renderNetworkField("Polygon", "polygon_address", "polygon_qr")}
        {renderNetworkField("BEP20 (Binance Smart Chain)", "bep20_address", "bep20_qr")}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-bright py-3 text-sm font-bold text-white transition-all hover:bg-purple-bright/90 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Addresses
        </button>
      </div>
    </div>
  );
}
