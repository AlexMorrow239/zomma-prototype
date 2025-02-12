import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { LogOut, Settings, User, X } from "lucide-react";

import { Button } from "@/components/common/button/Button";
import Loader from "@/components/common/loader/Loader";
import { EditProfileModal } from "@/components/edit-profile-modal/EditProfileModal";
import { ProspectDetails } from "@/components/prospect-details/ProspectDetails";
import { ProspectsList } from "@/components/prospects-list/ProspectsList";

import { mockProspects } from "@/assets/mocks";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/authStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useUIStore } from "@/stores/uiStore";
import type { User as UserType } from "@/types";
import { handleError } from "@/utils/errorHandler";

import "./Dashboard.scss";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  // Auth store selectors
  const { user, logout, updateUser: storeUpdateUser } = useAuthStore();

  const [selectedProspect, setSelectedProspect] = useState(mockProspects[0]);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Profile query
  const { data: profile, isLoading: isProfileLoading } = useApiQuery<UserType>(
    "/users/profile",
    {
      enabled: !!user,
      retry: 1,
      staleTime: 30000,
    }
  );

  // Auth redirect
  useEffect(() => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated();
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Profile update mutation
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
      storeUpdateUser(data); // Update user in store
      queryClient.invalidateQueries({ queryKey: ["/users/profile"] });
      addToast({
        type: "success",
        message: "Profile updated successfully",
      });
    },
    onError: handleError,
  });

  const handleProfileUpdate = async (data: {
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
  }) => {
    await updateProfileMutation.mutateAsync({
      name: data.name,
      email: data.email,
    });
  };

  const closeMenu = useCallback(() => {
    setIsUserMenuOpen(false);
  }, [setIsUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout(() => {
        addToast({
          type: "success",
          message: "Logged out successfully",
        });
        navigate("/login");
      });
    } catch (error) {
      handleError(error as Error);
    }
  };

  // Loading states
  if (!profile || !user) {
    return null;
  }

  if (isProfileLoading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <Loader isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Loader isLoading={isLoading} />
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
          <ProspectsList
            prospects={mockProspects}
            selectedProspect={selectedProspect}
            onSelectProspect={setSelectedProspect}
          />
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
