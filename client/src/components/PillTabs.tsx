import React, { useState } from "react";
import "./PillTabs.css";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

interface PillTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

const PillTabs: React.FC<PillTabsProps> = ({ tabs, defaultTabId }) => {
  const [activeTab, setActiveTab] = useState(
    defaultTabId ?? tabs[0].id
  );

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="pill-tabs-container">
      <div className="pill-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`pill-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pill-tabs-content">
        {activeContent}
      </div>
    </div>
  );
};

export default PillTabs;
