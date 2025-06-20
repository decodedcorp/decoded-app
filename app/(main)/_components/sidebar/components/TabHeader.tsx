type TabType = 'summary' | 'items' | 'related';

interface TabHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabHeader({ activeTab, onTabChange }: TabHeaderProps) {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'summary', label: 'Summary' },
    { key: 'items', label: 'Items' },
    { key: 'related', label: 'Related' },
  ];

  return (
    <>
      <div className="flex items-center px-4 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`font-semibold pb-2 mr-6 ${
              activeTab === tab.key ? 'text-primary' : 'text-[#888] hover:text-primary'
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="border-b-2 border-primary mx-4" />
    </>
  );
} 