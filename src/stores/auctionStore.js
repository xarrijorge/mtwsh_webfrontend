import { create } from "zustand";
import { Fetch } from "@/lib/api";
import { useAuthStore } from "./authStore";

export const useAuctionStore = create((set, get) => ({
  // Bidding
  placingBid: false,
  bidError: null,
  bidSuccess: null,

  placeBid: async (auctionId, amount) => {
    set({ placingBid: true, bidError: null, bidSuccess: null });
    const token = useAuthStore.getState().token;

    try {
      const response = await Fetch(`/auctions/${auctionId}/bid`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      set({ placingBid: false, bidSuccess: "Bid placed successfully!" });
      return response;
    } catch (error) {
      set({ placingBid: false, bidError: error.message });
      throw error;
    }
  },

  clearBidState: () => set({ placingBid: false, bidError: null, bidSuccess: null }),

  // Modal Management
  isCreateOpen: false,
  editingAuction: null,
  closingAuction: null,

  openCreateModal: () => set({ isCreateOpen: true }),
  closeCreateModal: () => set({ isCreateOpen: false }),

  openEditModal: (auction) => set({ editingAuction: auction }),
  closeEditModal: () => set({ editingAuction: null }),

  openCloseModal: (auction) => set({ closingAuction: auction }),
  closeCloseModal: () => set({ closingAuction: null }),
}));