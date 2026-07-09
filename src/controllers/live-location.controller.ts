import { Request, Response } from "express";
import z from "zod";

import {
  ShareLiveLocationContactDto,
  StartLiveLocationDto,
  StopLiveLocationDto,
  UpdateLiveLocationDto,
} from "../dtos/location.dtos.ts";
import { LiveLocationService } from "../services/live-location.service.ts"; //live location service

const liveLocationService = new LiveLocationService();

export class LiveLocationController {
  async start(req: Request, res: Response) {
    try {
      const parsedData = StartLiveLocationDto.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const data = await liveLocationService.startSharing(
        parsedData.data,
        (shareId) => `${req.protocol}://${req.get("host")}/api/location/live/${shareId}`
      );

      return res.status(201).json({ success: true, data });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsedData = UpdateLiveLocationDto.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const data = await liveLocationService.updateSharing(parsedData.data);

      return res.status(200).json({ success: true, data });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async stop(req: Request, res: Response) {
    try {
      const parsedData = StopLiveLocationDto.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const data = await liveLocationService.stopSharing(parsedData.data);

      return res.status(200).json({ success: true, data });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getLiveLocation(req: Request, res: Response) {
    try {
      const shareId = Array.isArray(req.params.shareId)
        ? req.params.shareId[0]
        : req.params.shareId;
      const data = await liveLocationService.getLiveLocation(shareId);
      const acceptHeader = req.get("accept") ?? "";

      if (acceptHeader.includes("text/html")) {
        return res.status(200).send(buildTrackingPage(data));
      }

      return res.status(200).json({ success: true, data });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async shareWithContacts(req: Request, res: Response) {
    try {
      const parsedData = ShareLiveLocationContactDto.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const data = await liveLocationService.shareWithEmergencyContacts(
        parsedData.data
      );

      return res.status(200).json({ success: true, data });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

function buildTrackingPage(
  data:
    | {
        message: string;
        status: "inactive";
        name: string;
        latitude: number;
        longitude: number;
        address: string;
        updatedAt: Date;
      }
    | {
        name: string;
        latitude: number;
        longitude: number;
        address: string;
        status: "active";
        updatedAt: Date;
      }
) {
  const title =
    data.status === "inactive"
      ? "Location sharing has been stopped."
      : `${data.name}'s live location`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
  const updatedAt = new Date(data.updatedAt).toLocaleString();
  const inactiveMessage =
    data.status === "inactive"
      ? `<p style="color:#b42318;font-weight:700;">Location sharing has been stopped.</p>`
      : `<script>setTimeout(() => window.location.reload(), 15000);</script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f7fafc; color:#1f2937; padding:24px; }
    .card { max-width:560px; margin:0 auto; background:#fff; border-radius:16px; padding:24px; box-shadow:0 12px 30px rgba(15,23,42,0.08); }
    h1 { font-size:24px; margin:0 0 12px; }
    p { margin:8px 0; line-height:1.5; }
    a { color:#0f6cbd; text-decoration:none; font-weight:700; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Latitude:</strong> ${data.latitude}</p>
    <p><strong>Longitude:</strong> ${data.longitude}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <p><strong>Status:</strong> ${data.status}</p>
    <p><strong>Last updated:</strong> ${updatedAt}</p>
    <p><a href="${mapsLink}" target="_blank" rel="noreferrer">Open in Google Maps</a></p>
    ${inactiveMessage}
  </div>
</body>
</html>`;
}
