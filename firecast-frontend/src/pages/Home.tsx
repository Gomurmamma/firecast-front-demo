import React from "react";
import Heatmap from "../components/Heatmap.component";
import NavbarHeader from "@/components/NavbarHeader.component";
import NavbarLinks from "@/components/NavbarLinks.component";

const Home: React.FC = () => {
  return (
    <section>
      <header>
        <NavbarHeader />
      </header>
      <main>{/* <Heatmap /> */}</main>
      <NavbarLinks />
    </section>
  );
};

export default Home;
