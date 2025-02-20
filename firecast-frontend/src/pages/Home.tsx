import React from "react";
import Heatmap from "../components/Heatmap.component";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const Home: React.FC = () => {
  return (
    <section>
      <header>
        <h1>Call Demand Forecast</h1>
      </header>
      <main>
        <Button
          className="outline-2 outline-offset-2 outline-sky-500"
          style={{ outline: "1px solid red" }}
        >
          Hello world
        </Button>

        <Heatmap />
      </main>
    </section>
  );
};

export default Home;
