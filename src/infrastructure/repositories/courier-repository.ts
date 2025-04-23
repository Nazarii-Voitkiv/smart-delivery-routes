import { CourierDTO, CreateCourierDTO, UpdateCourierDTO } from "@/domain/dtos/courier-dto";
import { HttpError } from "../errors/http-error";

export class CourierRepository {
  // This would be replaced with actual database access
  private couriers: CourierDTO[] = [];
  
  async findAll(): Promise<CourierDTO[]> {
    // In real app, fetch from database
    return this.couriers;
  }
  
  async findById(id: string): Promise<CourierDTO> {
    const courier = this.couriers.find(c => c.id === id);
    
    if (!courier) {
      throw new HttpError(404, `Courier with ID ${id} not found`);
    }
    
    return courier;
  }
  
  async create(data: CreateCourierDTO): Promise<CourierDTO> {
    const now = new Date().toISOString();
    
    const newCourier: CourierDTO = {
      id: `courier-${Date.now()}`,
      ...data,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };
    
    this.couriers.push(newCourier);
    
    return newCourier;
  }
  
  async update(id: string, data: UpdateCourierDTO): Promise<CourierDTO> {
    const index = this.couriers.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new HttpError(404, `Courier with ID ${id} not found`);
    }
    
    const updatedCourier = {
      ...this.couriers[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.couriers[index] = updatedCourier;
    
    return updatedCourier;
  }
  
  async delete(id: string): Promise<void> {
    const index = this.couriers.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new HttpError(404, `Courier with ID ${id} not found`);
    }
    
    this.couriers.splice(index, 1);
  }
}
