import { randomUUID } from "crypto";

import {
  ShareLiveLocationContactDto,
  StartLiveLocationDto,
  StopLiveLocationDto,
  UpdateLiveLocationDto,
} from "../dtos/location.dtos.ts";
import { HttpError } from "../errors/http-error.ts";
import { LiveLocationRepository } from "../repositories/live-location.repository.ts";

const liveLocationRepository = new LiveLocationRepository();

export class LiveLocationService {
  async startSharing(
    payload: StartLiveLocationDto,
    trackingLinkBuilder: (shareId: string) => string
  ) {
    const shareId = randomUUID();
    const startedAt = new Date();
    const trackingLink = trackingLinkBuilder(shareId);

    const liveLocation = await liveLocationRepository.create({
      ...payload,
      shareId,
      trackingLink,
      status: "active",
      startedAt,
    });

    return {
      shareId: liveLocation.shareId,
      trackingLink: liveLocation.trackingLink,
      status: liveLocation.status,
    };
  }

  async updateSharing(payload: UpdateLiveLocationDto) {
    const existing = await liveLocationRepository.findByShareId(payload.shareId);

    if (!existing) {
      throw new HttpError(404, "Live location sharing session not found.");
    }

    if (existing.status !== "active") {
      throw new HttpError(400, "Location sharing has been stopped.");
    }

    await liveLocationRepository.updateByShareId(payload.shareId, {
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
    });

    return {
      shareId: payload.shareId,
      status: "active",
      updatedAt: new Date(),
    };
  }

  async stopSharing(payload: StopLiveLocationDto) {
    const existing = await liveLocationRepository.findByShareId(payload.shareId);

    if (!existing) {
      throw new HttpError(404, "Live location sharing session not found.");
    }

    const stoppedAt = new Date();
    const updated = await liveLocationRepository.updateByShareId(payload.shareId, {
      status: "inactive",
      stoppedAt,
    });

    return {
      shareId: payload.shareId,
      status: updated?.status ?? "inactive",
      stoppedAt,
    };
  }

  async getLiveLocation(shareId: string) {
    const existing = await liveLocationRepository.findByShareId(shareId);

    if (!existing) {
      throw new HttpError(404, "Live location sharing session not found.");
    }

    if (existing.status === "inactive") {
      return {
        message: "Location sharing has been stopped.",
        status: "inactive" as const,
        name: existing.name,
        latitude: existing.latitude,
        longitude: existing.longitude,
        address: existing.address,
        updatedAt: existing.updatedAt,
      };
    }

    return {
      name: existing.name,
      latitude: existing.latitude,
      longitude: existing.longitude,
      address: existing.address,
      status: existing.status,
      updatedAt: existing.updatedAt,
    };
  }

  async shareWithEmergencyContacts(payload: ShareLiveLocationContactDto) {
    const existing = await liveLocationRepository.findByShareId(payload.shareId);

    if (!existing) {
      throw new HttpError(404, "Live location sharing session not found.");
    }

    return {
      status: "sent",
      shareId: payload.shareId,
      trackingLink: payload.trackingLink,
      message: payload.message,
    };
  }
}
