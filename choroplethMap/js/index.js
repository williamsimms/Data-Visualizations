let tooltip = document.getElementById('tooltip')
let width = 960
let height = 600
let margin = {
    left: 80,
    right: 20,
    top: 20,
    bottom: 70
}
const educational = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const country = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'


let svg = d3.select('.container')
    .append('svg')
    .attr('class', 'graph')
    .attr('width', width)
    .attr('height', height)


async function Map() {
    let path = d3.geoPath()
    const education = await d3.json(educational)
    const counties = await d3.json(country)

    let data = topojson.feature(counties, counties.objects.counties).features

    const colours = []

    let min = d3.min(education, (d) => {
        return d.bachelorsOrHigher
    })
    let max = d3.max(education, (d) => {
        return d.bachelorsOrHigher
    })
    let increment = (max - min) / 8

    let colorScale = d3.scaleThreshold()
        .domain(d3.range(min, max, increment))
        .range(d3.schemeBlues[7])

    for (let i = min; i <= max; i += increment) {
        colours.push(colorScale(i))
    }
    svg.append('g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', path)
        .attr('fill', (d) => {
            return colorScale(education.find(edu => edu.fips === d.id).bachelorsOrHigher)
        })
        .attr('data-fips', (d) => {
            return d.id
        })
        .on('mouseover', (d, i) => {
            let coords = d.geometry.coordinates
            let [x, y] = coords[0][0]

            let educationStats = education.find((ed) => {
                return ed.fips === d.id
            })
            console.log(educationStats)
            tooltip.classList.add('show');
            tooltip.style.left = (x - 35) + 'px';
            tooltip.style.top = (y - 10) + 'px';
            tooltip.setAttribute('data-education', educationStats.bachelorsOrHigher)
            tooltip.innerHTML = `<p>${educationStats.state}</p>
            <p>${educationStats.area_name}</p>
            <p>${educationStats.bachelorsOrHigher}%</p>`
        })
        .on('mouseout', () => {
            tooltip.classList.remove('show');
        });

    let legend = d3.select('.container')
        .append('svg')
        .attr('class', 'legend')
        .attr('width', 150)
        .attr('height', 50)
        .selectAll('rect')
        .data(colours)
        .enter()
        .append('rect')
        .attr('x', (d, i) => {
            return i * 16
        })
        .attr('y', 0)
        .attr('width', 200 / colours.length)
        .attr('height', 50)
        .attr('fill', (d) => {
            return d
        })
}

Map()