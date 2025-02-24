import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useSWR from "swr";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Define a fetcher function
const fetcher = (url) => fetch(url).then((res) => res.json());

// Custom useInterval hook
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Heatmap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [time, setTime] = useState<number>(0); // Current time (e.g., Unix timestamp)
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]); // Min and max time
  const [tempInt, setTempInt] = useState<number>(30); // minutes
  const [updateInterval, setUpdateInterval] = useState<number>(30); // 30 minutes

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

  // Use the custom useInterval hook to re-fetch data periodically
  useInterval(() => {
    mutate();
  }, updateInterval);

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

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempInt(Number(event.target.value));
  };

  const submitIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("");
    setTempInt(Number(tempInt));
    setUpdateInterval(Number(tempInt));
  };

  return (
    <section className="w-full h-screen">
      <div ref={mapContainer} style={{ width: "100%", height: "75vh" }} />
      {/*
      For debugging only 
      <div>{time ? new Date(time).toLocaleString() : "no time data"}</div> 
      */}
      <input
        type="range"
        min={timeRange[0] || 0}
        max={timeRange[1] || 0}
        step={1000 * 60 * 60 * 24} // Step by day
        value={time}
        onChange={handleTimeChange}
        className="slider"
      />
      <article>
        <label htmlFor="refreshInt">
          Current Refresh Rate: {updateInterval} min.
        </label>
        <p>Minimum time is 1 minute</p>
        <Input
          type="number"
          id="refreshInt"
          value={tempInt}
          onChange={handleIntervalChange}
          min="1" // Should probably be the min time it takes to train the model
        />
        <Button onClick={submitIntervalChange}>Update</Button>
      </article>
    </section>
  );
};

export default Heatmap;
