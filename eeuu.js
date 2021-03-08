var margin = ({top: 10, right: 10, bottom: 50, left: 50});
var width = 670 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

var x = d3.scaleTime()
		.domain([new Date(1945, 1, 1), new Date(2015, 12, 31)])
		.rangeRound([0, width]);

var y = d3.scaleLinear()
		.range([height, 0]);

var parseDate = d3.timeParse("%Y-%m-%d");
var histogram = d3.histogram()
		.value((d) => d.date)
		.domain(x.domain())
		.thresholds(x.ticks(d3.timeYear));

var svg = d3.select("#barra-eeuu")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)

		.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top +")")

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json")
	.then((gdpData) => {
		var timeParsed = gdpData.data.map((d) => d.date = parseDate(d[0]))
		var GDP = gdpData.data.map((d) => d[1]);
		var bins = histogram(gdpData);

		y.domain([0, d3.max(bins, (d) => Math.max(...GDP))])

		svg.selectAll("rect")
			.data(gdpData.data)
			.enter()

			.append("rect")
			.attr("transform", (d) => {"translate(" + x(d.x0) + "," + y(d.length) + ")"})
			.attr("class", "bar")
			.attr("x", (d, i) => x(parseDate(d[0])))
			.attr("y", (d) => y(d[1]))									
			.attr("width", (d) => Math.ceil(width/gdpData.data.length))
			.attr("height", (d) => height - y(d[1]))
			.attr("data-date", (d, i) => d[0])
			.attr("data-gdp", (d, i) => d[1])

			.append("title")
			.attr("id", "tooltip")
			.attr("data-date", (d) => d[0])
			.text((d) => `Fecha: ${d[0]}, GDP: ${d[1]}`)

		svg.append("g")
			.attr("transform", "translate(0, " + height +")")
			.attr("id", "x-axis")
			.call(d3.axisBottom(x))

		svg.append("g")
			.attr("id", "y-axis")
			.call(d3.axisLeft(y))

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -190)
      .attr('y', 20)
      .attr("font-family", "Arial")
			.attr("font-size", "14px")
      .attr('class', 'legend')
      .text('Miles de millones de dólares')

		svg.append('text')
      .attr('x', 300)
      .attr('y', 320)
      .attr("font-family", "Arial")
			.attr("font-size", "14px")
      .attr('class', 'legend')
      .text('Trimestres por Año')
  		    		
	})
	.catch(e => console.log(e));