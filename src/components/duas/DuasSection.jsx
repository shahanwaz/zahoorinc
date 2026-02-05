import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Static Du'as as fallback
const staticDuas = [
    {
        id: 1,
        title: "Morning Du'a (Dua al-Sabah)",
        title_ar: "دُعَاءُ الصَّبَاحِ",
        category: "Daily",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    اَللّٰهُمَّ بِكَ اَصْبَحْنَا وَبِكَ اَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوْتُ وَاِلَيْكَ النُّشُوْرُ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"O Allah, with You we enter the morning, with You we enter the evening, with You we live, with You we die, and to You is our resurrection."</p>
            </div>
        </div>`
    },
    {
        id: 2,
        title: "Evening Du'a (Dua al-Masa)",
        title_ar: "دُعَاءُ الْمَسَاءِ",
        category: "Daily",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    اَللّٰهُمَّ بِكَ اَمْسَيْنَا وَبِكَ اَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوْتُ وَاِلَيْكَ الْمَصِيْرُ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"O Allah, with You we enter the evening, with You we enter the morning, with You we live, with You we die, and to You is our return."</p>
            </div>
        </div>`
    },
    {
        id: 3,
        title: "Du'a before Eating",
        title_ar: "دُعَاءُ قَبْلَ الطَّعَامِ",
        category: "Daily",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"In the name of Allah and with the blessing of Allah."</p>
            </div>
        </div>`
    },
    {
        id: 4,
        title: "Du'a after Eating",
        title_ar: "دُعَاءُ بَعْدَ الطَّعَامِ",
        category: "Daily",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"All praise is due to Allah, the Lord of the worlds."</p>
            </div>
        </div>`
    },
    {
        id: 5,
        title: "Du'a for Forgiveness (Istighfar)",
        title_ar: "دُعَاءُ الِاسْتِغْفَارِ",
        category: "Repentance",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    اَسْتَغْفِرُ اللهَ رَبِّي وَاَتُوْبُ اِلَيْهِ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"I seek forgiveness from Allah, my Lord, and I turn to Him in repentance."</p>
            </div>
        </div>`
    },
    {
        id: 6,
        title: "Du'a for Traveling",
        title_ar: "دُعَاءُ السَّفَرِ",
        category: "Travel",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"Glory be to Him who has subjected this to us, and we could never have it (by our efforts). And verily, to our Lord we indeed are returning."</p>
            </div>
        </div>`
    },
    {
        id: 7,
        title: "Du'a for Protection from Evil",
        title_ar: "دُعَاءُ الْحِفْظِ مِنَ الشَّرِّ",
        category: "Protection",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    اَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"I seek refuge in the perfect words of Allah from the evil of what He has created."</p>
            </div>
        </div>`
    },
    {
        id: 8,
        title: "Du'a for Good Health",
        title_ar: "دُعَاءُ الصِّحَّةِ",
        category: "Health",
        description: `<div class="space-y-4">
            <div class="bg-emerald-50 p-4 rounded-lg">
                <p class="text-right text-xl font-arabic leading-relaxed mb-4" dir="rtl">
                    اَللّٰهُمَّ عَافِنِيْ فِيْ بَدَنِيْ اَللّٰهُمَّ عَافِنِيْ فِيْ سَمْعِيْ اَللّٰهُمَّ عَافِنِيْ فِيْ بَصَرِيْ
                </p>
            </div>
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Translation:</h4>
                <p class="italic text-gray-700">"O Allah, grant me well-being in my body. O Allah, grant me well-being in my hearing. O Allah, grant me well-being in my sight."</p>
            </div>
        </div>`
    }
];

const DuaCard = ({ dua, onSelect }) => (
    <Card 
        className="bg-white border-emerald-100 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onSelect(dua)}
    >
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <CardTitle className="text-lg text-emerald-800 mb-1">{dua.title}</CardTitle>
                    <p className="text-2xl font-arabic text-right text-emerald-700 mb-2" dir="rtl">
                        {dua.title_ar}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                            {dua.category}
                        </span>
                    </div>
                </div>
            </div>
        </CardHeader>
    </Card>
);

const DuaDetail = ({ dua, onBack }) => {
    return (
        <div className="px-4 py-4 space-y-6">
            <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-emerald-50">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Du'as
            </Button>
            <Card className="bg-white border-emerald-100">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-emerald-800">{dua.title}</CardTitle>
                    <p className="text-3xl font-arabic-title text-emerald-700 mt-2" dir="rtl">{dua.title_ar}</p>
                </CardHeader>
                <CardContent>
                    <div 
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: dua.description }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default function DuasSection() {
    const [duas, setDuas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDua, setSelectedDua] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [dataSource, setDataSource] = useState('static'); // 'api' or 'static'

    useEffect(() => {
        const fetchDuas = async () => {
            setLoading(true);
            try {
                // Try the API first
                const response = await fetch('https://api3.islamhouse.com/v3/paV29H2gm56kvLP/main/showall/duas/showall/json?pageNum=1&limit=50');
                if (response.ok) {
                    const data = await response.json();
                    if (data.data && data.data.length > 0) {
                        setDuas(data.data);
                        setDataSource('api');
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch Du'as from API:", error);
            }
            
            // Fallback to static data
            setDuas(staticDuas);
            setDataSource('static');
            setLoading(false);
        };
        fetchDuas();
    }, []);

    const categories = ['All', ...new Set(duas.map(dua => dua.category).filter(Boolean))];

    const filteredDuas = duas.filter(dua => {
        const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (dua.title_ar && dua.title_ar.includes(searchQuery));
        const matchesCategory = categoryFilter === 'All' || dua.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (selectedDua) {
        return <DuaDetail dua={selectedDua} onBack={() => setSelectedDua(null)} />;
    }

    return (
        <div className="px-4 py-4 space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-800 mb-2">Du'as Collection</h2>
                <p className="text-emerald-600">
                    {dataSource === 'static' ? 'Essential Islamic Supplications' : 'Supplications from IslamHouse'}
                </p>
                {dataSource === 'static' && (
                    <p className="text-xs text-emerald-500 mt-1">Using curated collection (API unavailable)</p>
                )}
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search Du'as..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-emerald-200 focus:border-emerald-500 bg-white"
                    />
                </div>

                {categories.length > 1 && (
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <span className="ml-3 text-emerald-700">Loading Du'as...</span>
                </div>
            ) : (
                <div className="space-y-4 pb-24">
                    {filteredDuas.length > 0 ? (
                        filteredDuas.map((dua) => (
                            <DuaCard key={dua.id} dua={dua} onSelect={setSelectedDua} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>No Du'as found matching your search.</p>
                            {searchQuery && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => setSearchQuery('')}
                                    className="mt-2"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}