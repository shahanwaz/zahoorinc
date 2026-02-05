import React from 'react';

const galleryItems = [
  { image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop&q=80", caption: "Your Zakat built this classroom" },
  { image: "https://images.unsplash.com/photo-1542810634-71277d952594?w=400&h=300&fit=crop&q=80", caption: "Clean water for a whole village" },
  { image: "https://images.unsplash.com/photo-1594824804732-ca8db24518cc?w=400&h=300&fit=crop&q=80", caption: "Medical supplies delivered" },
  { image: "https://images.unsplash.com/photo-1609086799890-96526e1cd82c?w=400&h=300&fit=crop&q=80", caption: "Eid gifts brought smiles" },
];

export default function ImpactGallery() {
  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">See Your Impact</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryItems.map((item, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden group shadow-lg">
            <img src={item.image} alt={item.caption} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <p className="absolute bottom-0 left-0 p-3 text-white text-sm font-semibold">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}