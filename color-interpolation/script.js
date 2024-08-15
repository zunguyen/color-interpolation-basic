const colorInput = document.getElementById("colorInput");
const curveTypeSelect = document.getElementById("curveType");
const generateBtn = document.getElementById("generateBtn");
const colorScale = document.getElementById("colorScale");
const colorInfo = document.getElementById("colorInfo");
const errorMessage = document.getElementById("errorMessage");
const curveEditor = document.getElementById("curveEditor");

// Trigger color scale generation when user inputs a new color value
colorInput.addEventListener("input", generateColorScale);

// Trigger color scale generation and curve rendering when curve type is changed
curveTypeSelect.addEventListener("change", () => {
	generateColorScale();
	renderCurve();
});

// Optional: Still allow the generate button to trigger the function
generateBtn.addEventListener("click", generateColorScale);

function generateColorScale() {
	const inputColor = colorInput.value.trim();
	const curveType = curveTypeSelect.value;
	const steps = 10;

	// Parse the input color
	let brandColor;
	try {
		brandColor = d3.color(inputColor);
		if (brandColor === null) throw new Error("Invalid color format");
		errorMessage.textContent = ""; // Clear any previous error messages
	} catch (error) {
		errorMessage.textContent = "Invalid color format. Please enter a valid hex, rgb, or hsl color.";
		return;
	}

	// Choose easing function based on curve type
	let ease;
	switch (curveType) {
		case "quadratic":
			ease = d3.easeQuadInOut;
			break;
		case "cubic":
			ease = d3.easeCubicInOut;
			break;
		case "sine":
			ease = d3.easeSinInOut;
			break;
		case "exp":
			ease = d3.easeExpInOut;
			break;
		case "circle":
			ease = d3.easeCircleInOut;
			break;
		case "elastic":
			ease = d3.easeElasticOut;
			break;
		case "bounce":
			ease = d3.easeBounceOut;
			break;
		default:
			ease = d3.easeLinear;
	}

	// Create color interpolator
	const colorInterpolator = d3.interpolateRgb("white", brandColor);

	// Generate color scale
	const scale = Array.from({ length: steps }, (_, i) => {
		const t = i / (steps - 1);
		return colorInterpolator(ease(t));
	});

	// Display color scale
	colorScale.innerHTML = "";
	scale.forEach((color) => {
		const colorBox = document.createElement("div");
		colorBox.className = "color-box";
		colorBox.style.backgroundColor = color;
		colorScale.appendChild(colorBox);
	});

	// Determine if brand color is light or dark
	const luminance = brandColor.rgb().r * 0.299 + brandColor.rgb().g * 0.587 + brandColor.rgb().b * 0.114;
	const isDark = luminance < 128;
	colorInfo.textContent = `Brand color is ${isDark ? "dark" : "light"}`;

	// Display the parsed color in hex format
	colorInput.value = brandColor.formatHex();

	// Render the curve
	renderCurve();
}

function renderCurve() {
	const curveType = curveTypeSelect.value;
	const width = curveEditor.clientWidth;
	const height = curveEditor.clientHeight;
	const margin = { top: 10, right: 10, bottom: 10, left: 10 };

	// Clear previous curve
	curveEditor.innerHTML = "";

	// Create an SVG element for the curve editor
	const svg = d3.select("#curveEditor").append("svg").attr("width", width).attr("height", height);

	// Choose easing function based on curve type
	let ease;
	switch (curveType) {
		case "quadratic":
			ease = d3.easeQuadInOut;
			break;
		case "cubic":
			ease = d3.easeCubicInOut;
			break;
		case "sine":
			ease = d3.easeSinInOut;
			break;
		case "exp":
			ease = d3.easeExpInOut;
			break;
		case "circle":
			ease = d3.easeCircleInOut;
			break;
		case "elastic":
			ease = d3.easeElasticOut;
			break;
		case "bounce":
			ease = d3.easeBounceOut;
			break;
		default:
			ease = d3.easeLinear;
	}

	const x = d3
		.scaleLinear()
		.range([margin.left, width - margin.right])
		.domain([0, 1]);
	const y = d3
		.scaleLinear()
		.range([height - margin.bottom, margin.top])
		.domain([0, 1]);

	const line = d3
		.line()
		.x((d, i) => x(d[0]))
		.y((d, i) => y(d[1]))
		.curve(d3.curveMonotoneX);

	const data = Array.from({ length: 100 }, (_, i) => {
		const t = i / 99;
		return [t, ease(t)];
	});

	svg.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 2)
		.attr("d", line);
}

// Generate initial color scale and render the default curve
colorInput.value = "#000000";
generateColorScale();
renderCurve();
