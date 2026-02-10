/* eslint-disable */
"use client";
import { useRef, useEffect, useState  } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { csv } from "d3-fetch";


interface AnimalDatum  {
  name: string;
  speed: number;
  diet: string;
}

export default function AnimalSpeedGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  // Load CSV data
  useEffect(() => {
    csv("sample_animals.csv").then(rows => {
      const parsed: AnimalDatum[] = rows.map((row: any) => ({
        name: row["Animal"],
        speed: Number(row["Top Speed (km/h)"]),
        diet: row["Diet"]
      })).filter(d => d.name && d.speed > 0).slice(startIndex, startIndex+20);
      setAnimalData(parsed);
    });
  }, [startIndex]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
    }

    if (animalData.length === 0) return;

    // Set up chart dimensions and margins
    const containerWidth = graphRef.current?.clientWidth ?? 800;
    const containerHeight = graphRef.current?.clientHeight ?? 500;

    const width = Math.max(containerWidth, 600);
    const height = Math.max(containerHeight, 400);
    const margin = { top: 70, right: 140, bottom: 100, left: 80 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = select(graphRef.current!)
      .append<SVGSVGElement>("svg")
      .attr("width", width)
      .attr("height", height);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = scaleBand<string>()
      .domain(animalData.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    const maxSpeed = max(animalData, d => d.speed) ?? 100;

    // set up bar graph attributes
    const y = scaleLinear()
      .domain([0, maxSpeed])
      .range([innerHeight, 0])
      .nice();

    const color = scaleOrdinal<string, string>()
      .domain(["Herbivore", "Carnivore", "Omnivore"])
      .range(["#4CAF50", "#F44336", "#FF9800"]);
    
    const bars = chartGroup.selectAll("rect")
      .data(animalData)
      .join("rect")
      .attr("x", d => {
        const xPos = x(d.name);
        return xPos ?? 0;
      })
      .attr("y", d => {
        const yPos = y(d.speed);
        return yPos;
      })
      .attr("width", x.bandwidth())
      .attr("height", d => {
        const barHeight = innerHeight - y(d.speed);
        return barHeight;
      })
      .attr("fill", d => color(d.diet))
      .attr("stroke", "#333")
      .attr("stroke-width", 1);
    
    const xAxis = axisBottom(x);
    chartGroup.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em")
      .style("font-size", "7px");

    const yAxis = axisLeft(y);
    chartGroup.append("g")
      .call(yAxis)
      .style("font-size", "11px");
    
    svg.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Animal");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(margin.top + innerHeight / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Speed (km/h)");
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Animal Speed by Diet Type");
    
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    legend.append("text")
      .attr("x", 0)
      .attr("y", -10)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Diet Type");

    const diets = color.domain();

    // actually build bar graph
    legend.selectAll("g")
      .data(diets)
      .join("g")
      .attr("transform", (_, i) => `translate(0, ${i * 25})`)  // bar separations
      .each(function(d) {
        const g = select(this);
        
        g.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color(d))
          .attr("stroke", "#333")
          .attr("stroke-width", 1);

        g.append("text")
          .attr("x", 22)
          .attr("y", 12)
          .style("font-size", "13px")
          .text(d);
      });

  }, [animalData]);

  return (
    <div>
      <div
        ref={graphRef}
        style={{ width: "100%", height: "600px", backgroundColor: "#f5f5f5" }}
      />
      <div className="flex gap-2 justify-center" >
        <button
            type="button"
            onClick={() => setStartIndex(Math.max(0, startIndex - 20))
            }
            style={{ padding: "10px 100px" }}
            className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90"
          >
            Back
          </button>
      <button
            type="button"
            onClick={() => setStartIndex(Math.min(120, startIndex + 20))}
            style={{ padding: "10px 100px"}}
            className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90"
          >
            Forward
          </button>
    </div>

    </div>
    
  );
}