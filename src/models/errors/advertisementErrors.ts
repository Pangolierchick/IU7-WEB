export class AdvertisementNotFound extends Error {
  constructor(adId?: string) {
    super(`Ad ${adId ?? ""} not found`);
    this.name = "AdvertisementNotFound";
  }
}

export class RentDateError extends Error {
  constructor() {
    super("Date can't be less than todays date");
    this.name = "RentDateError";
  }
}

export class OwnerRentError extends Error {
  constructor() {
    super("Owner cant rent own advertisement");
    this.name = "OwnerRentError";
  }
}

export class AdvertisementNotApprovedError extends Error {
  constructor(adId?: string) {
    super(`Ad ${adId ?? ""} is not approved`);
    this.name = "AdvertisementNotApprovedError";
  }
}

export class AdvertisementAlreadyBooked extends Error {
  constructor() {
    super("Advertisement has already been booked for these dates");
    this.name = "RentAlreadyBooked";
  }
}

export class DeleteAdvertisementRightsError extends Error {
  constructor(userId?: string) {
    super(
      `User ${userId ?? ""} neither admin nor owner to delete advertisement`
    );
    this.name = "DeleteAdvertisementRightsError";
  }
}

export class UpdateAdvertisementRightsError extends Error {
  constructor(userId?: string) {
    super(
      `User ${userId ?? ""} neither admin nor owner to Update advertisement`
    );
    this.name = "UpdateAdvertisementRightsError";
  }
}

export class AdvertisementRightsError extends Error {
  constructor(userId?: string) {
    super(`User ${userId ?? ""} must be admin or owner to do that operation.`);
    this.name = "AdvertisementRightError";
  }
}
