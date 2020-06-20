let tooltip = document.getElementById('tooltip');
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then((data) => {

    let timeFormat = d3.timeFormat("%M:%S");
    let parseTime = d3.timeParse("%M:%S")
    let timeObj = []

    let margin = {
        top: 60,
        left: 60,
        bottom: 60,
        right: 90
    }
    let height = 400
    let width = 800

    data.forEach((obj) => {
        timeObj.push(obj.Time)
    })
    data.forEach((obj) => {
        obj.Time = parseTime(obj.Time)
    })
    let yScale = d3.scaleTime()
        .domain(d3.extent(data, (d) => {
            return d.Time
        }))
        .range([margin.top, height])

    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, (d) => {
            return d.Year
        }))
        .range([margin.left, width])

    let svg = d3.select('.container')
        .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .attr('class', 'graph')

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => d.Time)
        .attr('r', 6)
        .attr('fill', (d) => {
            if (d.Doping === '') {
                return '#d35400'
            } else {
                return '#3498db'
            }
        })
        .attr('cx', (d) => {
            return xScale(d.Year)
        })
        .attr('cy', (d) => {
            return yScale(d.Time)
        })
        .on('mouseover', (d, i) => {
            tooltip.classList.add('show');
            tooltip.style.left = xScale(d.Year) + 10 + 'px'
            tooltip.style.top = yScale(d.Time) - 10 + 'px';
            tooltip.innerHTML = `<p>${d.Name}(${d.Nationality})</p>
            <p>${d.Year}  ${timeFormat(d.Time)}</p>
            <p>${d.Doping}</p>`

        })
        .on('mouseout', (d) => {
            tooltip.classList.remove('show');
        });

    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)
        .tickArguments(12)
        .tickFormat(timeFormat)

    svg.append("g")
        .attr("class", "x axis")
        .attr("id", "x-axis")
        .attr("transform", `translate(${-1},${420})`)
        .call(xAxis)
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year");

    svg.append("g")
        .attr("class", "y axis")
        .attr("id", "y-axis")
        .attr("transform", `translate(${45},${20})`)
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", 60)
        .attr("y",20)
        .attr('transform',`rotate(90)`)
        .style("text-anchor", "end")
        .text("Time in Minutes");

})
