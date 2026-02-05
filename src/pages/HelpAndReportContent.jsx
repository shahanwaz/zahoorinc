import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { Feedback } from "@/entities/Feedback";
import { UploadFile } from "@/integrations/Core";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Phone, Mail, Loader2, Upload, File } from "lucide-react";

export default function HelpAndReportContent() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [report, setReport] = useState({ category: 'Post', description: '', file: null });
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        console.error("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!report.description) {
      alert("Please describe the issue.");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to submit a report.");
      return;
    }

    setIsLoading(true);
    try {
      let screenshotUrl = '';
      if (report.file) {
        const response = await UploadFile({ file: report.file });
        screenshotUrl = response.file_url;
      }
      
      await Feedback.create({
        category: report.category,
        feedback_text: report.description,
        screenshot_url: screenshotUrl,
        user_id: currentUser.id,
        user_email: currentUser.email,
      });

      alert("Your report has been submitted. Our team will review shortly.");
      // Reset form
      setReport({ category: 'Post', description: '', file: null });
      setFileName('');
    } catch (error) {
      console.error("Report submission failed:", error);
      alert("Unable to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReport(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const HelpTabContent = () => (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How to use Zahoor app?</AccordionTrigger>
          <AccordionContent>Our app is designed to be user-friendly. Use the bottom navigation to access main sections like Home, Events, and Nearby. The sidebar menu contains links to all other features.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How to join Majalis events?</AccordionTrigger>
          <AccordionContent>Navigate to the Events page, find an event you're interested in, and click the "Join Event" button. Your attendance will be confirmed.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How to register as a Tutor/Maulana?</AccordionTrigger>
          <AccordionContent>You can apply to be a Tutor or Maulana through the "Apply as Tutor/Maulana" link in the sidebar. Your application will be reviewed by our team.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How to upgrade to Premium?</AccordionTrigger>
          <AccordionContent>Click on the "Go Premium" button in the sidebar menu. You will be guided through the subscription process to unlock exclusive features.</AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="text-center space-y-4 pt-4 border-t border-emerald-100">
        <p className="text-sm text-emerald-700">For more details call us on 9457031317 or write to us at info@zahoorfoundation.org</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.open('tel:9457031317')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Phone className="w-4 h-4 mr-2" /> Call Us
          </Button>
          <Button onClick={() => window.open('mailto:info@zahoorfoundation.org')} variant="outline" className="border-gray-300">
            <Mail className="w-4 h-4 mr-2" /> Email Us
          </Button>
        </div>
      </div>
    </div>
  );

  const ReportTabContent = () => (
    <form onSubmit={handleReportSubmit} className="space-y-6">
      <div>
        <Label htmlFor="category" className="text-emerald-800">Select Category</Label>
        <Select value={report.category} onValueChange={(value) => setReport(prev => ({...prev, category: value}))}>
          <SelectTrigger id="category" className="dialog-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Post">Post</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Message">Message</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description" className="text-emerald-800">Describe the Issue</Label>
        <Textarea 
          id="description" 
          placeholder="Please provide details about the content you are reporting..." 
          className="dialog-input min-h-[120px]"
          value={report.description}
          onChange={(e) => setReport(prev => ({...prev, description: e.target.value}))}
        />
      </div>
      <div>
        <Label className="text-emerald-800">Attach Screenshot (optional)</Label>
        <div 
          className="mt-2 flex items-center justify-center w-full p-4 border-2 border-dashed border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-50"
          onClick={() => document.getElementById('file-upload').click()}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto text-emerald-400 mb-2"/>
            <p className="text-sm text-emerald-600">Click to upload a file</p>
            {fileName && <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1"><File className="w-3 h-3"/> {fileName}</p>}
          </div>
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" className="flex-1 border-gray-300" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm border-emerald-200">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-50 mr-4">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <h1 className="text-xl font-bold text-emerald-800">Help & Report</h1>
        </div>
      </div>
      
      <div className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="report">Report Content</TabsTrigger>
          </TabsList>
          <TabsContent value="help" className="bg-white rounded-b-lg rounded-tr-lg p-6 shadow-sm border border-t-0 border-emerald-100">
            <HelpTabContent />
          </TabsContent>
          <TabsContent value="report" className="bg-white rounded-b-lg rounded-tr-lg p-6 shadow-sm border border-t-0 border-emerald-100">
            <ReportTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}