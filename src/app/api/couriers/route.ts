import { NextRequest, NextResponse } from "next/server";
import { CourierService } from "@/domain/services/courier-service";
import { CreateCourierDTO, CourierResponseDTO } from "@/domain/dtos/courier-dto";
import { HttpError } from "@/infrastructure/errors/http-error";

export async function GET(): Promise<NextResponse<CourierResponseDTO>> {
  try {
    const courierService = new CourierService();
    const couriers = await courierService.getAllCouriers();
    
    return NextResponse.json({ couriers, success: true });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching couriers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CourierResponseDTO>> {
  try {
    const body = await request.json() as CreateCourierDTO;
    
    const courierService = new CourierService();
    const courier = await courierService.createCourier(body);
    
    return NextResponse.json({ 
      success: true, 
      courierId: courier.id,
      courier 
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "An error occurred while creating courier" },
      { status: 500 }
    );
  }
}
