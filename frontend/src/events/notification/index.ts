import { EmitterEvent } from "@/emitter";

export declare type NotificationType = "success" | "failure";
export interface NotificationConfig {
  type: NotificationType;
  content: string;
  visible: boolean;
  timeout?: number;
}

export const NOTIFICATION_UPDATE_EVENT_NAME = "botification:update";
export interface NotificationUpdateEvent extends EmitterEvent<NotificationConfig> {}
