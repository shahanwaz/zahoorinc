import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SurahList() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const response = await fetch('https://api.alquran.cloud/v1/surah');
                if (!response.ok) {
                    throw new Error('Failed to fetch surahs');
                }
                const data = await response.json();
                setSurahs(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {surahs.map((surah) => (
                <Link to={createPageUrl(`SurahDetail?surah=${surah.number}`)} key={surah.number}>
                    <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-300 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold rounded-lg">
                                {surah.number}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-emerald-800">{surah.englishName}</h3>
                                <p className="text-sm text-gray-500">{surah.englishNameTranslation}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-arabic-title text-2xl text-emerald-700">{surah.name}</p>
                            <p className="text-xs text-gray-400">{surah.numberOfAyahs} Ayahs</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}