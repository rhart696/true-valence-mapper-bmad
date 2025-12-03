import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useStore } from '../lib/store'


export function GraphCanvas() {
    const svgRef = useRef<SVGSVGElement>(null)
    const { nodes, links, selectNode, selectLink, valence } = useStore()

    // Calculate valence color based on overall score
    const getValenceColor = (linkId: string) => {
        const linkValence = valence[linkId]
        if (!linkValence) return '#999' // Default gray

        const avg = (linkValence.trust + linkValence.communication + linkValence.support +
                     linkValence.respect + linkValence.alignment) / 5

        if (avg > 2) return '#22c55e' // Strong positive (green)
        if (avg > 0) return '#78BE20' // Positive (ProActive green)
        if (avg === 0) return '#999' // Neutral (gray)
        if (avg > -2) return '#f59e0b' // Negative (orange)
        return '#ef4444' // Strong negative (red)
    }

    useEffect(() => {
        if (!svgRef.current) return

        const width = 800
        const height = 600

        const svg = d3.select(svgRef.current)
            .attr('viewBox', [-width / 2, -height / 2, width, height])
            .style('font', '12px sans-serif')

        svg.selectAll('*').remove() // Clear previous render

        // Simulation setup
        const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-400))
            .force('x', d3.forceX())
            .force('y', d3.forceY())

        // Render lines (links)
        const link = svg.append('g')
            .attr('stroke-opacity', 0.8)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', (d: any) => {
                const linkId = `${typeof d.source === 'string' ? d.source : d.source.id}-${typeof d.target === 'string' ? d.target : d.target.id}`
                return getValenceColor(linkId)
            })
            .attr('stroke-width', 3)
            .on('click', (event: any, d: any) => {
                selectLink(`${d.source.id}-${d.target.id}`)
                event.stopPropagation()
            })

        // Render circles (nodes)
        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 20)
            .attr('fill', (d) => d.id === 'me' ? '#005696' : '#78BE20') // ProActive colors
            .call(drag(simulation) as any)
            .on('click', (event: any, d: any) => {
                selectNode(d.id)
                event.stopPropagation()
            })

        // Labels
        const label = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .attr('dy', 30)
            .attr('text-anchor', 'middle')
            .text((d) => d.name)
            .attr('fill', '#333')

        // Tick function
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y)

            node
                .attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y)

            label
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y)
        })

        // Drag behavior
        function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart()
                event.subject.fx = event.subject.x
                event.subject.fy = event.subject.y
            }

            function dragged(event: any) {
                event.subject.fx = event.x
                event.subject.fy = event.y
            }

            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0)
                event.subject.fx = null
                event.subject.fy = null
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
        }

        return () => {
            simulation.stop()
        }
    }, [nodes, links, selectNode, selectLink, valence])

    return (
        <div className="w-full h-full bg-white border rounded-lg shadow-sm border-slate-200">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    )
}
