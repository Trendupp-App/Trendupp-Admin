export interface ActivityTimelineEvent {
  id: string;
  actorType: "Brand" | "Creator" | "Admin" | "System" | string;
  timestamp: string;
  formattedTime: string;
  description: string;
}

export interface ActivityTimelineResponse {
  campaignId: string;
  totalEvents: number;
  activities: ActivityTimelineEvent[];
}
