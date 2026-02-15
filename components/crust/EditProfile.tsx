"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X } from "lucide-react";
import Image from "next/image";

interface EditProfileProps {
  name: string;
  bio: string;
  avatar: string;
  onSave: (name: string, bio: string, avatar: string) => void;
}

const AVATARS = [
  "/mascot.svg",
  "/mascot-sad.svg",
];

export default function EditProfile({ name, bio, avatar, onSave }: EditProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editBio, setEditBio] = useState(bio);
  const [editAvatar, setEditAvatar] = useState(avatar);

  const handleSave = () => {
    onSave(editName.trim(), editBio.trim(), editAvatar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setEditBio(bio);
    setEditAvatar(avatar);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/15 transition-colors"
      >
        <Pencil className="w-4 h-4" />
        Edit Profile
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto p-5 rounded-2xl glass-gold border border-gold/20"
    >
      <h4 className="font-cinzel text-sm font-bold text-gold mb-4">Edit Your Baker Profile</h4>

      {/* Avatar Selection */}
      <div className="mb-4">
        <label className="text-cream/40 text-xs font-medium uppercase tracking-wider mb-2 block">
          Avatar
        </label>
        <div className="flex gap-2">
          {AVATARS.map((av) => (
            <button
              key={av}
              onClick={() => setEditAvatar(av)}
              className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                editAvatar === av
                  ? "border-gold scale-110"
                  : "border-cream/10 opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={av} alt="Avatar" width={48} height={48} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-3">
        <label className="text-cream/40 text-xs font-medium uppercase tracking-wider mb-1.5 block">
          Baker Name
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value.slice(0, 24))}
          placeholder="Anonymous Baker"
          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cream/10 text-cream text-sm font-inter placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors"
        />
        <p className="text-cream/20 text-[10px] mt-1 text-right">{editName.length}/24</p>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="text-cream/40 text-xs font-medium uppercase tracking-wider mb-1.5 block">
          Bio
        </label>
        <input
          type="text"
          value={editBio}
          onChange={(e) => setEditBio(e.target.value.slice(0, 60))}
          placeholder="Building the civilization..."
          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cream/10 text-cream text-sm font-inter placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors"
        />
        <p className="text-cream/20 text-[10px] mt-1 text-right">{editBio.length}/60</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber text-black text-sm font-bold"
        >
          <Check className="w-4 h-4" />
          Save
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCancel}
          className="px-4 py-2.5 rounded-xl border border-cream/10 text-cream/50 text-sm font-medium hover:bg-cream/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
