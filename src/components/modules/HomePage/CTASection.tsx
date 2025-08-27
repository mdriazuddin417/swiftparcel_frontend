import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const CTASection = () => {
    return (
         <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Ship Your Parcel?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of satisfied customers who trust SwiftParcel for their delivery needs.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Start Shipping Today</Link>
          </Button>
        </div>
      </section>
    );
};

export default CTASection;