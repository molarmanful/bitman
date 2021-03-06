var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n              │ '], ['\n              │ ']);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//requires javascript-bignum library

//initial vars+functions
ahead = [];
ip = 0;
stack = [];
ret = [];
c = '';
bits = 32;
Array.prototype.pick = function (n) {
	return this[this.length - n - 1];
};
Array.prototype.chunk = function (r) {
	var t,
	    n = [],
	    e = 0;for (t = this.length / r; t > e;) {
		n[e] = this.splice(0, r), e++;
	}return n;
};
//lookahead stuff
seek = function seek(c) {
	return !ahead[ip] && (ahead[ip] = ip + code.slice(ip).indexOf(c)), ahead[ip];
};
matching_brace = function matching_brace(_) {
	var start = ip;
	if (!ahead[start]) {
		while (ip < code.length) {
			c = code[++ip];
			if (c == ']') break;
			if (braces[c]) ip = braces[c]();
		}
		ahead[start] = ip;
	}
	return ahead[start];
};
braces = {
	'"': function _(x) {
		return seek('"', ++ip);
	},
	"'": function _(x) {
		return ip + 1;
	},
	"[": matching_brace
};
put = function put(s) {
	return out.textContent += s;
};

//functions
commands = {
	'1': function _(x) {
		stack[stack.length - 1].push(1);stack[stack.length - 1][0] ? bits++ : stack[stack.length - 1].shift();
	},
	'+': function _(x) {
		stack.push(Array(bits).fill(0));
	},
	'$': function $(x) {
		stack.push(stack.pick(+BigInteger('0b' + stack.pop().join(_templateObject))));
	},
	'%': function _(x) {
		stack.pop();
	},
	'@': function _(x) {
		stack.push(stack.pick(x = +BigInteger('0b' + stack.pop().join(_templateObject)))), stack.splice(stack.length - x - 2, 1);
	},
	'&': function _(x) {
		x = stack.pop();stack.push(stack.pop().map(function (a, y) {
			return x[y] & a;
		}));
	},
	'|': function _(x) {
		x = stack.pop();stack.push(stack.pop().map(function (a, y) {
			return x[y] | a;
		}));
	},
	'^': function _(x) {
		x = stack.pop();stack.push(stack.pop().map(function (a, y) {
			return x[y] ^ a;
		}));
	},
	'~': function _(x) {
		stack.push(stack.pop().map(function (x) {
			return +!x;
		}));
	},
	'<': function _(x) {
		stack[stack.length - 1].push(0);stack[stack.length - 1][0] ? bits++ : stack[stack.length - 1].shift();
	},
	'>': function _(x) {
		stack[stack.length - 1].pop(), stack[stack.length - 1].unshift(0);
	},
	'[': function _(x) {
		stack.push(a = [0].concat(_toConsumableArray(BigInteger(ip).toString(2))).map(function (x) {
			return +x;
		}));a.length > bits && (bits = a.length);ip = matching_brace();
	},
	']': function _(x) {
		ip = ret.pop();
	},
	'!': function _(x) {
		ret.push(ip);ip = BigInteger('0b' + stack.pop().join(_templateObject));
	},
	'?': function _(x) {
		x = +BigInteger('0b' + stack.pop().join(_templateObject));if (+BigInteger('0b' + stack.pop().join(_templateObject))) ret.push(ip), ip = x;
	},
	'=': function _(x) {
		op = +BigInteger('0b' + stack.pop().join(_templateObject));commands[code[++ip]] = function (x) {
			return ret.push(ip), ip = op;
		};
	},
	';': function _(x) {
		put(stack.pop().join(_templateObject).replace(/0*/g, ''));
	},
	':': function _(x) {
		put(BigInteger('0b' + stack.pop().join(_templateObject)) << 0);
	},
	'.': function _(x) {
		put(BigInteger('0b' + stack.pop().join(_templateObject)));
	},
	',': function _(x) {
		put(String.fromCharCode(BigInteger('0b' + stack.pop().join(_templateObject))));
	}
};

//good-to-know data for runtime
log = function log(_) {
	return stats.innerHTML = 'Code          │ ' + (format = code.replace(/[\x00-\x1f]/g, function (x) {
		return String.fromCharCode(x.charCodeAt() + 9216);
	}).replace(/</g, '&lt;').replace(/>/g, '&gt;').split(/(&[gl]t;)|/).filter(function (x) {
		return x;
	}), format[ip] = '<span style=background-color:#60cc76>' + (format[ip] || "") + '</span>', format.join(_templateObject)) + '\nIP            │ ' + ip + '\nBits          │ ' + bits + '\nReturn Stack  │ ' + JSON.stringify(ret) + '\nStack         │ ' + (stack.length ? stack.slice(0).reverse().map(function (x) {
		return x.join(_templateObject);
	}).join(_templateObject2) : '');
};
nsc.oninput = onload = function onload(_) {
	return code = nsc.value, log();
};

//actual parsing
parse = function parse(_) {
	c = code[ip];
	log();
	if (commands[c]) commands[c]();stack = stack.map(function (x) {
		return Array(bits).fill(x[0]).concat(x).slice(-bits);
	});ip++;
};

//clearing everything before starting prog
init = function init(_) {
	return code = nsc.value, ahead = [], ip = 0, bits = 32, stack = [], ret = [], out.innerHTML = "", console.clear();
};

//determines either full or timed run
run = function run(_) {
	init();if (time.checked) interval = setInterval('ip<code.length?parse():(clearInterval(interval),log())', ms.value || 1);else for (; ip < code.length;) {
		parse();
	}log();
};
