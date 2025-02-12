import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { LogOut, Settings, User, X } from "lucide-react";

import { Button } from "@/components/common/button/Button";
import { EditProfileModal } from "@/components/edit-profile-modal/EditProfileModal";
import { ProspectDetails } from "@/components/prospect-details/ProspectDetails";

import { mockProspects } from "@/assets/mocks";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/authStore";
import type { User as UserType } from "@/types";
import { handleError } from "@/utils/errorHandler";

import "./Dashboard.scss";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(mockProspects[0]);

  const { data: profile, isLoading: isProfileLoading } = useApiQuery<UserType>(
    "/users/profile",
    {
      enabled: !!user,
      retry: 1,
      staleTime: 30000,
    }
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const updateProfileMutation = useApiMutation<
    UserType,
    {
      name?: {
        firstName: string;
        lastName: string;
      };
      email?: string;
    }
  >("/users/profile", {
    method: "PATCH",
    onSuccess: (data) => {
      setIsEditProfileOpen(false);
      // Invalidate the profile query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["/users/profile"] });
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const handleProfileUpdate = async (data: {
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
  }) => {
    try {
      await updateProfileMutation.mutateAsync({
        name: data.name,
        email: data.email,
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Profile update error:", error);
    }
  };

  const closeMenu = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      handleError(error as Error);
    }
  };

  if (isProfileLoading) {
    return <div>Loading...</div>; // Consider using a proper loading component
  }

  if (!profile) {
    return null;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isProfileLoading || !profile) {
    return (
      <div className="dashboard">
        <div className="loading-state">Loading...</div>
      </div>
    ); // Consider using a proper loading component
  }

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
            {profile.name.firstName} {profile.name.lastName}
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
