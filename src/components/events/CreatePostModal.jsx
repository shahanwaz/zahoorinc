
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Heart, BookOpen, Loader2 } from "lucide-react";
import { Event } from "@/entities/Event";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CreatePostModal({ open, onOpenChange, onPostCreated, currentUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalHadiya, setTotalHadiya] = useState(0);

  // Form States
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    max_attendees: "",
    event_type: "majlis", // Defaulting type
    latitude: "",
    longitude: ""
  });
  const [condolenceForm, setCondolenceForm] = useState({ title: "", message: "", image: null });
  const [ejaraForm, setEjaraForm] = useState({ type: "qaza_namaz", title: "", count: "", validity_date: "", participants: "", hadiya_per_person: "" });

  const resetForms = () => {
    setEventForm({ title: "", description: "", venue: "", date: "", time: "", max_attendees: "", event_type: "majlis", latitude: "", longitude: "" });
    setCondolenceForm({ title: "", message: "", image: null });
    setEjaraForm({ type: "qaza_namaz", title: "", count: "", validity_date: "", participants: "", hadiya_per_person: "" });
    setTotalHadiya(0);
  };

  const handleEjaraHadiyaCalc = (participants, hadiya) => {
    const p = parseInt(participants) || 0;
    const h = parseInt(hadiya) || 0;
    setTotalHadiya(p * h);
  }

  const handleEventSubmit = async () => {
    if (!currentUser || !eventForm.title || !eventForm.date || !eventForm.time || !eventForm.venue) {
      alert("Please fill in all required fields (Title, Date, Time, Venue)");
      return;
    }

    setIsLoading(true);
    try {
      // Create location object
      const location = {
        address: eventForm.venue
      };

      // If coordinates provided, add them
      if (eventForm.latitude && eventForm.longitude) {
        location.latitude = parseFloat(eventForm.latitude);
        location.longitude = parseFloat(eventForm.longitude);
      }

      await Event.create({
        title: eventForm.title,
        description: eventForm.description,
        venue: eventForm.venue,
        date: eventForm.date,
        time: eventForm.time,
        event_type: eventForm.event_type,
        organizer_id: currentUser.id,
        attendees: [],
        max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null,
        location: location,
        is_public: true
      });

      onPostCreated();
      onOpenChange(false);
      resetForms();
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCondolenceSubmit = async () => {
     if (!condolenceForm.title || !condolenceForm.message) return;
     alert("Condolence submitted (UI only).");
     onOpenChange(false);
     resetForms();
  }

  const handleEjaraSubmit = async () => {
    if(!ejaraForm.title || !ejaraForm.count || !ejaraForm.participants || !ejaraForm.hadiya_per_person) return;
    alert(`Ejara post submitted with total hadiya of ₹${totalHadiya} (UI only).`);
    onOpenChange(false);
    resetForms();
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-emerald-800">Add New Post</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-8 pb-6">
            {/* Majalis & Mahfil Section */}
            <section className="space-y-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
                <Calendar className="w-5 h-5"/>
                Majalis & Mahfil
              </h3>

              <div>
                <Label>Event Title*</Label>
                <Input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  placeholder="e.g., Majlis-e-Aza"
                  className="dialog-input"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  placeholder="Event details..."
                  className="dialog-input"
                />
              </div>

              <div>
                <Label>Event Type</Label>
                <Select
                  value={eventForm.event_type}
                  onValueChange={(value) => setEventForm({...eventForm, event_type: value})}
                >
                  <SelectTrigger className="dialog-input">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="majlis">Majlis</SelectItem>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="community">Community Event</SelectItem>
                    <SelectItem value="ziyarat">Ziyarat Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date*</Label>
                  <Input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    className="dialog-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Time*</Label>
                  <Input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    className="dialog-input"
                  />
                </div>
              </div>

              <div>
                <Label>Location / Venue*</Label>
                <Input
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                  placeholder="Full address"
                  className="dialog-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude (Optional)</Label>
                  <Input
                    type="number"
                    step="any"
                    value={eventForm.latitude}
                    onChange={(e) => setEventForm({...eventForm, latitude: e.target.value})}
                    placeholder="28.6139"
                    className="dialog-input"
                  />
                </div>
                <div>
                  <Label>Longitude (Optional)</Label>
                  <Input
                    type="number"
                    step="any"
                    value={eventForm.longitude}
                    onChange={(e) => setEventForm({...eventForm, longitude: e.target.value})}
                    placeholder="77.2090"
                    className="dialog-input"
                  />
                </div>
              </div>

              <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                💡 Tip: Add latitude/longitude for accurate location on maps
              </div>

              <div>
                <Label>Max Participants (Optional)</Label>
                <Input
                  type="number"
                  value={eventForm.max_attendees}
                  onChange={(e) => setEventForm({...eventForm, max_attendees: e.target.value})}
                  placeholder="Leave empty for unlimited"
                  className="dialog-input"
                />
              </div>

              <Button
                onClick={handleEventSubmit}
                className="w-full primary-btn"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                Post Event
              </Button>
            </section>

            {/* Condolences Section */}
            <section className="space-y-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-700 flex items-center gap-2"><Heart className="w-5 h-5"/>Condolences</h3>
              <div><Label>Title*</Label><Input value={condolenceForm.title} onChange={(e) => setCondolenceForm({...condolenceForm, title: e.target.value})} placeholder="In Memory of..." className="dialog-input"/></div>
              <div><Label>Message*</Label><Textarea value={condolenceForm.message} onChange={(e) => setCondolenceForm({...condolenceForm, message: e.target.value})} placeholder="Write your condolence..." className="dialog-input min-h-24"/></div>
              <Button onClick={handleCondolenceSubmit} className="w-full bg-gray-600 hover:bg-gray-700 text-white" disabled={isLoading}>{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}Post Condolence</Button>
            </section>

            {/* Ejara Section */}
            <section className="space-y-4 p-4 rounded-xl border border-yellow-200 bg-yellow-50/50">
              <h3 className="font-bold text-lg text-yellow-800 flex items-center gap-2"><BookOpen className="w-5 h-5"/>Ejara (Roza, Namaz & More)</h3>
              <div><Label>Title*</Label><Input value={ejaraForm.title} onChange={(e) => setEjaraForm({...ejaraForm, title: e.target.value})} placeholder="e.g., Qaza Namaz for Father" className="dialog-input"/></div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Type</Label>
                    <Select value={ejaraForm.type} onValueChange={(value) => setEjaraForm({...ejaraForm, type: value})}>
                      <SelectTrigger className="dialog-input"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qaza_namaz">Qaza Namaz</SelectItem>
                        <SelectItem value="quran_recitation">Quran Recitation</SelectItem>
                        <SelectItem value="roza">Roza (Fasting)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Number of Days/Qurans*</Label><Input type="number" value={ejaraForm.count} onChange={(e) => setEjaraForm({...ejaraForm, count: e.target.value})} placeholder="e.g., 180" className="dialog-input"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Participants Needed*</Label><Input type="number" value={ejaraForm.participants} onChange={(e) => {setEjaraForm({...ejaraForm, participants: e.target.value}); handleEjaraHadiyaCalc(e.target.value, ejaraForm.hadiya_per_person)}} placeholder="e.g., 4" className="dialog-input"/></div>
                <div><Label>Hadiya per Person*</Label><Input type="number" value={ejaraForm.hadiya_per_person} onChange={(e) => {setEjaraForm({...ejaraForm, hadiya_per_person: e.target.value}); handleEjaraHadiyaCalc(ejaraForm.participants, e.target.value)}} placeholder="₹5000" className="dialog-input"/></div>
              </div>
              <div><Label>Valid Until*</Label><Input type="date" value={ejaraForm.validity_date} onChange={(e) => setEjaraForm({...ejaraForm, validity_date: e.target.value})} className="dialog-input"/></div>
              {totalHadiya > 0 && <div className="text-center p-2 rounded-lg bg-yellow-100 text-yellow-900">Total Hadiya: <span className="font-bold">₹{totalHadiya.toLocaleString()}</span></div>}
              <Button onClick={handleEjaraSubmit} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" disabled={isLoading}>{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}Pay & Post</Button>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
