"use client";

const TABS = [
  "Profile & Account",
  "Security",
  "General Settings",
  "Preferences",
  "Trade Automation",
  "Notifications",
  "API & Integrations",
];

type SettingsTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border/50 mt-6">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? "text-white"
                : "text-muted hover:text-white"
            }`}
          >
            {tab}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-purple-bright" />
            )}
          </button>
        );
      })}
    </div>
  );
}
