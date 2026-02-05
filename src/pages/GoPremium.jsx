
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react'; // Loader2 removed as isLoading state is removed
import { motion } from 'framer-motion';

export default function GoPremium() {
    const navigate = useNavigate();
    // const [isLoading, setIsLoading] = useState(null); // 'monthly', 'yearly', or null - Removed as per new payment flow

    const features = [
        { icon: '✨', title: 'Ad-Free Experience', description: 'Focus on spirituality without distractions.' },
        { icon: '📖', title: 'Exclusive Duas & Tafseer', description: 'Unlock special duas and translations.' },
        { icon: '☁️', title: 'Cloud Backup for Notes', description: 'Securely save your text & audio notes.' },
        { icon: '🎁', title: 'Double Contest Rewards', description: 'Get more chances to win in contests.' },
        { icon: '🖼️', title: 'Premium Wallpapers & Wishes', description: 'Exclusive Islamic content to share.' },
        { icon: '❤️', title: 'Support the Foundation', description: 'Your contribution helps us grow.' },
    ];

    const testimonials = [
        { name: 'Ali R.', text: 'Premium helped me save my Bayaz securely and the ad-free experience is a blessing. Worth it!' },
        { name: 'Fatima Z.', text: 'I love the exclusive duas and the premium wishes for special occasions. JazakAllah for this app.' }
    ];

    // handleSubscription function removed as buttons now directly link to payment page
    // const handleSubscription = (plan) => {
    //     setIsLoading(plan);
    //     setTimeout(() => {
    //         setIsLoading(null);
    //         navigate(createPageUrl('Home?status=premium_success'));
    //     }, 2000);
    // };

    return (
        <div className="min-h-screen bg-emerald-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-4 border-b border-emerald-100">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4 hover:bg-emerald-100">
                        <ArrowLeft className="w-5 h-5 text-emerald-800" />
                    </Button>
                    <h1 className="text-xl font-bold text-emerald-800">Go Premium</h1>
                </div>
            </header>

            <main className="pb-24">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-center py-12 px-4 dark-context">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/2c0282437_487ad098c_yabaqiyatullah.png" 
                            alt="Zahoor Logo" 
                            className="w-20 h-20 mx-auto mb-4 rounded-2xl"
                        />
                        <h2 className="text-2xl font-bold mb-2">Support the Community,</h2>
                        <p className="text-lg opacity-90">Unlock More Barakah 🌙</p>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glassmorphism rounded-2xl p-4 flex items-start gap-4"
                            >
                                <span className="text-2xl mt-1">{feature.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-emerald-800">{feature.title}</h3>
                                    <p className="text-sm text-emerald-700">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Plans Section */}
                <section className="p-4" id="plans-section"> {/* Added id for sticky CTA scroll */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Monthly Plan */}
                        <div className="bg-white rounded-2xl p-6 border shadow-sm">
                            <h3 className="text-xl font-bold text-emerald-800 mb-2">💠 Monthly Plan</h3>
                            <p className="text-3xl font-bold text-emerald-900">₹199 <span className="text-base font-normal text-gray-500">/ month</span></p>
                            <ul className="space-y-2 my-4 text-sm">
                                <li className="flex items-center gap-2 text-emerald-700"><CheckCircle className="w-4 h-4 text-green-500"/>Cancel anytime</li>
                                <li className="flex items-center gap-2 text-emerald-700"><CheckCircle className="w-4 h-4 text-green-500"/>Access to all premium features</li>
                            </ul>
                            <Link to={createPageUrl('Payment?amount=199&purpose=Monthly Premium Subscription')}>
                              <Button className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-lg shadow-lg">
                                Upgrade to Premium
                              </Button>
                            </Link>
                        </div>

                        {/* Yearly Plan */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-lg relative">
                            <Badge className="absolute -top-3 right-4 bg-emerald-500 text-white">RECOMMENDED</Badge>
                            <h3 className="text-xl font-bold text-emerald-800 mb-2">💎 Yearly Plan</h3>
                            <p className="text-3xl font-bold text-emerald-900">₹1999 <span className="text-base font-normal text-gray-500">/ year</span></p>
                            <p className="text-sm font-semibold text-green-600">Save 20%</p>
                            <ul className="space-y-2 my-4 text-sm">
                                <li className="flex items-center gap-2 text-emerald-700"><CheckCircle className="w-4 h-4 text-green-500"/>All premium features</li>
                                <li className="flex items-center gap-2 text-emerald-700"><CheckCircle className="w-4 h-4 text-green-500"/>Bonus: Free Islamic eBook</li>
                            </ul>
                            <Link to={createPageUrl('Payment?amount=1999&purpose=Yearly Premium Subscription')}>
                              <Button className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-lg shadow-lg">
                                Upgrade to Premium
                              </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="p-4">
                    <h3 className="text-lg font-bold text-center mb-4 text-emerald-800">What Our Supporters Say</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 italic">
                                <p className="text-emerald-800">"{testimonial.text}"</p>
                                <p className="text-right font-semibold text-emerald-700 mt-2">- {testimonial.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="px-4 mt-6 text-center text-sm text-emerald-700">
                    <p className="mb-2">Your contribution supports Zahoor Foundation to reach more people and build community resources.</p>
                    <p>Secure payments powered by Stripe / Razorpay.</p>
                </footer>
            </main>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-sm p-3 border-t border-emerald-100">
                 <Button onClick={() => document.querySelector('#plans-section').scrollIntoView({ behavior: 'smooth' })} className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-bold shadow-lg shadow-emerald-500/30">
                    Upgrade Now
                </Button>
            </div>
        </div>
    );
}
