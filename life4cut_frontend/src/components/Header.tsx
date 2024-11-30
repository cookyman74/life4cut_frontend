// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
            <div className="text-2xl font-bold">PhotoEditor</div>
            <nav className="flex gap-6">
                <a href="/" className="text-lg hover:text-blue-400 transition">
                    Home
                </a>
                <a href="/editor" className="text-lg hover:text-blue-400 transition">
                    Editor
                </a>
                <a href="/about" className="text-lg hover:text-blue-400 transition">
                    About
                </a>
            </nav>
        </header>
    );
};

export default Header;
