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
import AboutUs from './pages/AboutUs';
import AddNearbyListing from './pages/AddNearbyListing';
import AdminContent from './pages/AdminContent';
import AdminDashboard from './pages/AdminDashboard';
import AdminEjara from './pages/AdminEjara';
import AdminFeedback from './pages/AdminFeedback';
import AdminIstikhara from './pages/AdminIstikhara';
import AdminLogin from './pages/AdminLogin';
import AdminQA from './pages/AdminQA';
import AdminReports from './pages/AdminReports';
import AdminRoles from './pages/AdminRoles';
import AdminSettings from './pages/AdminSettings';
import AdminStreaming from './pages/AdminStreaming';
import AdminSupport from './pages/AdminSupport';
import AdminTuition from './pages/AdminTuition';
import AdminUsers from './pages/AdminUsers';
import AdminWallet from './pages/AdminWallet';
import AnjumanDetails from './pages/AnjumanDetails';
import AnjumanExplorer from './pages/AnjumanExplorer';
import AwaitersCorner from './pages/AwaitersCorner';
import AzaanSettings from './pages/AzaanSettings';
import CategorySelection from './pages/CategorySelection';
import Checkout from './pages/Checkout';
import ContestsRewards from './pages/ContestsRewards';
import CreateAnjuman from './pages/CreateAnjuman';
import CreateEvent from './pages/CreateEvent';
import CreateMediaStatus from './pages/CreateMediaStatus';
import CreateTextStatus from './pages/CreateTextStatus';
import DonationSupport from './pages/DonationSupport';
import Duas from './pages/Duas';
import EjaraServices from './pages/EjaraServices';
import Events from './pages/Events';
import FindMaulana from './pages/FindMaulana';
import GoLive from './pages/GoLive';
import GoPremium from './pages/GoPremium';
import HelpAndReportContent from './pages/HelpAndReportContent';
import Home from './pages/Home';
import Intro from './pages/Intro';
import IslamicCalendar from './pages/IslamicCalendar';
import Istikhara from './pages/Istikhara';
import LandingPage from './pages/LandingPage';
import LanguageSettings from './pages/LanguageSettings';
import LiveStreaming from './pages/LiveStreaming';
import MajalisLectures from './pages/MajalisLectures';
import MaulanaProfile from './pages/MaulanaProfile';
import MediaLibrary from './pages/MediaLibrary';
import MediaSubcategory from './pages/MediaSubcategory';
import MyStatus from './pages/MyStatus';
import Nearby from './pages/Nearby';
import Notes from './pages/Notes';
import Notifications from './pages/Notifications';
import Onboarding from './pages/Onboarding';
import Payment from './pages/Payment';
import PrayerTimesPage from './pages/PrayerTimesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import ProfileCompletion from './pages/ProfileCompletion';
import QiblaCompass from './pages/QiblaCompass';
import QuestionDetail from './pages/QuestionDetail';
import Questions from './pages/Questions';
import SavedItems from './pages/SavedItems';
import Splash from './pages/Splash';
import StoryDetail from './pages/StoryDetail';
import SurahDetail from './pages/SurahDetail';
import TermsAndConditions from './pages/TermsAndConditions';
import Wallet from './pages/Wallet';
import WatchStream from './pages/WatchStream';
import WelcomeSuccess from './pages/WelcomeSuccess';
import WishesCelebrations from './pages/WishesCelebrations';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AboutUs": AboutUs,
    "AddNearbyListing": AddNearbyListing,
    "AdminContent": AdminContent,
    "AdminDashboard": AdminDashboard,
    "AdminEjara": AdminEjara,
    "AdminFeedback": AdminFeedback,
    "AdminIstikhara": AdminIstikhara,
    "AdminLogin": AdminLogin,
    "AdminQA": AdminQA,
    "AdminReports": AdminReports,
    "AdminRoles": AdminRoles,
    "AdminSettings": AdminSettings,
    "AdminStreaming": AdminStreaming,
    "AdminSupport": AdminSupport,
    "AdminTuition": AdminTuition,
    "AdminUsers": AdminUsers,
    "AdminWallet": AdminWallet,
    "AnjumanDetails": AnjumanDetails,
    "AnjumanExplorer": AnjumanExplorer,
    "AwaitersCorner": AwaitersCorner,
    "AzaanSettings": AzaanSettings,
    "CategorySelection": CategorySelection,
    "Checkout": Checkout,
    "ContestsRewards": ContestsRewards,
    "CreateAnjuman": CreateAnjuman,
    "CreateEvent": CreateEvent,
    "CreateMediaStatus": CreateMediaStatus,
    "CreateTextStatus": CreateTextStatus,
    "DonationSupport": DonationSupport,
    "Duas": Duas,
    "EjaraServices": EjaraServices,
    "Events": Events,
    "FindMaulana": FindMaulana,
    "GoLive": GoLive,
    "GoPremium": GoPremium,
    "HelpAndReportContent": HelpAndReportContent,
    "Home": Home,
    "Intro": Intro,
    "IslamicCalendar": IslamicCalendar,
    "Istikhara": Istikhara,
    "LandingPage": LandingPage,
    "LanguageSettings": LanguageSettings,
    "LiveStreaming": LiveStreaming,
    "MajalisLectures": MajalisLectures,
    "MaulanaProfile": MaulanaProfile,
    "MediaLibrary": MediaLibrary,
    "MediaSubcategory": MediaSubcategory,
    "MyStatus": MyStatus,
    "Nearby": Nearby,
    "Notes": Notes,
    "Notifications": Notifications,
    "Onboarding": Onboarding,
    "Payment": Payment,
    "PrayerTimesPage": PrayerTimesPage,
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "ProfileCompletion": ProfileCompletion,
    "QiblaCompass": QiblaCompass,
    "QuestionDetail": QuestionDetail,
    "Questions": Questions,
    "SavedItems": SavedItems,
    "Splash": Splash,
    "StoryDetail": StoryDetail,
    "SurahDetail": SurahDetail,
    "TermsAndConditions": TermsAndConditions,
    "Wallet": Wallet,
    "WatchStream": WatchStream,
    "WelcomeSuccess": WelcomeSuccess,
    "WishesCelebrations": WishesCelebrations,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};