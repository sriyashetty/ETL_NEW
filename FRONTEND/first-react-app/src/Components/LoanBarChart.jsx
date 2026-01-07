import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LoanBarChart({ data }) {
    const ref = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Clear previous chart
        d3.select(ref.current).selectAll("*").remove();

        // 1. DATA PROCESSING
        const keys = Object.keys(data[0]);
        const xKey = keys.find(k => isNaN(Number(data[0][k])));
        const yKey = keys.find(k => !isNaN(Number(data[0][k])));

        if (!xKey || !yKey) return;

        const normalizedData = data.map(d => ({
            label: d[xKey],
            value: Number(d[yKey])
        }));

        // 2. DIMENSIONS & SCALES
        const width = 800;
        const height = 450;
        const margin = { top: 40, right: 30, bottom: 60, left: 70 };

        const svg = d3
            .select(ref.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%")
            .style("height", "100%")
            .style("font-family", "'Inter', sans-serif");

        // Tooltip container
        const tooltip = d3.select(ref.current)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(15, 23, 42, 0.9)")
            .style("color", "#fff")
            .style("padding", "8px 12px")
            .style("border-radius", "6px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("box-shadow", "0 4px 6px -1px rgb(0 0 0 / 0.1)");

        const x = d3.scaleBand()
            .domain(normalizedData.map(d => d.label))
            .range([margin.left, width - margin.right])
            .padding(0.35);

        const y = d3.scaleLinear()
            .domain([0, d3.max(normalizedData, d => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // 3. AXES STYLING
        // X Axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0))
            .call(g => g.select(".domain").remove()) // Remove axis line for clean look
            .selectAll("text")
            .style("color", "#64748b")
            .style("font-size", "12px")
            .attr("dy", "1.5em");

        // Y Axis Gridlines (Production touch)
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-width + margin.left + margin.right)
                .tickFormat(d3.format(".2s")))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .attr("stroke", "#f1f5f9") // Very light grid lines
                .attr("stroke-dasharray", "4,4"))
            .selectAll("text")
            .style("color", "#64748b")
            .style("font-size", "12px");

        // 4. BARS WITH GRADIENT & ROUNDED CORNERS
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6");
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb");

        svg.selectAll("rect")
            .data(normalizedData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.label))
            .attr("width", x.bandwidth())
            .attr("fill", "url(#bar-gradient)")
            .attr("rx", 6) // Rounded corners
            // ANIMATION START
            .attr("y", height - margin.bottom)
            .attr("height", 0)
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr("fill", "#1d4ed8");
                tooltip.style("visibility", "visible").html(`
                    <div style="font-weight: 600">${d.label}</div>
                    <div style="color: #93c5fd">Value: ${d3.format(",")(d.value)}</div>
                `);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", (event.pageY - 40) + "px")
                    .style("left", (event.pageX + 15) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).transition().duration(200).attr("fill", "url(#bar-gradient)");
                tooltip.style("visibility", "hidden");
            })
            // ANIMATION END
            .transition()
            .duration(1000)
            .delay((d, i) => i * 50)
            .ease(d3.easeElasticOut.amplitude(1.0))
            .attr("y", d => y(d.value))
            .attr("height", d => height - margin.bottom - y(d.value));

    }, [data]);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div ref={ref} style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
}