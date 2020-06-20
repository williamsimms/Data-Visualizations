let tooltip = document.getElementById('tooltip')
let temperature = document.getElementById('temp2')
let width = 800
let height = 400
let margin = {
    left: 80,
    right: 20,
    top: 20,
    bottom: 70
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const colours = ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
let varianceArr = []

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').then((data) => {

    data.monthlyVariance.forEach((el) => {
        varianceArr.push(el.variance)
    })
    temperature.innerHTML = `Base Temperature - ${data.baseTemperature} &#176;`
    let baseTemperature = data.baseTemperature
    data = data.monthlyVariance
    data.forEach((obj) => {
        obj.variance = baseTemperature - obj.variance
    })
    let barHeight = height / 12
    let barWidth = width / (data.length / 12)

    let svg = d3.select('.container')
        .append('svg')
        .attr('class', 'graph')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.bottom)

    let xScale = d3.scaleTime()
        .domain(d3.extent(data, (d) => {
            return d.year
        }))
        .range([margin.left, width - margin.right])

    let yScale = d3.scaleLinear()
        .domain([0, 11])
        .range([margin.top, height])

    let colorScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => {
            return d.variance
        }), d3.max(data, (d) => {
            return d.variance
        })])
        .range([0, 10])

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('fill', (d) => {
            return colours[Math.floor(colorScale(d.variance))]
        })
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('x', (d) => {
            return xScale(d.year)
        })
        .attr('y', (d) => {
            return yScale(d.month)
        })
        .on('mouseover', (d, i) => {
            tooltip.classList.add('show');
            tooltip.style.left = xScale(d.year + 65) + 'px';
            tooltip.style.top = yScale(d.month) + 'px';
            tooltip.innerHTML = `<p>${d.year} - ${months[d.month]}</p>
                                  <p>${d.variance.toFixed(1)}&#176; Celcius</p>`
        })
        .on('mouseout', () => {
            tooltip.classList.remove('show');
        });

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format(''))

    let yAxis = d3.axisLeft(yScale)
        .tickFormat((month) => {
            return months[month]
        })

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height + margin.bottom})`)
        .call(xAxis)

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left},${margin.bottom})`)
        .call(yAxis)

    let legend = d3.select('.container')
        .append('svg')
        .attr('class','legend')
        .attr('width', 200)
        .attr('height', 50)
        .selectAll('rect')
        .data(colours)
        .enter()
        .append('rect')
        .attr('x',(d,i) => {
            return i * 16
        })
        .attr('y',0)
        .attr('width',200/colours.length)
        .attr('height',50)
        .attr('fill',(d) => {
            return d
        })

})