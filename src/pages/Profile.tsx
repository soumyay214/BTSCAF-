import React, { useState, useEffect } from "react";
import { useAuthStore, useThemeStore, ThemeFont } from "@/src/lib/store";
import { db } from "@/src/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { User, MapPin, Camera, Save, Plus, X, Loader2, Palette, Type, RefreshCcw, CheckCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";
import { Address } from "@/src/types";

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const { primaryColor, accentColor, fontFamily, setPrimaryColor, setAccentColor, setFontFamily, resetTheme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    photoURL: user?.photoURL || "",
    savedAddresses: user?.savedAddresses || [] as Address[]
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState<Omit<Address, 'id'>>({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });

  const fonts: { id: ThemeFont; name: string }[] = [
    { id: 'sans', name: 'Modern Sans' },
    { id: 'serif', name: 'Elegant Serif' },
    { id: 'mono', name: 'Technical Mono' }
  ];

  const presets = [
    { name: 'Classic BTS', primary: '#6d28d9', accent: '#fbbf24' },
    { name: 'Butter', primary: '#fbbf24', accent: '#000000' },
    { name: 'Dynamite', primary: '#f43f5e', accent: '#38bdf8' },
    { name: 'Spring Day', primary: '#34d399', accent: '#fb7185' },
    { name: 'Midnight', primary: '#1e1b4b', accent: '#a78bfa' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        photoURL: user.photoURL,
        savedAddresses: user.savedAddresses || []
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        photoURL: formData.photoURL,
        savedAddresses: formData.savedAddresses
      });

      setUser({
        ...user,
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        photoURL: formData.photoURL,
        savedAddresses: formData.savedAddresses
      });

      setIsEditing(false);
      toast.success("Profile updated successfully! 💜");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. ☕");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!addressFormData.street) return;
    const newAddress: Address = {
      ...addressFormData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setFormData(prev => {
      const updated = addressFormData.isDefault 
        ? [...prev.savedAddresses.map(a => ({ ...a, isDefault: false })), newAddress]
        : [...prev.savedAddresses, newAddress];
      
      if (updated.length === 1) updated[0].isDefault = true;
      return { ...prev, savedAddresses: updated };
    });
    
    setAddressFormData({
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false
    });
    setShowAddressForm(false);
  };

  const handleRemoveAddress = (id: string) => {
    setFormData(prev => {
      const updated = prev.savedAddresses.filter(a => a.id !== id);
      if (updated.length > 0 && !updated.some(a => a.isDefault)) {
        updated[0].isDefault = true;
      }
      return { ...prev, savedAddresses: updated };
    });
  };

  const handleSetDefault = (id: string) => {
    setFormData(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bts-cream">
        <div className="glass p-12 rounded-[40px] text-center space-y-6">
          <User className="w-16 h-16 mx-auto text-bts-purple/40" />
          <h2 className="text-2xl font-display font-bold">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bts-cream min-h-screen pt-12 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="font-display text-5xl font-bold">My <span className="text-bts-purple-dark italic">Profile</span></h1>
            <p className="text-bts-black/50 font-light">Manage your cafe personality and delivery preferences.</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-bts-black text-bts-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-bts-purple-dark transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {/* Avatar & Basic Info */}
          <section className="glass rounded-[40px] p-8 md:p-12 space-y-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <img 
                  src={formData.photoURL || "https://via.placeholder.com/150"} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-bts-purple/20 shadow-xl"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow space-y-4 text-center md:text-left w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40 mb-1 block">Display Name</label>
                        <input 
                          type="text" 
                          value={formData.displayName}
                          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                          className="w-full glass border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-bts-purple"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40 mb-1 block">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full glass border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-bts-purple"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40 mb-1 block">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="w-full glass border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-bts-purple"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40 mb-1 block">Photo URL</label>
                        <input 
                          type="text" 
                          value={formData.photoURL}
                          onChange={(e) => setFormData(prev => ({ ...prev, photoURL: e.target.value }))}
                          className="w-full glass border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-bts-purple"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold">{user.displayName}</h2>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-bts-black/40 font-mono text-xs">{user.email}</p>
                      {user.phoneNumber && <p className="text-bts-black/40 font-mono text-xs">{user.phoneNumber}</p>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-bts-purple/20 text-bts-purple-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {user.role} Member
                      </span>
                      <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center">
                        {user.loyaltyPoints} Points 💜
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Addresses */}
          <section className="glass rounded-[40px] p-8 md:p-12 space-y-8">
            <div className="flex items-center justify-between border-b border-bts-purple/10 pb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-bts-purple-dark w-6 h-6" />
                <h3 className="text-xl font-bold">Saved Addresses</h3>
              </div>
              {isEditing && !showAddressForm && (
                <button 
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-bts-purple-dark text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-bts-black"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {showAddressForm && isEditing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white/40 p-6 rounded-[32px] border border-bts-purple/20 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <input 
                        type="text" 
                        placeholder="Label (e.g. Home, Office)"
                        value={addressFormData.label}
                        onChange={(e) => setAddressFormData(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full glass border-none rounded-2xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        placeholder="Street Address"
                        value={addressFormData.street}
                        onChange={(e) => setAddressFormData(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full glass border-none rounded-2xl px-4 py-3 text-sm"
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="City"
                      value={addressFormData.city}
                      onChange={(e) => setAddressFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="glass border-none rounded-2xl px-4 py-3 text-sm"
                    />
                    <input 
                      type="text" 
                      placeholder="State"
                      value={addressFormData.state}
                      onChange={(e) => setAddressFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="glass border-none rounded-2xl px-4 py-3 text-sm"
                    />
                    <input 
                      type="text" 
                      placeholder="Zip Code"
                      value={addressFormData.zipCode}
                      onChange={(e) => setAddressFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="glass border-none rounded-2xl px-4 py-3 text-sm"
                    />
                    <div className="flex items-center gap-2 px-2">
                      <input 
                        type="checkbox" 
                        id="defaultAddr"
                        checked={addressFormData.isDefault}
                        onChange={(e) => setAddressFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="w-4 h-4 rounded border-bts-purple text-bts-purple focus:ring-bts-purple"
                      />
                      <label htmlFor="defaultAddr" className="text-xs font-medium text-bts-black/60">Set as default</label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={handleAddAddress}
                      className="flex-grow bg-bts-black text-white py-3 rounded-2xl text-sm font-bold"
                    >
                      Add Address
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-6 py-3 border border-bts-black/10 rounded-2xl text-sm font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {formData.savedAddresses.map((addr) => (
                <motion.div 
                  layout
                  key={addr.id} 
                  className={cn(
                    "relative p-5 rounded-[32px] border transition-all flex flex-col gap-1",
                    addr.isDefault ? "bg-bts-purple/5 border-bts-purple/20" : "bg-white/40 border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{addr.label || "Address"}</h4>
                      {addr.isDefault && <span className="bg-bts-purple text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-full tracking-widest">Default</span>}
                    </div>
                    {isEditing && (
                      <div className="flex items-center gap-1">
                        {!addr.isDefault && (
                          <button 
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            className="p-1.5 hover:bg-bts-purple/10 text-bts-purple-dark rounded-lg transition-colors"
                            title="Set as default"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => handleRemoveAddress(addr.id)}
                          className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-bts-black/60">{addr.street}</p>
                  <p className="text-xs text-bts-black/40">{addr.city}, {addr.state} {addr.zipCode}</p>
                </motion.div>
              ))}

              {formData.savedAddresses.length === 0 && !isEditing && !showAddressForm && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-bts-gray rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="text-bts-black/20 w-8 h-8" />
                  </div>
                  <p className="text-bts-black/30 text-sm italic font-light">No addresses saved yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Theme Customization */}
          <section className="glass rounded-[40px] p-8 md:p-12 space-y-10">
            <div className="flex items-center justify-between border-b border-bts-purple/10 pb-4">
              <div className="flex items-center space-x-3">
                <Palette className="text-bts-purple-dark w-6 h-6" />
                <h3 className="text-xl font-bold">App Appearance</h3>
              </div>
              <button 
                type="button" 
                onClick={resetTheme}
                className="text-[10px] flex items-center space-x-1 font-bold uppercase tracking-widest text-bts-purple-dark hover:text-bts-black transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold flex items-center space-x-2">
                    <Type className="w-4 h-4 text-bts-purple-dark" />
                    <span>Typography</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFontFamily(f.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between",
                          fontFamily === f.id ? "bg-bts-black text-white border-bts-black shadow-lg" : "bg-white/40 border-transparent hover:border-bts-purple/20"
                        )}
                      >
                        <span className={cn("text-sm", f.id === 'serif' && "font-display", f.id === 'mono' && "font-mono")}>
                          {f.name}
                        </span>
                        {fontFamily === f.id && <CheckCircle className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Color Theme Presets</h4>
                  <div className="flex flex-wrap gap-3">
                    {presets.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(p.primary);
                          setAccentColor(p.accent);
                        }}
                        className="group flex flex-col items-center space-y-2"
                        title={p.name}
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden flex transform transition-transform group-hover:scale-110">
                          <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: p.accent }} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight text-bts-black/40 group-hover:text-bts-purple-dark">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Custom Primary Color</h4>
                  <div className="flex items-center space-x-4 glass p-4 rounded-2xl">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <div className="flex-grow">
                      <p className="text-xs font-medium text-bts-black/60">Primary Brand Color</p>
                      <p className="text-[10px] font-mono text-bts-purple-dark uppercase">{primaryColor}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Custom Accent Color</h4>
                  <div className="flex items-center space-x-4 glass p-4 rounded-2xl">
                    <input 
                      type="color" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <div className="flex-grow">
                      <p className="text-xs font-medium text-bts-black/60">Accent / Interaction Color</p>
                      <p className="text-[10px] font-mono text-bts-gold uppercase">{accentColor}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-bts-purple/5 border border-bts-purple/10 rounded-[32px] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-bts-purple-dark">Live Preview Card</h5>
                  <div className="glass p-5 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-bts-purple" />
                      <div className="h-2 w-24 bg-bts-purple/20 rounded-full" />
                    </div>
                    <button 
                      type="button"
                      onClick={() => toast.success("Theme preview button clicked! 💜")}
                      className="w-full bg-bts-black text-white py-2 rounded-xl text-xs font-bold hover:bg-bts-purple transition-colors"
                    >
                      Demo Button
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex-grow bg-bts-black text-bts-cream py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-bts-purple-dark transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>Save Changes</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    displayName: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber || "",
                    photoURL: user.photoURL,
                    savedAddresses: user.savedAddresses || []
                  });
                }}
                className="bg-bts-gray text-bts-black px-8 py-4 rounded-2xl font-bold hover:bg-bts-black hover:text-white transition-all underline decoration-bts-purple/40 underline-offset-4"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
