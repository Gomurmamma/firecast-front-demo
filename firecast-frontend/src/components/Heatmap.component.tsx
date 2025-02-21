import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useSWR from "swr";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Define a fetcher function
const fetcher = (url) => fetch(url).then((res) => res.json());

const Heatmap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [time, setTime] = useState<number>(0); // Current time (e.g., Unix timestamp)
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]); // Min and max time

  // Use the useSWR hook to fetch data
  const { data, error } = useSWR(
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1",
    fetcher,
    {
      onSuccess: (data) => {
        const times = data.features.map((f) =>
          new Date(f.properties.time).getTime()
        );
        setTimeRange([Math.min(...times), Math.max(...times)]);
        setTime(Math.min(...times));
      },
    }
  );

  // Render the Map
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
        data: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1",
        generateId: true,
      });

      // Layer styles can change
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

      setMap(map);
    });

    return () => map.remove();
  }, []);

  // Update the heatmap layer filter when `time` changes
  useEffect(() => {
    if (!map) return;

    // const endTime = now + 24 * 60 * 60 * 1000; // 24 hours from now
    const endTime = time + 3 * 24 * 60 * 60 * 1000; // 3 days later

    map.setFilter("earthquakes-heat", [
      "all",
      [">=", ["to-number", ["get", "time"]], time],
      ["<=", ["to-number", ["get", "time"]], endTime],
    ]);
  }, [map, time]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(Number(event.target.value));
  };

  return (
    <section className="w-full h-screen">
      <div ref={mapContainer} style={{ width: "100%", height: "75vh" }} />
      <div>{time ? new Date(time).toLocaleString() : "no time data"}</div>
      <input
        type="range"
        min={timeRange[0] || 0}
        max={timeRange[1] || 0}
        step={1000 * 60 * 60 * 24} // Step by day
        value={time}
        onChange={handleTimeChange}
        className="slider"
      />
    </section>
  );
};

export default Heatmap;
