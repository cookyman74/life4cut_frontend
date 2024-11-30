import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import Editor from './pages/Editor';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            {/* 전체 페이지 레이아웃 구성 */}
            <div className="flex flex-col min-h-screen">
                {/* 공통 Header */}
                <Header />

                {/* 메인 콘텐츠 */}
                <main className="flex-grow bg-gray-100">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/editor" element={<Editor />} />
                        <Route path="/:year/:month/:location/:fileName" element={<Editor />} />
                    </Routes>
                </main>

                {/* 공통 Footer */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
