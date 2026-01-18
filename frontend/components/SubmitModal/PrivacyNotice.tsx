'use client';

import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyNotice: React.FC = () => {
    return (
        <div className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                    Your privacy is sacred
                </p>
                <p className="text-[10px] text-white/25 leading-relaxed">
                    Your message is completely anonymous. No personal information is collected or stored.
                    Your IP address is never logged.
                </p>
            </div>
        </div>
    );
};

export default PrivacyNotice;
