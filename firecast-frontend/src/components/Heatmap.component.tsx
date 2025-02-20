import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Slider } from "@/components/ui/slider";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Heatmap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [time, setTime] = useState<number>(0); // Current time (e.g., Unix timestamp)
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]); // Min and max time

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.486052, 37.830348],
      zoom: 4,
    });

    map.on("load", () => {
      map.addSource("earthquakes", {
        type: "geojson",
        data: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1`,
        generateId: true,
      });

      map.addLayer({
        id: "earthquakes-heat",
        type: "heatmap",
        source: "earthquakes",
        maxzoom: 9,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            6,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
        },
      });

      // Set initial time range (min and max time from the data)
      const features = map.getSource("data")._data.features;
      console.log("features check", features);

      const times = features.map((f) => new Date(f.properties.time).getTime());
      setTimeRange([Math.min(...times), Math.max(...times)]);
      setTime(Math.min(...times)); // Set initial time to the earliest time

      console.log("Time check", time);
    });

    setMap(map);

    return () => map.remove();
  }, []);

  console.log("Time check", time);

  // useEffect(() => {
  //   if (!map) return;

  //   // Update the heatmap layer filter based on the selected time
  //   map.setFilter("timeseries-heat", [
  //     "<=",
  //     ["to-number", ["get", "time"]],
  //     time,
  //   ]);
  // }, [time, map]);

  // const handleTimeChange = (value: number[]) => {
  //   setTime(value[0]); // shadcn Slider returns an array of values
  // };

  return (
    <section className="w-full h-screen">
      <div ref={mapContainer} style={{ width: "100%", height: "75vh" }} />
      <input
        type="range"
        min="1"
        max="100"
        step="1"
        defaultValue="50"
        className="slider"
      />
    </section>
  );
};

export default Heatmap;
