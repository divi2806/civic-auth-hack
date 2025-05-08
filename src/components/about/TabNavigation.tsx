
import { useState } from "react";

type TabType = 'overview' | 'tokenomics' | 'faq';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <section className="border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto hide-scrollbar gap-8 justify-center">
          <button 
            className={`py-4 px-2 relative font-medium ${activeTab === 'overview' 
              ? 'text-white' 
              : 'text-gray-400 hover:text-gray-300'}`} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
            )}
          </button>
          <button 
            className={`py-4 px-2 relative font-medium ${activeTab === 'tokenomics' 
              ? 'text-white' 
              : 'text-gray-400 hover:text-gray-300'}`} 
            onClick={() => setActiveTab('tokenomics')}
          >
            Tokenomics
            {activeTab === 'tokenomics' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
            )}
          </button>
          <button 
            className={`py-4 px-2 relative font-medium ${activeTab === 'faq' 
              ? 'text-white' 
              : 'text-gray-400 hover:text-gray-300'}`} 
            onClick={() => setActiveTab('faq')}
          >
            FAQ
            {activeTab === 'faq' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TabNavigation;
