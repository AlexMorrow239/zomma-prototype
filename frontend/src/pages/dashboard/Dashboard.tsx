import { useCallback, useState } from "react";

import { LogOut, Settings, User, X } from "lucide-react";

import { Button } from "@/components/common/button/Button";
import { EditProfileModal } from "@/components/edit-profile-modal/EditProfileModal";
import { ProspectDetails } from "@/components/prospect-details/ProspectDetails";

import { mockProspects } from "@/assets/mocks";
import type { User as UserType } from "@/types";

import "./Dashboard.scss";

// Mock data for development - remove once backend is connected

export default function Dashboard() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(mockProspects[0]);
  const [profile, setProfile] = useState<UserType>({
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  });

  const closeMenu = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
  };

  const handleProfileUpdate = (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const updatedProfile = {
      id: profile.id,
      ...data,
    };

    // TODO: Send update to backend
    setProfile(updatedProfile);
    setIsEditProfileOpen(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Prospect Details</h1>
        <div className="user-menu">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<User size={18} />}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            John Doe
          </Button>

          {isUserMenuOpen && (
            <div className="user-dropdown">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<X size={18} />}
                fullWidth
                onClick={closeMenu}
                className="close-button"
              >
                Close
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Settings size={18} />}
                fullWidth
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogOut size={18} />}
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="dashboard-content">
        <div className="prospects-container">
          <div className="prospects-list">
            {mockProspects.map((prospect) => (
              <div
                key={prospect.id}
                className={`prospect-item ${
                  selectedProspect.id === prospect.id ? "selected" : ""
                }`}
                onClick={() => setSelectedProspect(prospect)}
              >
                <h3>{prospect.contact.businessName}</h3>
                <p>
                  {prospect.contact.firstName} {prospect.contact.lastName}
                </p>
                <span
                  className={`status ${prospect.contacted ? "contacted" : "new"}`}
                >
                  {prospect.contacted ? "Contacted" : "New"}
                </span>
              </div>
            ))}
          </div>
          <div className="prospect-details">
            <ProspectDetails prospect={selectedProspect} />
          </div>
        </div>
      </main>
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleProfileUpdate}
        user={profile}
      />
    </div>
  );
}
