import React from "react";
import Heatmap from "../components/Heatmap";

const Home: React.FC = () => {
  return (
    <section>
      <header>
        <h1>Call Demand Forecast</h1>
      </header>
      <main>
        <Heatmap />
      </main>
    </section>
  );
};

export default Home;
