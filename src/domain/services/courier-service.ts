import { CourierDTO, CreateCourierDTO, UpdateCourierDTO } from "../dtos/courier-dto";
import { CourierRepository } from "@/infrastructure/repositories/courier-repository";

export class CourierService {
  private repository: CourierRepository;
  
  constructor() {
    this.repository = new CourierRepository();
  }
  
  async getAllCouriers(): Promise<CourierDTO[]> {
    return this.repository.findAll();
  }
  
  async getCourierById(id: string): Promise<CourierDTO> {
    return this.repository.findById(id);
  }
  
  async createCourier(data: CreateCourierDTO): Promise<CourierDTO> {
    return this.repository.create(data);
  }
  
  async updateCourier(id: string, data: UpdateCourierDTO): Promise<CourierDTO> {
    return this.repository.update(id, data);
  }
  
  async deleteCourier(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
