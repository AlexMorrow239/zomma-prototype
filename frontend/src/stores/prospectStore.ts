import { create } from "zustand";

import type { Prospect } from "@/types";

interface ProspectState {
  selectedProspect: Prospect | null;
  prospects: Prospect[];
  setSelectedProspect: (prospect: Prospect | null) => void;
  setProspects: (prospects: Prospect[]) => void;
  updateProspect: (updatedProspect: Prospect) => void;
}

export const useProspectStore = create<ProspectState>((set) => ({
  selectedProspect: null,
  prospects: [],
  setSelectedProspect: (prospect) => set({ selectedProspect: prospect }),
  setProspects: (prospects) => set({ prospects }),
  updateProspect: (updatedProspect) =>
    set((state) => ({
      prospects: state.prospects.map((prospect) =>
        prospect._id === updatedProspect._id ? updatedProspect : prospect
      ),
    })),
}));
