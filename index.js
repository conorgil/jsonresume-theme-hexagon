'use strict';
var fs = require("fs");
var path = require('path');
const moment = require('moment');
var Handlebars = require("handlebars");
require('handlebars-helpers')();

var dates = fs.readFileSync(
	__dirname + '/dates.hbs'
).toString()
Handlebars.registerPartial('dates', Handlebars.compile(dates));

Handlebars.registerHelper("date", (date = '1970-01-01') => {
	return moment(date).format('MMM YYYY');
});

Handlebars.registerHelper("names", (text = '') => {
	var names = [];
	const [first, last] = text.split(" ");
	names.push(`<span class="firstName">${Handlebars.escapeExpression(first)}</span>`);
	names.push(`<span class="lastName">${Handlebars.escapeExpression(last)}</span>`);
	return new Handlebars.SafeString(names.join(' '));
});

Handlebars.registerHelper('levels', (level, options) => {
	let skillMeter = '';
	for (let i = 1; i <= 5; ++i) {
		skillMeter += options.fn(i <= level ? 'active' : '');
	}
	return skillMeter;
});

Handlebars.registerHelper("tiny", (url = '', ...params) => {
	const [options, ...args] = params.reverse();
	const [numPaths = 1] = args;
	const [host, ...paths] = url.replace(/(http|https):\/\//i, '').split('/');
	return new Handlebars.SafeString([host, ...paths.slice(0, numPaths)].join('/'));
});

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");

	return Handlebars.compile(tpl)({
		...resume,
		_: { styles: css }
	});
}

module.exports = {
	render: render
};
