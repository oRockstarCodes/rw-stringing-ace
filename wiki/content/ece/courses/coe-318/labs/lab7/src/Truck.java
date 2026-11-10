
public class Truck  extends Vehicle {
    private double loadCapacityInTons;

    public Truck(String plateNumber, String model, int year, double loadCapacityInTons) {
      //TO DO
      super(plateNumber, model, year);
      this.loadCapacityInTons = loadCapacityInTons;
    }

    public double getLoadCapacityInTons() {
        return loadCapacityInTons;
    }

    @Override
    public String toString() {
        return "Truck: " + super.toString() +
               " [Capacity: " + loadCapacityInTons + " tons]";
    }

    @Override
    public double calculateRentalPrice(int days) {
        // TO DO  when a daily rate  starts at 90 dollars and increases by 10 dollars for each ton of load capacity.
        return days * (90.0 + 10.0*this.loadCapacityInTons);
    }

    @Override
    public double calculateInsurancePremium(int days) {
       // TO Do: the daily rate is the base insurance rate increased by 50 percent
       return super.getBaseInsuranceRate() * 1.5 * days;
    }

    public static void printVehicleType() {
        System.out.println("Truck");
    }
    
}
