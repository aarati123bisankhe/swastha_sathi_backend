import z from "zod";

export const StartLiveLocationDto = z.object({
  userId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().min(1),
});

export type StartLiveLocationDto = z.infer<typeof StartLiveLocationDto>; //dto for starting live location sharing

export const UpdateLiveLocationDto = z.object({
  shareId: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().min(1),
});

export type UpdateLiveLocationDto = z.infer<typeof UpdateLiveLocationDto>;

export const StopLiveLocationDto = z.object({
  shareId: z.string().trim().min(1),
});

export type StopLiveLocationDto = z.infer<typeof StopLiveLocationDto>;


export const ShareLiveLocationContactDto = z.object({
  userId: z.string().trim().min(1),
  shareId: z.string().trim().min(1),
  trackingLink: z.string().trim().url(),
  message: z.string().trim().min(1),
});

export type ShareLiveLocationContactDto = z.infer<
  typeof ShareLiveLocationContactDto
>;
