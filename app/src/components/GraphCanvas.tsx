import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { useStore } from '../lib/store'
import type { Node } from '../types'

// D3 types for force simulation
interface SimulationNode extends Node {
    x: number
    y: number
    vx?: number
    vy?: number
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
    source: SimulationNode
    target: SimulationNode
}

export function GraphCanvas() {
    const svgRef = useRef<SVGSVGElement>(null)
    const { nodes, links, selectNode, selectLink, valence } = useStore()

    // Calculate valence color based on overall score
    const getValenceColor = useCallback((linkId: string) => {
        const linkValence = valence[linkId]
        if (!linkValence) return '#999' // Default gray

        const avg = (linkValence.trust + linkValence.communication + linkValence.support +
                     linkValence.respect + linkValence.alignment) / 5

        if (avg > 2) return '#22c55e' // Strong positive (green)
        if (avg > 0) return '#78BE20' // Positive (ProActive green)
        if (avg === 0) return '#999' // Neutral (gray)
        if (avg > -2) return '#f59e0b' // Negative (orange)
        return '#ef4444' // Strong negative (red)
    }, [valence])

    useEffect(() => {
        if (!svgRef.current) return

        const width = 800
        const height = 600

        const svg = d3.select(svgRef.current)
            .attr('viewBox', [-width / 2, -height / 2, width, height])
            .style('font', '12px sans-serif')

        svg.selectAll('*').remove() // Clear previous render

        // Simulation setup - D3 mutates nodes/links at runtime, adding x/y coordinates
        const simulation = d3.forceSimulation<SimulationNode>(nodes as SimulationNode[])
            .force('link', d3.forceLink<SimulationNode, SimulationLink>(links as SimulationLink[])
                .id((d) => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-400))
            .force('x', d3.forceX())
            .force('y', d3.forceY())

        // Render lines (links)
        const link = svg.append('g')
            .attr('stroke-opacity', 0.8)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', (d) => {
                const source = typeof d.source === 'string' ? d.source : d.source.id
                const target = typeof d.target === 'string' ? d.target : d.target.id
                const linkId = `${source}-${target}`
                return getValenceColor(linkId)
            })
            .attr('stroke-width', 3)
            .on('click', (event, d) => {
                const sourceId = typeof d.source === 'object' ? d.source.id : d.source
                const targetId = typeof d.target === 'object' ? d.target.id : d.target
                selectLink(`${sourceId}-${targetId}`)
                event.stopPropagation()
            })

        // Render circles (nodes) - cast to SimulationNode for D3 drag compatibility
        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes as SimulationNode[])
            .join('circle')
            .attr('r', 20)
            .attr('fill', (d) => d.id === 'me' ? '#005696' : '#78BE20') // ProActive colors
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .call(drag(simulation) as any) // Type assertion needed for D3 v7 drag behavior compatibility
            .on('click', (event, d) => {
                selectNode(d.id)
                event.stopPropagation()
            })

        // Labels
        const label = svg.append('g')
            .selectAll('text')
            .data(nodes as SimulationNode[])
            .join('text')
            .attr('dy', 30)
            .attr('text-anchor', 'middle')
            .text((d) => d.name)
            .attr('fill', '#333')

        // Tick function - D3 guarantees x/y exist at runtime after simulation starts
        simulation.on('tick', () => {
            link
                .attr('x1', (d) => (typeof d.source === 'object' ? d.source.x ?? 0 : 0))
                .attr('y1', (d) => (typeof d.source === 'object' ? d.source.y ?? 0 : 0))
                .attr('x2', (d) => (typeof d.target === 'object' ? d.target.x ?? 0 : 0))
                .attr('y2', (d) => (typeof d.target === 'object' ? d.target.y ?? 0 : 0))

            node
                .attr('cx', (d) => (d as SimulationNode).x ?? 0)
                .attr('cy', (d) => (d as SimulationNode).y ?? 0)

            label
                .attr('x', (d) => (d as SimulationNode).x ?? 0)
                .attr('y', (d) => (d as SimulationNode).y ?? 0)
        })

        // Drag behavior
        function drag(simulation: d3.Simulation<SimulationNode, undefined>) {
            function dragstarted(event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>) {
                if (!event.active) simulation.alphaTarget(0.3).restart()
                event.subject.fx = event.subject.x
                event.subject.fy = event.subject.y
            }

            function dragged(event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>) {
                event.subject.fx = event.x
                event.subject.fy = event.y
            }

            function dragended(event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>) {
                if (!event.active) simulation.alphaTarget(0)
                event.subject.fx = null
                event.subject.fy = null
            }

            return d3.drag<SVGCircleElement, SimulationNode>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
        }

        return () => {
            simulation.stop()
        }
    }, [nodes, links, selectNode, selectLink, getValenceColor])

    return (
        <div className="w-full h-full bg-white border rounded-lg shadow-sm border-slate-200">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    )
}
