import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Clock, Globe, Package, Shield, Truck, Users } from 'lucide-react';
const FeaturesSection = () => {
    return (
          <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose SwiftParcel?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive delivery solutions with cutting-edge technology and exceptional customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>Same-day and express delivery options available for urgent shipments.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Secure & Safe</CardTitle>
                <CardDescription>
                  Your parcels are protected with comprehensive insurance and secure handling.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Track your parcels in real-time with detailed status updates and notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Wide Coverage</CardTitle>
                <CardDescription>Nationwide delivery network with international shipping capabilities.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>Round-the-clock customer support to assist you with any queries.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Easy Management</CardTitle>
                <CardDescription>User-friendly dashboard to manage all your shipments in one place.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

    );
};

export default FeaturesSection;