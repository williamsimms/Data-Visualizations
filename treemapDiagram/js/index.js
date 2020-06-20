let tooltip = document.getElementById('tooltip')
let width = 960
let height = 600

const videoGameData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

async function Tree() {
    const videoGame = await d3.json(videoGameData)

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'graph')

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1)

    const root = d3.hierarchy(videoGame)
        .sum((d) => {
            return d.value
        })

    treemap(root)

    let cell = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

    let tile = cell.append('rect')
        .attr('class', 'tile')
        .attr('width', (d) => {
            return d.x1 - d.x0
        })
        .attr('height', (d) => {
            return d.y1 - d.y0
        })
        .attr('fill', (d) => {
            return colorScale(d.data.category)
        })
        .on('mouseover', (d, i) => {
            const {
                name,
                category,
                value
            } = d.data;
            tooltip.classList.add('show');
            tooltip.style.left = (d3.event.pageX - 300) + 'px';
            tooltip.style.top = (d3.event.pageY - 300) + 'px'
            tooltip.innerHTML = `<p>${name}</p>
               <p>${category}</p>
              <p>${value}</p> `
        }).on('mouseout', () => {
            tooltip.classList.remove('show')
        });

    cell.append('text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append('tspan')
        .attr('style', 'font-size: 13px')
        .attr('x', 4)
        .attr('y', (d, i) => 15 + i * 15)
        .text(d => d)

    const categories = root.leaves().map(n => n.data.category).filter((item, idx, arr) => arr.indexOf(item) === idx);

    const blockSize = 20;
    const legendWidth = 200;
    const legendHeight = (blockSize + 2) * categories.length;

    const legend = d3.select('.container')
        .append('svg')
        .attr('class', 'legend')
        .attr('width', legendWidth)
        .attr('height', legendHeight)

    legend.selectAll('rect')
        .data(categories)
        .enter()
        .append('rect')
        .attr('fill', d => colorScale(d))
        .attr('x', blockSize / 2)
        .attr('y', (d, i) => i * (blockSize + 1) + 10)
        .attr('width', blockSize)
        .attr('height', blockSize)

    legend.append('g')
        .selectAll('text')
        .data(categories)
        .enter()
        .append('text')
        .attr('fill', 'black')
        .attr('x', blockSize * 2)
        .attr('y', (d, i) => i * (blockSize + 1) + 25)
        .text(d => d)
}


Tree()