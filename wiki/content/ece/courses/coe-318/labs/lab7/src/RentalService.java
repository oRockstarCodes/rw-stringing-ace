
public class RentalService {
    public static void log(String message) {
        System.out.println("[INFO] " + message);
    }

    public static void log(String message, int severity) {
        System.out.println("[SEVERITY " + severity + "] " + message);
    }


    public void processRental(Rentable rentable, int days) {
        log("Processing rental for " + rentable.getClass().getSimpleName());
        rentable.startRental();
        double price = rentable.calculateRentalPrice(days);
        System.out.println("Base rental price for " + days + " days: " + price);
        rentable.endRental();
        System.out.println();
    }

    public static void main(String[] args) {
        
        
        Car honda21 = new Car("XYZ-456", "Honda Civic", 2021, false);
        double priceNoGps = honda21.calculateRentalPrice(3);
        double priceWithGps = honda21.calculateRentalPrice(3, true);
        System.out.println("Car price without GPS: " + priceNoGps);
        System.out.println("Car price with GPS: " + priceWithGps);
        
        
        Rentable car = new Car("ABC-123", "Toyota Corolla", 2020, true);
        Rentable truck = new Truck("TRK-999", "Volvo FH", 2019, 12.0);
        Rentable luxuryCar = new Car("LUX-777", "BMW 7 Series", 2023, true);

        RentalService service = new RentalService();

      
        service.processRental(car, 3);
        service.processRental(truck, 2);
        service.processRental(luxuryCar, 1);
        service.processRental(honda21, 1);

  
        RentalContract contract1 = new RentalContract(car, 4, true);
        contract1.printSummary();

        RentalContract contract2 = new RentalContract(luxuryCar, 2, true);
        contract2.printSummary();

        
      

   
        Vehicle.printVehicleType(); 
        Car.printVehicleType();     
        Truck.printVehicleType();   
  

        honda21.printPlate();
    }
    
}
