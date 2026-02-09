import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
    const [expanded, setExpanded] = useState(false);

    const COLLAPSED_WIDTH = 72;
    const EXPANDED_WIDTH = 240;

    return (
        <div className="flex min-h-screen bg-slate-50 transition-all duration-300">
            {/* Sidebar with controlled state */}
            <Sidebar expanded={expanded} setExpanded={setExpanded} />

            {/* Main Content Area */}
            <div
                className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
                style={{ marginLeft: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
            >
                <Navbar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
