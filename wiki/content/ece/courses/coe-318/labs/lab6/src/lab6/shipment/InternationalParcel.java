
package lab6.shipment;


public class InternationalParcel extends Parcel {
       private final String region;      // e.g., "EU", "APAC", "NA"
    private final double customsRate; // 0.0 - 0.25 (percentage of base as duties)

    public InternationalParcel(double weightKg, double distanceKm, boolean insured,
                               String region, double customsRate) {
        super(weightKg, distanceKm, insured);
        if (customsRate < 0 || customsRate > 0.25) {
            throw new IllegalArgumentException("customsRate must be between 0.0 and 0.25");
        }
        this.region = region;
        this.customsRate = customsRate;
    }

    @Override
    public double shippingCost() {
       //TO DO  complete this part
       double base = super.shippingCost();
       double crossBorderFee = 8.00;
       double customsDuty = customsRate * base;
       return base + crossBorderFee + customsDuty;
    }
    
}
