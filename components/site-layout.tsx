import Header from "@/components/header";
import Footer from "@/components/footer";
import RouteTransition from "@/components/route-transition";
import "@/app/anniversary.css";
import "@/app/guest-access.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <RouteTransition>{children}</RouteTransition>
      <Footer />
    </>
  );
}
