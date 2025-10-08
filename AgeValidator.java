class Distance {
    int feet, inches;

    Distance(int f, int i) {
        feet = f;
        inches = i;
    }

    Distance add(Distance d) {
        int totalInches = inches + d.inches;
        return new Distance(feet + d.feet + totalInches / 12, totalInches % 12);
    }

    void display() {
        System.out.println(feet + " feet " + inches + " inches");
    }

    public static void main(String[] args) {
        Distance d1 = new Distance(5, 8);
        Distance d2 = new Distance(3, 11);
        d1.add(d2).display();
    }
}






