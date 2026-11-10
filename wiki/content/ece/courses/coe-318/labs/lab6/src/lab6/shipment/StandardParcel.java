
package lab6.shipment;


class StandardParcel extends Parcel {
    // sizeTier: S/M/L affects handling
    protected final String sizeTier;

    public StandardParcel(double weightKg, double distanceKm, boolean insured, String sizeTier) {
        super(weightKg, distanceKm, insured);
        if (!sizeTier.matches("[SML]")) {
            throw new IllegalArgumentException("sizeTier must be S, M, or L");
        }
        this.sizeTier = sizeTier;
    }

    @Override
    public double shippingCost() {
        double cost = super.shippingCost();
        double handling= 0;
        //TO DO
        //Write lines of codes that calculates handeling based on sizeTier
        if (sizeTier.equals("S")) {
            handling = 0.75;
        } else if (sizeTier.equals("M")) {
            handling = 1.25;
        } else if (sizeTier.equals("L")) {
            handling = 1.75;
        }
        return cost + handling;
    }

}
