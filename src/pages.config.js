/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Home from './pages/Home';
import Events from './pages/Events';
import Questions from './pages/Questions';
import Nearby from './pages/Nearby';
import Profile from './pages/Profile';
import Splash from './pages/Splash';
import Intro from './pages/Intro';
import MyStatus from './pages/MyStatus';
import Notifications from './pages/Notifications';
import PrayerTimesPage from './pages/PrayerTimesPage';
import Duas from './pages/Duas';
import QiblaCompass from './pages/QiblaCompass';
import AwaitersCorner from './pages/AwaitersCorner';
import StoryDetail from './pages/StoryDetail';
import AnjumanExplorer from './pages/AnjumanExplorer';
import AnjumanDetails from './pages/AnjumanDetails';
import CreateAnjuman from './pages/CreateAnjuman';
import MediaLibrary from './pages/MediaLibrary';
import FindMaulana from './pages/FindMaulana';
import ContestsRewards from './pages/ContestsRewards';
import Onboarding from './pages/Onboarding';
import AzaanSettings from './pages/AzaanSettings';
import LanguageSettings from './pages/LanguageSettings';
import HelpAndReportContent from './pages/HelpAndReportContent';
import DonationSupport from './pages/DonationSupport';
import Notes from './pages/Notes';
import WishesCelebrations from './pages/WishesCelebrations';
import GoPremium from './pages/GoPremium';
import Checkout from './pages/Checkout';
import IslamicCalendar from './pages/IslamicCalendar';
import CreateTextStatus from './pages/CreateTextStatus';
import CreateMediaStatus from './pages/CreateMediaStatus';
import SurahDetail from './pages/SurahDetail';
import LiveStreaming from './pages/LiveStreaming';
import WatchStream from './pages/WatchStream';
import QuestionDetail from './pages/QuestionDetail';
import CategorySelection from './pages/CategorySelection';
import ProfileCompletion from './pages/ProfileCompletion';
import WelcomeSuccess from './pages/WelcomeSuccess';
import EjaraServices from './pages/EjaraServices';
import Payment from './pages/Payment';
import Wallet from './pages/Wallet';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Istikhara from './pages/Istikhara';
import CreateEvent from './pages/CreateEvent';
import AddNearbyListing from './pages/AddNearbyListing';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminEjara from './pages/AdminEjara';
import AdminIstikhara from './pages/AdminIstikhara';
import AdminWallet from './pages/AdminWallet';
import AdminQA from './pages/AdminQA';
import AdminStreaming from './pages/AdminStreaming';
import AdminTuition from './pages/AdminTuition';
import AdminReports from './pages/AdminReports';
import AdminFeedback from './pages/AdminFeedback';
import AdminSupport from './pages/AdminSupport';
import AdminContent from './pages/AdminContent';
import AdminSettings from './pages/AdminSettings';
import AdminRoles from './pages/AdminRoles';
import AdminLogin from './pages/AdminLogin';
import MaulanaProfile from './pages/MaulanaProfile';
import GoLive from './pages/GoLive';
import MajalisLectures from './pages/MajalisLectures';
import SavedItems from './pages/SavedItems';
import MediaSubcategory from './pages/MediaSubcategory';
import LandingPage from './pages/LandingPage';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Events": Events,
    "Questions": Questions,
    "Nearby": Nearby,
    "Profile": Profile,
    "Splash": Splash,
    "Intro": Intro,
    "MyStatus": MyStatus,
    "Notifications": Notifications,
    "PrayerTimesPage": PrayerTimesPage,
    "Duas": Duas,
    "QiblaCompass": QiblaCompass,
    "AwaitersCorner": AwaitersCorner,
    "StoryDetail": StoryDetail,
    "AnjumanExplorer": AnjumanExplorer,
    "AnjumanDetails": AnjumanDetails,
    "CreateAnjuman": CreateAnjuman,
    "MediaLibrary": MediaLibrary,
    "FindMaulana": FindMaulana,
    "ContestsRewards": ContestsRewards,
    "Onboarding": Onboarding,
    "AzaanSettings": AzaanSettings,
    "LanguageSettings": LanguageSettings,
    "HelpAndReportContent": HelpAndReportContent,
    "DonationSupport": DonationSupport,
    "Notes": Notes,
    "WishesCelebrations": WishesCelebrations,
    "GoPremium": GoPremium,
    "Checkout": Checkout,
    "IslamicCalendar": IslamicCalendar,
    "CreateTextStatus": CreateTextStatus,
    "CreateMediaStatus": CreateMediaStatus,
    "SurahDetail": SurahDetail,
    "LiveStreaming": LiveStreaming,
    "WatchStream": WatchStream,
    "QuestionDetail": QuestionDetail,
    "CategorySelection": CategorySelection,
    "ProfileCompletion": ProfileCompletion,
    "WelcomeSuccess": WelcomeSuccess,
    "EjaraServices": EjaraServices,
    "Payment": Payment,
    "Wallet": Wallet,
    "AboutUs": AboutUs,
    "TermsAndConditions": TermsAndConditions,
    "PrivacyPolicy": PrivacyPolicy,
    "Istikhara": Istikhara,
    "CreateEvent": CreateEvent,
    "AddNearbyListing": AddNearbyListing,
    "AdminDashboard": AdminDashboard,
    "AdminUsers": AdminUsers,
    "AdminEjara": AdminEjara,
    "AdminIstikhara": AdminIstikhara,
    "AdminWallet": AdminWallet,
    "AdminQA": AdminQA,
    "AdminStreaming": AdminStreaming,
    "AdminTuition": AdminTuition,
    "AdminReports": AdminReports,
    "AdminFeedback": AdminFeedback,
    "AdminSupport": AdminSupport,
    "AdminContent": AdminContent,
    "AdminSettings": AdminSettings,
    "AdminRoles": AdminRoles,
    "AdminLogin": AdminLogin,
    "MaulanaProfile": MaulanaProfile,
    "GoLive": GoLive,
    "MajalisLectures": MajalisLectures,
    "SavedItems": SavedItems,
    "MediaSubcategory": MediaSubcategory,
    "LandingPage": LandingPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};