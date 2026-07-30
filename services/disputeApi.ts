import apiClient from "@/lib/apiClient";
import type {
  Dispute,
  RaiseDisputePayload,
  ResolveDisputePayload,
  StreamTokenResponse,
} from "@/types/dispute";

export const disputeApi = {
  getDisputes: () => apiClient.get<Dispute[]>("/disputes"),

  getDisputeDetails: (id: string) => apiClient.get<Dispute>(`/disputes/${id}`),

  raiseDispute: (payload: RaiseDisputePayload) =>
    apiClient.post<Dispute>("/disputes", payload),

  getStreamToken: () =>
    apiClient.get<StreamTokenResponse>("/disputes/stream-token"),

  activateDispute: (id: string, payload?: { financeAdminId?: string }) =>
    apiClient.post<Dispute>(`/disputes/${id}/activate`, payload),

  resolveDispute: (id: string, payload: ResolveDisputePayload) =>
    apiClient.post<Dispute>(`/disputes/${id}/resolve`, payload),

  updateDisputeNotes: (id: string, notes: string) =>
    apiClient.patch<Dispute>(`/disputes/${id}`, { notes }),

  declineDispute: (id: string, reason?: string) =>
    apiClient.post<Dispute>(`/disputes/${id}/decline`, { reason }).catch(() =>
      apiClient.post<Dispute>(`/disputes/${id}/resolve`, {
        action: "refund_to_brand",
        resolutionNotes: reason || "Dispute request declined by admin",
      }),
    ),
};
