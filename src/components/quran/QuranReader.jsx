import React, { useState } from 'react';
import SurahList from './SurahList';
import SurahDetail from './SurahDetail';

export default function QuranReader({
    surahs,
    reciters,
    selectedReciter,
    onSurahChange,
    onPlaybackStateChange,
    onReciterChange,
    currentPlayingAyah,
}) {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

    const handleSurahSelect = (surah) => {
        setSelectedSurah(surah);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedSurah(null);
        // Stop any playing audio when going back to list
        onPlaybackStateChange({ action: 'stop', trackIndex: 0 });
    };

    return (
        <div className="min-h-screen">
            {viewMode === 'list' ? (
                <SurahList
                    surahs={surahs}
                    onSurahSelect={handleSurahSelect}
                />
            ) : (
                <SurahDetail
                    surah={selectedSurah}
                    reciters={reciters}
                    selectedReciter={selectedReciter}
                    onSurahChange={onSurahChange}
                    onPlaybackStateChange={onPlaybackStateChange}
                    onReciterChange={onReciterChange}
                    currentPlayingAyah={currentPlayingAyah}
                    onBackToList={handleBackToList}
                />
            )}
        </div>
    );
}