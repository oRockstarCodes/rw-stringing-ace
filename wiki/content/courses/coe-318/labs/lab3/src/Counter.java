/**
 *
 * @author Your Name
 */
package coe318.lab3;
public class Counter {
    //Instance variables here
    private int m;
    private Counter l;
    private int d;
    public Counter(int modulus, Counter left) {
        m = modulus;
        l = left;
    }


    /**
     * @return the modulus
     */
    public int getModulus() {
        return m;
    }

    /**
     * Returns the Counter to the left attached to this
     * Counter.  Returns null if there is no Counter
     * to the left.
     * @return the left
     */
    public Counter getLeft() {
        return l;
    }

    /**
     * @return the digit
     */
    public int getDigit() {
        return d;
    }

    /**
     * @param digit the digit to set
     */
    public void setDigit(int digit) {
        d = digit;
    }

    /**
     * Increment this counter.  If it rolls over,
     * its left Counter is also incremented if it
     * exists.
     */
    public void increment() {
        d++;
        if (d==m){
            d = 0;
            if (l != null){
                l.increment();
            }
        }
    }

    /** Return the count of this Counter combined
     * with any Counter to its left.
     *
     * @return the count
     */
    public int getCount() {
        if (l == null){
            return d;
        }else{
           return d + m * l.getCount(); 
        }
        
    }

    /** Returns a String representation of the Counter's
     * total count (including its left neighbour).
     * @return the String representation
     */
    @Override
    public String toString() {
        //DO NOT MODIFY THIS CODE
        return "" + getCount();
    }

}
