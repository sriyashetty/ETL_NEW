import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BankPieChart({ data }) {
    const ref = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const container = ref.current;
        d3.select(container).selectAll("*").remove();

        // 1. DATA PROCESSING
        const keys = Object.keys(data[0]);
        const labelKey = keys.find(k => isNaN(Number(data[0][k])));
        const valueKey = keys.find(k => !isNaN(Number(data[0][k])));
        if (!labelKey || !valueKey) return;

        const chartData = data.map(d => ({
            label: d[labelKey],
            value: Number(d[valueKey])
        }));

        const totalValue = d3.sum(chartData, d => d.value);

        // 2. DIMENSIONS
        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height);
        const radius = size / 2.2;

        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("font-family", "'Inter', sans-serif");

        // Tooltip container
        const tooltip = d3.select(container)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(15, 23, 42, 0.95)")
            .style("color", "#fff")
            .style("padding", "10px 14px")
            .style("border-radius", "6px")
            .style("font-size", "13px")
            .style("pointer-events", "none")
            .style("box-shadow", "0 10px 15px -3px rgba(0,0,0,0.1)")
            .style("z-index", "100");

        // Professional Color Palette
        const color = d3.scaleOrdinal()
            .range(["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#06b6d4"]);

        // Classic Pie Logic (innerRadius is 0)
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0) // Solid Pie Chart
            .outerRadius(radius);

        // Hover effect expansion
        const arcHover = d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 10);

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2.5}, ${height / 2})`);

        // 3. DRAW SLICES
        const slices = g.selectAll("path")
            .data(pie(chartData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.label))
            .attr("stroke", "#fff")
            .attr("stroke-width", "2px")
            .style("cursor", "pointer")
            .style("transition", "all 0.2s ease");

        // 4. INTERACTION LOGIC
        slices
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("d", arcHover)
                    .attr("opacity", 0.9);

                tooltip.style("visibility", "visible").html(`
                    <div style="font-weight: bold; border-bottom: 1px solid #475569; margin-bottom: 4px; padding-bottom: 2px;">
                        ${d.data.label}
                    </div>
                    <div style="color: #cbd5e1">Amount: <span style="color: #fff">${d3.format(",")(d.data.value)}</span></div>
                    <div style="color: #cbd5e1">Share: <span style="color: #fff">${d3.format(".1%")(d.data.value / totalValue)}</span></div>
                `);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", (event.pageY - 60) + "px")
                    .style("left", (event.pageX + 20) + "px");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("d", arc)
                    .attr("opacity", 1);
                tooltip.style("visibility", "hidden");
            });

        // 5. LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(${width * 0.72}, ${height / 4})`);

        chartData.forEach((d, i) => {
            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 28})`);

            row.append("rect")
                .attr("width", 14)
                .attr("height", 14)
                .attr("rx", 3)
                .attr("fill", color(d.label));

            row.append("text")
                .attr("x", 24)
                .attr("y", 12)
                .style("font-size", "14px")
                .style("fill", "#334155")
                .style("font-weight", "500")
                .text(d.label);
        });

    }, [data]);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
            <div ref={ref} style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
}
