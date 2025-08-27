

export enum DeliveryStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE",
}


export interface IDeliveryPerson {
  _id?: string
  name?: string
  location?: string
  status?: DeliveryStatus
  phone?: string
  email?: string
  assignedParcels?: number
  totalDeliveries?: number
  rating?: number,
  address?: string
}

