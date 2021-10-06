"use strict";

const CalculatorEntity = (function () {
	let activeRegion;
	let activeMonth;
	const outputRows = [];
	return {
		__init__: function (...args) {
			for (let i = 0; i < args.length; i++) {
				outputRows[i] = args[i];
			}
		},
		setActiveRegion: function (region) {
			activeRegion = region;
		},
		setActiveMonth: function (month) {
			activeMonth = month;
		},
		fetchExcelData: function () {
			return excelData[activeRegion][activeMonth];
		},
		populateExcelData: function () {
			const data = this.fetchExcelData();
			for (let i = 0; i < data.length; i++) {
				outputRows[i].value = data[i]["D"];
			}
		}
	};
})();

const MonthEntity = (function () {
	const months = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro"
	];
	let currentMonthIndex;
	let monthContainer;
	return {
		__init__: function (...args) {
			monthContainer = args[0];
			let currentMonth = monthContainer.innerHTML.trim();
			currentMonth = `${currentMonth[0].toUpperCase()}${currentMonth.slice(1).toLowerCase()}`;
			currentMonthIndex = months.indexOf(currentMonth);
			this.setActiveMonth(months[currentMonthIndex]);
		},
		configure: function (element, type) {
			this.element = element;
			this.type = type;
			this.attachEvents();
		},
		attachEvents: function () {
			const self = this;
			this.element.addEventListener("click", function (event) {
				event.preventDefault();
				self.changeMonth();
				self.populateExcelData();
			});
		},
		changeMonth: function () {
			if (this.type === "incrementMonth") {
				currentMonthIndex = (currentMonthIndex + 1) % 12;
			} else if (this.type === "decrementMonth") {
				currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
			}
			monthContainer.innerHTML = months[currentMonthIndex];
			this.setActiveMonth(months[currentMonthIndex]);
		}
	};
})();
Object.setPrototypeOf(MonthEntity, CalculatorEntity);

const RegionEntity = (function () {
	const regionsGrouping = {
		"Centro-Oeste": "Centro-Oeste, Nordeste e Sudest",
		"Nordeste": "Centro-Oeste, Nordeste e Sudest",
		"Sudeste": "Centro-Oeste, Nordeste e Sudest",
		"Norte": "Região Norte",
		"Sul": "Sul"
	};
	let currentRegion;
	return {
		__init__: function (...args) {
			currentRegion = args[0];
			this.setActiveRegion(regionsGrouping[currentRegion]);
		},
		configure: function (element) {
			this.element = element;
			this.region = this.element.getAttribute("data-region");
			this.attachEvents();
		},
		attachEvents: function () {
			const self = this;
			this.element.addEventListener("click", function (event) {
				event.preventDefault();
				if (self.region !== currentRegion) {
					self.changeRegion();
					self.populateExcelData();
				}
			});
		},
		changeRegion: function () {
			currentRegion = this.region;
			this.setActiveRegion(regionsGrouping[currentRegion]);
		}
	};
})();
Object.setPrototypeOf(RegionEntity, CalculatorEntity);

document.addEventListener("DOMContentLoaded", function () {
	CalculatorEntity.__init__(
		document.getElementById("output-row__1"),
		document.getElementById("output-row__2"),
		document.getElementById("output-row__3"),
		document.getElementById("output-row__4")
	);
	MonthEntity.__init__(document.getElementById("month-container"));
	RegionEntity.__init__("Centro-Oeste");

	CalculatorEntity.populateExcelData();

	Object.create(MonthEntity).configure(document.getElementById("prev-month"), "decrementMonth");
	Object.create(MonthEntity).configure(document.getElementById("next-month"), "incrementMonth");

	Object.create(RegionEntity).configure(document.getElementById("region-1"));
	Object.create(RegionEntity).configure(document.getElementById("region-2"));
	Object.create(RegionEntity).configure(document.getElementById("region-3"));
	Object.create(RegionEntity).configure(document.getElementById("region-4"));
	Object.create(RegionEntity).configure(document.getElementById("region-5"));
});