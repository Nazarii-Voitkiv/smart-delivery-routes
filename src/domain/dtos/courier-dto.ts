export interface CourierDTO {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  status: CourierStatus;
  maxCapacity: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type CourierStatus = 'active' | 'inactive' | 'on_delivery';

export interface CreateCourierDTO {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  maxCapacity: number;
}

export interface UpdateCourierDTO extends Partial<CreateCourierDTO> {
  status?: CourierStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface CourierResponseDTO {
  success: boolean;
  message?: string;
  courierId?: string;
  courier?: CourierDTO;
  couriers?: CourierDTO[];
}
