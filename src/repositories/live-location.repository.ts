import {
  ILiveLocation,
  LiveLocationModel,
} from "../models/live-location.model.ts";

export class LiveLocationRepository {
  async create(data: Partial<ILiveLocation>) {
    const liveLocation = new LiveLocationModel(data);
    await liveLocation.save();
    return liveLocation;
  }

  async findByShareId(shareId: string) {
    return LiveLocationModel.findOne({ shareId });
  }

  async updateByShareId(shareId: string, data: Partial<ILiveLocation>) {
    return LiveLocationModel.findOneAndUpdate({ shareId }, data, {
      new: true,
    });
  }
}
