 
import AboutUs from "@/components/AboutUs";
import AddPhoto from "@/components/AddPhoto";
import Benner from "@/components/Benner";
import ContactUs from "@/components/ContactUs";
import FaQpage from "@/components/FaQpage";
import PopularRent from "@/components/PopularRent";
import PopularSell from "@/components/PopularSell";
 

export default function Home() {
  return (
    <div>
           <Benner />  
           <AddPhoto />
           <PopularSell />
           <PopularRent />
           <AboutUs />
           <FaQpage />
           <ContactUs />
    </div>
  );
}
