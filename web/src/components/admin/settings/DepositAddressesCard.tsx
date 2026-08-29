"use client";

import { useState, useEffect } from "react";
import { Wallet, Save, Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import { webApi } from "@/lib/api";

type WalletItem = {
  id: string;
  name: string;
  address: string;
  qr_url: string | null;
};

export function DepositAddressesCard({ onShowToast }: { onShowToast?: (msg: string) => void }) {
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [qrFiles, setQrFiles] = useState<{ [key: string]: File | null }>({});
  const [limits, setLimits] = useState({ min_deposit: 10, deposit_fee_percent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    webApi.get("/settings/system").then((data) => {
      if (data.deposit_addresses) {
        setWallets(data.deposit_addresses.wallets || []);
        setLimits({
          min_deposit: data.deposit_addresses.min_deposit || 10,
          deposit_fee_percent: data.deposit_addresses.deposit_fee_percent || 0
        });
      }
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFiles(prev => ({ ...prev, [id]: e.target.files![0] }));
    }
  };

  const removeFile = (id: string) => {
    setQrFiles(prev => ({ ...prev, [id]: null }));
  };

  const addWallet = () => {
    const newId = `wallet_${Date.now()}`;
    setWallets([...wallets, { id: newId, name: "", address: "", qr_url: null }]);
  };

  const removeWallet = (id: string) => {
    setWallets(wallets.filter(w => w.id !== id));
    removeFile(id);
  };

  const updateWallet = (id: string, field: keyof WalletItem, value: string) => {
    setWallets(wallets.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("min_deposit", limits.min_deposit.toString());
      formData.append("deposit_fee_percent", limits.deposit_fee_percent.toString());
      formData.append("wallets", JSON.stringify(wallets));

      wallets.forEach(w => {
        if (qrFiles[w.id]) {
          formData.append(`qr_${w.id}`, qrFiles[w.id] as File);
        }
      });

      const res = await fetch("http://192.168.254.104:8000/api/settings/system/deposit_addresses", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      
      if (data.settings && data.settings.wallets) {
        setWallets(data.settings.wallets);
        setQrFiles({});
      }

      if (onShowToast) onShowToast("Deposit settings saved successfully");
      else alert("Deposit settings saved!");
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast("Failed to save settings");
      else alert("Failed to save settings");
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

  const renderWallet = (wallet: WalletItem, index: number) => {
    const file = qrFiles[wallet.id];
    const existingUrl = wallet.qr_url;
    const previewUrl = file ? URL.createObjectURL(file) : (existingUrl ? `http://192.168.254.104:8000/${existingUrl}` : null);

    return (
      <div key={wallet.id} className="rounded-xl border border-border/50 bg-bg-deep/50 p-4 relative group">
        <button 
          onClick={() => removeWallet(wallet.id)}
          className="absolute top-4 right-4 h-8 w-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          title="Remove Wallet"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-4 max-w-[90%]">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-2">Network Name</label>
            <input
              type="text"
              value={wallet.name}
              onChange={(e) => updateWallet(wallet.id, 'name', e.target.value)}
              placeholder="e.g. TRC20 (Tether)"
              className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm text-white focus:border-purple-bright/50 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-2">Wallet Address</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={wallet.address}
                  onChange={(e) => updateWallet(wallet.id, 'address', e.target.value)}
                  placeholder="Enter wallet address..."
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-white focus:border-purple-bright/50 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="shrink-0 flex items-center gap-3">
                {previewUrl ? (
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border bg-white">
                    <img src={previewUrl} alt="QR" className="h-full w-full object-contain" />
                    {file && (
                      <button 
                        onClick={() => removeFile(wallet.id)}
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
                    onChange={(e) => handleFileChange(wallet.id, e)}
                  />
                </label>
              </div>
            </div>
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
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">Deposit Settings</h2>
          <p className="text-sm text-muted-2">Configure minimum deposits, fees, and receiving wallets.</p>
        </div>
        <button
          onClick={addWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-bright/10 text-purple-bright text-sm font-semibold hover:bg-purple-bright/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Wallet
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Minimum Deposit ($)</label>
            <input
              type="number"
              value={limits.min_deposit}
              onChange={(e) => setLimits(l => ({ ...l, min_deposit: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Deposit Fee (%)</label>
            <input
              type="number"
              value={limits.deposit_fee_percent}
              onChange={(e) => setLimits(l => ({ ...l, deposit_fee_percent: Number(e.target.value) }))}
              className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-sm text-white focus:border-purple-bright focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          {wallets.length === 0 ? (
            <div className="text-center py-8 text-muted-2 text-sm border border-dashed border-border rounded-xl">
              No wallets configured. Click "Add Wallet" to start.
            </div>
          ) : (
            wallets.map((wallet, index) => renderWallet(wallet, index))
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-bright py-3 text-sm font-bold text-white transition-all hover:bg-purple-bright/90 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}
