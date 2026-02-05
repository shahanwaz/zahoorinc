import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, TrendingUp, MessageCircle, Users } from "lucide-react";
import { Question as QuestionEntity } from "@/entities/Question";
import { User } from "@/entities/User";
import QuestionCard from "@/components/questions/QuestionCard";
import CreateQuestionModal from "@/components/insights/CreateQuestionModal";

export default function Questions() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "All", emoji: "📚" },
    { value: "fiqh", label: "Fiqh", emoji: "📖" },
    { value: "history", label: "History", emoji: "📜" },
    { value: "duas", label: "Duas", emoji: "🤲" },
    { value: "community", label: "Community", emoji: "👥" },
    { value: "akhlaq", label: "Akhlaq", emoji: "💚" },
    { value: "quran", label: "Quran", emoji: "📕" },
    { value: "hadith", label: "Hadith", emoji: "📔" },
    { value: "general", label: "General", emoji: "❓" }
  ];

  // Comprehensive dummy questions for all categories
  const dummyQuestions = [
    // FIQH Questions
    {
      id: 'fiqh1',
      title: 'What are the rules for performing Tayammum when water is not available?',
      content: 'I am traveling to a desert region where water may be scarce. What are the detailed rules and conditions for performing Tayammum instead of Wudu? When is it permissible and what makes it invalid?',
      category: 'fiqh',
      author_id: 'u1',
      author_name: 'Ali Hassan',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Ali+Hassan&background=3b82f6&color=fff',
      created_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: ['u2', 'u3', 'u4'],
      reactions: { insight: ['u2'], like: ['u3', 'u4'] },
      answer_count: 3,
      view_count: 124,
      is_answered: true
    },
    {
      id: 'fiqh2',
      title: 'Can women lead prayers for other women in congregation?',
      content: 'Is it permissible for a knowledgeable woman to lead Salat al-Jama\'ah for other women? What are the rulings according to different Maraji?',
      category: 'fiqh',
      author_id: 'u5',
      author_name: 'Fatima Zahra',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Fatima+Zahra&background=3b82f6&color=fff',
      created_date: new Date(Date.now() - 3600000 * 18).toISOString(),
      likes: ['u1', 'u6', 'u7'],
      reactions: { insight: ['u1', 'u6'], like: ['u7'] },
      answer_count: 5,
      view_count: 189,
      is_answered: true
    },
    {
      id: 'fiqh3',
      title: 'Ruling on music and singing in Islam',
      content: 'What is the Islamic ruling on listening to music and singing? Are there different types that are permissible or impermissible?',
      category: 'fiqh',
      author_id: 'u8',
      author_name: 'Reza Ahmed',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Reza+Ahmed&background=3b82f6&color=fff',
      created_date: new Date(Date.now() - 3600000 * 12).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u9'],
      reactions: { insight: ['u2', 'u4'], like: ['u6', 'u9'] },
      answer_count: 7,
      view_count: 256,
      is_answered: true
    },

    // HISTORY Questions
    {
      id: 'hist1',
      title: 'Detailed timeline of events leading to the Battle of Karbala',
      content: 'Can someone provide a comprehensive timeline of the political events and circumstances that led to the martyrdom of Imam Hussain (AS) at Karbala? What were the key turning points?',
      category: 'history',
      author_id: 'u10',
      author_name: 'Hassan Raza',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Hassan+Raza&background=8b5cf6&color=fff',
      created_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      likes: ['u2', 'u3', 'u5', 'u7', 'u9'],
      reactions: { insight: ['u2', 'u3'], love: ['u5', 'u7', 'u9'] },
      answer_count: 6,
      view_count: 342,
      is_answered: true
    },
    {
      id: 'hist2',
      title: 'Role of Lady Zainab (SA) after Karbala',
      content: 'What was the significant role played by Lady Zainab (SA) after the tragedy of Karbala? How did she preserve the message of Imam Hussain (AS)?',
      category: 'history',
      author_id: 'u11',
      author_name: 'Maryam Ali',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Maryam+Ali&background=8b5cf6&color=fff',
      created_date: new Date(Date.now() - 3600000 * 20).toISOString(),
      likes: ['u1', 'u4', 'u6', 'u8'],
      reactions: { love: ['u1', 'u4'], insight: ['u6', 'u8'] },
      answer_count: 4,
      view_count: 278,
      is_answered: true
    },
    {
      id: 'hist3',
      title: 'Life and teachings of Imam Ali Al-Ridha (AS)',
      content: 'I want to learn more about Imam Ali Al-Ridha (AS) - his life, his debates with scholars, and his martyrdom in Mashhad. Any recommended resources?',
      category: 'history',
      author_id: 'u12',
      author_name: 'Jawad Hussain',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Jawad+Hussain&background=8b5cf6&color=fff',
      created_date: new Date(Date.now() - 3600000 * 8).toISOString(),
      likes: ['u3', 'u5', 'u7'],
      reactions: { insight: ['u3', 'u5'], like: ['u7'] },
      answer_count: 3,
      view_count: 167,
      is_answered: true
    },

    // DUAS Questions
    {
      id: 'duas1',
      title: 'What is the significance and benefits of Dua e Kumayl?',
      content: 'I have heard about reciting Dua e Kumayl on Thursday nights. Can someone explain its deeper meaning, the story behind it, and the spiritual benefits of regular recitation?',
      category: 'duas',
      author_id: 'u13',
      author_name: 'Ahmed Raza',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Ahmed+Raza&background=10b981&color=fff',
      created_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u8'],
      reactions: { insight: ['u2', 'u4'], pray: ['u6', 'u8'] },
      answer_count: 5,
      view_count: 234,
      is_answered: true
    },
    {
      id: 'duas2',
      title: 'Best duas for seeking forgiveness',
      content: 'What are the most effective duas from the Quran and Hadith for seeking Allah\'s forgiveness? I want to include them in my daily routine.',
      category: 'duas',
      author_id: 'u14',
      author_name: 'Zainab Mohammad',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Zainab+Mohammad&background=10b981&color=fff',
      created_date: new Date(Date.now() - 3600000 * 14).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7', 'u9'],
      reactions: { pray: ['u1', 'u3', 'u5'], love: ['u7', 'u9'] },
      answer_count: 8,
      view_count: 312,
      is_answered: true
    },
    {
      id: 'duas3',
      title: 'Dua for success in exams and studies',
      content: 'My exams are coming up and I want to know if there are specific duas I can recite for success in my studies and exams. Any recommendations?',
      category: 'duas',
      author_id: 'u15',
      author_name: 'Amina Jafri',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Amina+Jafri&background=10b981&color=fff',
      created_date: new Date(Date.now() - 3600000 * 6).toISOString(),
      likes: ['u2', 'u4', 'u6'],
      reactions: { pray: ['u2', 'u4'], like: ['u6'] },
      answer_count: 6,
      view_count: 198,
      is_answered: true
    },

    // COMMUNITY Questions
    {
      id: 'comm1',
      title: 'Starting a youth Islamic study circle - need advice',
      content: 'I want to start a weekly Islamic study circle for youth at our local mosque. What topics would engage young people? How should I structure the sessions?',
      category: 'community',
      author_id: 'u16',
      author_name: 'Sarah Ahmed',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Sarah+Ahmed&background=f97316&color=fff',
      created_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7', 'u9', 'u11'],
      reactions: { love: ['u1', 'u3', 'u5'], like: ['u7', 'u9', 'u11'] },
      answer_count: 9,
      view_count: 267,
      is_answered: true
    },
    {
      id: 'comm2',
      title: 'How to organize Muharram programs in our community?',
      content: 'Our community wants to organize Muharram programs this year. What are some best practices for organizing majalis, processions, and other activities?',
      category: 'community',
      author_id: 'u17',
      author_name: 'Ibrahim Khan',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Ibrahim+Khan&background=f97316&color=fff',
      created_date: new Date(Date.now() - 3600000 * 16).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u8'],
      reactions: { like: ['u2', 'u4'], love: ['u6', 'u8'] },
      answer_count: 7,
      view_count: 223,
      is_answered: true
    },
    {
      id: 'comm3',
      title: 'Need volunteers for food distribution program',
      content: 'Our anjuman is starting a monthly food distribution program for needy families. Looking for volunteers and advice on organizing such initiatives.',
      category: 'community',
      author_id: 'u18',
      author_name: 'Husna Begum',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Husna+Begum&background=f97316&color=fff',
      created_date: new Date(Date.now() - 3600000 * 10).toISOString(),
      likes: ['u1', 'u3', 'u5'],
      reactions: { love: ['u1', 'u3'], like: ['u5'] },
      answer_count: 5,
      view_count: 145,
      is_answered: true
    },

    // AKHLAQ Questions
    {
      id: 'akhl1',
      title: 'How to control anger according to Islamic teachings?',
      content: 'I struggle with anger management. What does Islam teach about controlling anger? Are there specific practices or duas that can help?',
      category: 'akhlaq',
      author_id: 'u19',
      author_name: 'Mahdi Abbas',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Mahdi+Abbas&background=14b8a6&color=fff',
      created_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u8', 'u10'],
      reactions: { insight: ['u2', 'u4'], pray: ['u6', 'u8', 'u10'] },
      answer_count: 6,
      view_count: 289,
      is_answered: true
    },
    {
      id: 'akhl2',
      title: 'Teaching children about honesty and truthfulness',
      content: 'What are effective Islamic ways to teach young children (ages 5-8) about the importance of honesty and telling the truth?',
      category: 'akhlaq',
      author_id: 'u20',
      author_name: 'Nadia Hussain',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Nadia+Hussain&background=14b8a6&color=fff',
      created_date: new Date(Date.now() - 3600000 * 15).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7'],
      reactions: { love: ['u1', 'u3'], like: ['u5', 'u7'] },
      answer_count: 8,
      view_count: 201,
      is_answered: true
    },
    {
      id: 'akhl3',
      title: 'Dealing with difficult relatives with patience',
      content: 'How should one maintain good character when dealing with difficult family members? What guidance does Islam provide for such situations?',
      category: 'akhlaq',
      author_id: 'u21',
      author_name: 'Karim Jafri',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Karim+Jafri&background=14b8a6&color=fff',
      created_date: new Date(Date.now() - 3600000 * 7).toISOString(),
      likes: ['u2', 'u4', 'u6'],
      reactions: { insight: ['u2', 'u4'], pray: ['u6'] },
      answer_count: 4,
      view_count: 167,
      is_answered: true
    },

    // QURAN Questions
    {
      id: 'quran1',
      title: 'Understanding the deeper meanings of Surah Al-Fatiha',
      content: 'I recite Surah Al-Fatiha in every prayer but want to understand the deeper spiritual meanings of each verse. Can someone provide a detailed tafsir?',
      category: 'quran',
      author_id: 'u22',
      author_name: 'Zahra Mirza',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Zahra+Mirza&background=6366f1&color=fff',
      created_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7', 'u9'],
      reactions: { insight: ['u1', 'u3', 'u5'], love: ['u7', 'u9'] },
      answer_count: 5,
      view_count: 312,
      is_answered: true
    },
    {
      id: 'quran2',
      title: 'Best way to memorize Quran for adults',
      content: 'I am 35 years old and want to start memorizing the Quran. What are effective techniques for adult memorization? How much time should I dedicate daily?',
      category: 'quran',
      author_id: 'u23',
      author_name: 'Abbas Haider',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Abbas+Haider&background=6366f1&color=fff',
      created_date: new Date(Date.now() - 3600000 * 22).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u8'],
      reactions: { insight: ['u2', 'u4'], like: ['u6', 'u8'] },
      answer_count: 7,
      view_count: 245,
      is_answered: true
    },
    {
      id: 'quran3',
      title: 'Tafsir of Ayat al-Kursi - verse by verse',
      content: 'Can someone explain Ayat al-Kursi verse by verse with its deeper meanings and why it is so powerful for protection?',
      category: 'quran',
      author_id: 'u24',
      author_name: 'Sakina Naqvi',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Sakina+Naqvi&background=6366f1&color=fff',
      created_date: new Date(Date.now() - 3600000 * 9).toISOString(),
      likes: ['u1', 'u3', 'u5'],
      reactions: { insight: ['u1', 'u3'], love: ['u5'] },
      answer_count: 4,
      view_count: 189,
      is_answered: true
    },

    // HADITH Questions
    {
      id: 'had1',
      title: 'Authentic hadiths about seeking knowledge',
      content: 'What are the most authentic hadiths from the Prophet (PBUH) and Imams (AS) about the importance and virtue of seeking knowledge?',
      category: 'hadith',
      author_id: 'u25',
      author_name: 'Mustafa Ali',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Mustafa+Ali&background=ec4899&color=fff',
      created_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u8', 'u10'],
      reactions: { insight: ['u2', 'u4', 'u6'], like: ['u8', 'u10'] },
      answer_count: 9,
      view_count: 278,
      is_answered: true
    },
    {
      id: 'had2',
      title: 'Hadiths about rights of neighbors in Islam',
      content: 'What did the Prophet (PBUH) and Ahlul Bayt (AS) say about the rights of neighbors? I want to be a better neighbor.',
      category: 'hadith',
      author_id: 'u26',
      author_name: 'Layla Hassan',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Layla+Hassan&background=ec4899&color=fff',
      created_date: new Date(Date.now() - 3600000 * 19).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7'],
      reactions: { insight: ['u1', 'u3'], love: ['u5', 'u7'] },
      answer_count: 6,
      view_count: 223,
      is_answered: true
    },
    {
      id: 'had3',
      title: 'Understanding the Hadith of Thaqalayn',
      content: 'Can someone explain the Hadith of Thaqalayn in detail? What does it teach us about the Quran and Ahlul Bayt (AS)?',
      category: 'hadith',
      author_id: 'u27',
      author_name: 'Raza Mehdi',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Raza+Mehdi&background=ec4899&color=fff',
      created_date: new Date(Date.now() - 3600000 * 11).toISOString(),
      likes: ['u2', 'u4', 'u6'],
      reactions: { insight: ['u2', 'u4'], like: ['u6'] },
      answer_count: 5,
      view_count: 198,
      is_answered: true
    },

    // GENERAL Questions
    {
      id: 'gen1',
      title: 'How to balance work life with religious obligations?',
      content: 'I have a demanding job that often conflicts with prayer times and religious activities. How can I better balance my worldly duties with my spiritual practices?',
      category: 'general',
      author_id: 'u28',
      author_name: 'Omar Qasim',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Omar+Qasim&background=6b7280&color=fff',
      created_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7', 'u9', 'u11'],
      reactions: { pray: ['u1', 'u3', 'u5'], love: ['u7', 'u9', 'u11'] },
      answer_count: 10,
      view_count: 356,
      is_answered: true
    },
    {
      id: 'gen2',
      title: 'Proper etiquette when visiting holy shrines',
      content: 'I am planning my first ziyarat to Iraq. What is the proper Islamic etiquette, recommended practices, and duas when visiting the holy shrines of Ahlul Bayt (AS)?',
      category: 'general',
      author_id: 'u29',
      author_name: 'Hiba Kazmi',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Hiba+Kazmi&background=6b7280&color=fff',
      created_date: new Date(Date.now() - 3600000 * 17).toISOString(),
      likes: ['u2', 'u4', 'u6', 'u8'],
      reactions: { pray: ['u2', 'u4', 'u6'], love: ['u8'] },
      answer_count: 7,
      view_count: 267,
      is_answered: true
    },
    {
      id: 'gen3',
      title: 'Recommended books on Shia Islam for new Muslims',
      content: 'My friend recently converted to Shia Islam. What are the best introductory books that explain our beliefs, practices, and history in an easy-to-understand way?',
      category: 'general',
      author_id: 'u30',
      author_name: 'Yusuf Rahman',
      author_role: 'user',
      author_avatar: 'https://ui-avatars.com/api/?name=Yusuf+Rahman&background=6b7280&color=fff',
      created_date: new Date(Date.now() - 3600000 * 5).toISOString(),
      likes: ['u1', 'u3', 'u5', 'u7'],
      reactions: { insight: ['u1', 'u3'], like: ['u5', 'u7'] },
      answer_count: 8,
      view_count: 234,
      is_answered: true
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchQuery, selectedCategory]);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Try to load real questions from database
      const realQuestions = await QuestionEntity.list('-created_date');
      
      // Combine real questions with dummy data (filter out any that don't have title/content)
      const validDummyQuestions = dummyQuestions.filter(q => q.title && q.content);
      const allQuestions = [...realQuestions, ...validDummyQuestions];
      setQuestions(allQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      // If error, just use dummy data
      const validDummyQuestions = dummyQuestions.filter(q => q.title && q.content);
      setQuestions(validDummyQuestions);
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions.filter(q => q.title && q.content); // Filter out any invalid questions

    if (selectedCategory !== "all") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(q =>
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      await QuestionEntity.create({
        ...questionData,
        author_id: currentUser.id,
        author_name: currentUser.full_name,
        author_role: currentUser.user_type || 'user',
        author_avatar: currentUser.profile_image,
        likes: [],
        reactions: { like: [], love: [], insight: [], pray: [] },
        answer_count: 0,
        share_count: 0,
        view_count: 0
      });

      await loadData();
      setShowCreateModal(false);
      alert("Question posted successfully!");
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to post question. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cream-50 pb-24">
      {/* Create Question Modal */}
      <CreateQuestionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateQuestion}
        currentUser={currentUser}
        categories={categories.filter(c => c.value !== "all")}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-800" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Community Forum</h1>
              <p className="text-xs text-emerald-600">Ask, Learn & Share Knowledge</p>
            </div>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Ask</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex-shrink-0 rounded-full ${
                  selectedCategory === cat.value
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-4 pb-3 flex gap-4 text-sm">
          <div className="flex items-center gap-1 text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{filteredQuestions.length} Questions</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-700">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{filteredQuestions.reduce((sum, q) => sum + (q.answer_count || 0), 0)} Answers</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-700">
            <Users className="w-4 h-4" />
            <span className="font-medium">Active Community</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              currentUser={currentUser}
              onUpdate={loadData}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-800">
              {searchQuery || selectedCategory !== "all" ? "No Questions Found" : "No Questions Yet"}
            </h3>
            <p className="text-emerald-600 mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Be the first to ask a question"}
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask First Question
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}