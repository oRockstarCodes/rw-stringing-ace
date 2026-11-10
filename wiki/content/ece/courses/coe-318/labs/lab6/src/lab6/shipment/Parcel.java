
package lab6.shipment;

public class Parcel {
    protected final double weightKg;
    protected final double distanceKm;
    protected final boolean insured;

    public Parcel(double weightKg, double distanceKm, boolean insured) {
        if (weightKg <= 0 || distanceKm < 0) {
            throw new IllegalArgumentException("Weight must be > 0 and distance >= 0");
        }
        this.weightKg = weightKg;
        this.distanceKm = distanceKm;
        this.insured = insured;
    }

    public double shippingCost() {
        // Base: weight + distance, with small base fee
        double base = 3.50 + (weightKg * 1.20) + (distanceKm * 0.05);
        if (insured) base += Math.max(1.50, 0.02 * base);
        return base;
    }
}