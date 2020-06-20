let tooltip = document.getElementById('tooltip')
let height = 400
let width = 800
let barWidth = width / 275
let margin = {
    top: 50,
    left: 100,
    right: 20,
    bottom: 50
}
const padding = 40;

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then((data) => {
    let chartData = data.data

    let minDate = chartData[0][0].substr(0, 4)
    minDate = new Date(minDate)
    let maxDate = chartData[chartData.length - 1][0].substr(0, 4)
    maxDate = new Date(maxDate)

    let xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width])

    let yMax = d3.max(chartData, (d) => {
        return d[1]
    })
    let yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0])

    let xAxis = d3.axisBottom()
        .scale(xScale)
    let yAxis = d3.axisLeft()
        .scale(yScale)

    let svg = d3.select('.container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'graph')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    let rects = svg.selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * barWidth)
        .attr('y', (d) => {
            return yScale(d[1])
        })
        .attr('width', barWidth)
        .attr('height', (d) => {
            return height - yScale(d[1])
        })
        .on('mouseover', function mouseOver(d, i) {
            tooltip.classList.add('show');
            tooltip.style.left = i * barWidth + padding * 11 + 'px';
            tooltip.style.top = height  + 'px';
            tooltip.setAttribute('data-date', d[0])
            tooltip.innerHTML = ` <small>${d[0]}</small>
            $${d[1]} billions`
            
        })
        .on('mouseout', () => {
            tooltip.classList.remove('show');
         });
         
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(0,0)`)
        .call(yAxis)
        .selectAll('text')
        .style('text-anchor', 'end')


})