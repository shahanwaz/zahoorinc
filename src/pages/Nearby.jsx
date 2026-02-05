import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Phone, Search, Settings, 
  Heart, Plus, Building, Utensils, BookOpen, 
  Stethoscope, HandHeart, MapIcon, ShoppingBag, School, Mic, UserCheck, ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Nearby() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mosques");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: "mosques", label: "🕌 Mosques", icon: Building },
    { id: "community", label: "🏴 Community", icon: UserCheck },
    { id: "nauhakhwan", label: "🎤 Nauhakhwan", icon: Mic },
    { id: "maulana", label: "👳 Maulana", icon: UserCheck },
    { id: "graveyards", label: "⚰️ Graveyards", icon: MapIcon },
    { id: "hawza", label: "📖 Hawza", icon: School },
    { id: "libraries", label: "📚 Libraries", icon: BookOpen },
    { id: "halal-food", label: "🍲 Halal Food", icon: Utensils },
    { id: "charity", label: "❤️ Charity/NGOs", icon: HandHeart },
    { id: "doctors", label: "🏥 Doctors", icon: Stethoscope },
    { id: "ziyarat", label: "🕌 Ziyarat Spots", icon: MapPin },
    { id: "businesses", label: "🛍️ Businesses", icon: ShoppingBag }
  ];

  const dummyData = {
    mosques: [
      {
        id: 1,
        name: "Masjid-e-Kufa",
        description: "Central Imambargah, Near City Center. Known for weekly majalis and community prayers.",
        distance: "1.2 km",
        image: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=300&h=200&fit=crop",
        verified: true,
        phone: "+1 234 567 8900"
      },
      {
        id: 2,
        name: "Masjid-e-Zahra",
        description: "Known for daily Majalis and special Muharram programs. Active community center.",
        distance: "3.1 km",
        image: "https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=300&h=200&fit=crop",
        verified: true,
        phone: "+1 234 567 8901"
      }
    ],
    community: [
      {
        id: 1,
        name: "Anjuman Haidari",
        description: "Hosts Majalis & Processions. Active in community welfare and youth programs.",
        distance: "2.0 km",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        verified: true,
        members: 1200
      },
      {
        id: 2,
        name: "Anjuman-e-Shiane Ali",
        description: "Active youth wing with educational and sports activities for community members.",
        distance: "4.5 km",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop",
        verified: false,
        members: 850
      }
    ],
    nauhakhwan: [
      {
        id: 1,
        name: "Ali Raza Qasmi",
        description: "Famous Nauha reciter with melodious voice. Specializes in Persian and Urdu nauhas.",
        distance: "Available nearby",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        verified: true,
        experience: "15+ years"
      },
      {
        id: 2,
        name: "Syed Hasan Ali",
        description: "Specializes in Marsiya/Nauha recitation. Available for majalis and programs.",
        distance: "2.2 km",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop",
        verified: true,
        experience: "10+ years"
      }
    ],
    maulana: [
      {
        id: 1,
        name: "Maulana Syed Abbas Naqvi",
        description: "Delivers Friday Khutba and specializes in Islamic jurisprudence and community guidance.",
        distance: "Available in 5 km radius",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=200&fit=crop",
        verified: true,
        expertise: "Fiqh, Khutba"
      },
      {
        id: 2,
        name: "Maulana Ali Mehdi Rizvi",
        description: "Expert in Shia fiqh and Islamic philosophy. Available for religious consultations.",
        distance: "3.8 km",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop",
        verified: true,
        expertise: "Fiqh, Philosophy"
      }
    ],
    graveyards: [
      {
        id: 1,
        name: "Shia Qabristan - Ali Nagar",
        description: "Main Shia cemetery with proper Islamic burial facilities and maintenance.",
        distance: "1.0 km",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        verified: true,
        facilities: "24/7 Access"
      },
      {
        id: 2,
        name: "Qabristan Zahra Bagh",
        description: "Peaceful cemetery with beautiful landscaping and proper burial arrangements.",
        distance: "4.0 km",
        image: "https://images.unsplash.com/photo-1551858195-72dcb9ab02b9?w=300&h=200&fit=crop",
        verified: false,
        facilities: "Day Hours"
      }
    ],
    hawza: [
      {
        id: 1,
        name: "Jamiya tul Mehdi (a.s.)",
        description: "Boys Madarsa offering Islamic education from primary to advanced levels.",
        distance: "2.7 km",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
        verified: true,
        students: 300
      },
      {
        id: 2,
        name: "Darul Zahra",
        description: "Girls Islamic Studies center with focus on Quran, Hadith and Islamic sciences.",
        distance: "3.9 km",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=300&h=200&fit=crop",
        verified: true,
        students: 180
      }
    ],
    libraries: [
      {
        id: 1,
        name: "Imam Ali Knowledge Center",
        description: "Comprehensive Islamic library with books in multiple languages and digital resources.",
        distance: "1.5 km",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
        verified: true,
        books: "5000+"
      },
      {
        id: 2,
        name: "Shia Heritage Library",
        description: "Specialized collection of Shia Islamic literature and historical manuscripts.",
        distance: "3.3 km",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        verified: false,
        books: "3000+"
      }
    ],
    "halal-food": [
      {
        id: 1,
        name: "Al-Mahdi Tikka House",
        description: "Halal & Zabiha Certified restaurant serving authentic Pakistani and Indian cuisine.",
        distance: "2.0 km",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
        verified: true,
        rating: "4.5/5"
      },
      {
        id: 2,
        name: "Zahra Kitchen",
        description: "Home-style Tiffin service providing fresh, halal meals delivered to your doorstep.",
        distance: "Available",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
        verified: true,
        rating: "4.8/5"
      }
    ],
    charity: [
      {
        id: 1,
        name: "Imam Mehdi Trust",
        description: "Provides Medical Aid, education support and emergency relief for community members.",
        distance: "2.2 km",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop",
        verified: true,
        established: "1995"
      },
      {
        id: 2,
        name: "Shia Relief Fund",
        description: "Education Sponsorship and vocational training programs for underprivileged families.",
        distance: "3.5 km",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=200&fit=crop",
        verified: true,
        established: "2001"
      }
    ],
    doctors: [
      {
        id: 1,
        name: "Dr. Abbas Rizvi",
        description: "Experienced Cardiologist with 15+ years of practice. Available for consultations.",
        distance: "1.8 km",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop",
        verified: true,
        specialty: "Cardiology"
      },
      {
        id: 2,
        name: "Dr. Fatima Zaidi",
        description: "Pediatrician specializing in child care and development. Family-friendly practice.",
        distance: "3.0 km",
        image: "https://images.unsplash.com/photo-1594824804732-ca8db24518cc?w=300&h=200&fit=crop",
        verified: true,
        specialty: "Pediatrics"
      }
    ],
    ziyarat: [
      {
        id: 1,
        name: "Imambargah-e-Sibtain",
        description: "Famous Ashura Center with replica of Karbala. Special programs during Muharram.",
        distance: "2.4 km",
        image: "https://images.unsplash.com/photo-1564769625392-651d25ac8ca4?w=300&h=200&fit=crop",
        verified: true,
        established: "1980"
      },
      {
        id: 2,
        name: "Dargah-e-Abbas (a.s.) Replica",
        description: "Beautiful replica of Hazrat Abbas shrine. Open for ziyarat and prayers.",
        distance: "4.1 km",
        image: "https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=300&h=200&fit=crop",
        verified: false,
        established: "2005"
      }
    ],
    businesses: [
      {
        id: 1,
        name: "Zaidi Bookstore",
        description: "Islamic books & literature in multiple languages. Specializes in Shia publications.",
        distance: "1.3 km",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
        verified: true,
        established: "1990"
      },
      {
        id: 2,
        name: "Ali Brothers Mart",
        description: "Halal Groceries and household items. Fresh meat and zabiha chicken available.",
        distance: "2.9 km",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
        verified: true,
        established: "2010"
      }
    ]
  };

  const toggleFavorite = (id, category) => {
    const favoriteId = `${category}-${id}`;
    setFavorites(prev => 
      prev.includes(favoriteId) 
        ? prev.filter(fav => fav !== favoriteId)
        : [...prev, favoriteId]
    );
  };

  const openInMaps = (name) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const currentData = dummyData[activeTab] || [];
  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.label.split(' ')[1] || category.label : categoryId;
  };

  const EntityCard = ({ item, category }) => {
    const isFavorite = favorites.includes(`${category}-${item.id}`);
    
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 mb-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <h3 className="font-bold text-base text-emerald-800">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    {item.distance}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(item.id, category)}
                className="hover:bg-emerald-50 flex-shrink-0 -mt-1 -mr-2"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-emerald-500 text-emerald-500' : 'text-gray-400'}`} />
              </Button>
            </div>

            <p className="text-sm text-gray-600 my-2 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            <div className="flex items-center justify-end">
              <div className="flex gap-2">
                {item.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-300 h-9 hover:bg-emerald-50"
                    onClick={() => window.open(`tel:${item.phone}`)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  onClick={() => openInMaps(item.name)}
                  className="h-9 px-4 text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm border-emerald-200">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-emerald-50"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          
          <h1 className="text-xl font-bold text-emerald-800">Nearby</h1>
          
          <div className="w-10"></div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 border-emerald-200 bg-emerald-50/50 focus:border-emerald-500"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-emerald-50">
              <Settings className="w-5 h-5 text-emerald-800" />
            </Button>
          </div>
        </div>

        {/* Category Tabs with Add Buttons */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === category.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-emerald-50 text-gray-700'
                  }`}
                >
                  {category.label}
                </button>
                {activeTab === category.id && (
                  <Link to={createPageUrl(`AddNearbyListing?category=${category.id}`)}>
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-md"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-28">
        {/* Category Header with Add Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-emerald-800">
            {getCategoryLabel(activeTab)}
          </h2>
          <Link to={createPageUrl(`AddNearbyListing?category=${activeTab}`)}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Button>
          </Link>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <EntityCard
              key={item.id}
              item={item}
              category={activeTab}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-800">
              No results found
            </h3>
            <p className="text-emerald-600 mb-4">
              {searchQuery ? 'Try different keywords' : 'No listings available in this category'}
            </p>
            <Link to={createPageUrl(`AddNearbyListing?category=${activeTab}`)}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}