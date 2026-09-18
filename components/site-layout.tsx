import Header from "@/components/header";
import Footer from "@/components/footer";
import "@/app/anniversary.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
