//requires javascript-bignum library

//initial vars+functions
ahead=[]
ip=0
stack=[]
ret=[]
c=''
bits=32
Array.prototype.pick=function(n){return this[this.length-n-1]}
Array.prototype.chunk=function(r){var t,n=[],e=0;for(t=this.length/r;t>e;)n[e]=this.splice(0,r),e++;return n}
//lookahead stuff
seek=c=>(!ahead[ip]&&(ahead[ip]=ip+code.slice(ip).indexOf(c)),ahead[ip])
matching_brace=_=>{
	var start=ip
	if(!ahead[start]){
		while(ip<code.length){
			c=code[++ip]
			if(c==']')break;
			if(braces[c])ip=braces[c]();
		}
		ahead[start]=ip
	}
	return ahead[start]
}
braces={
	'"':x=>seek('"',++ip),
	"'":x=>ip+1,
	"[":matching_brace
}
put=s=>out.textContent+=s

//functions
commands={
  	'1':x=>{stack[stack.length-1].push(1);stack[stack.length-1][0]?bits++:stack[stack.length-1].shift()},
  	'+':x=>{stack.push(Array(bits).fill(0))},
  	'$':x=>{stack.push(stack.pick(+BigInteger('0b'+stack.pop().join``)))},
  	'%':x=>{stack.pop()},
  	'@':x=>{stack.push(stack.pick(x=+BigInteger('0b'+stack.pop().join``))),stack.splice(stack.length-x-2,1)},
  	'&':x=>{x=stack.pop();stack.push(stack.pop().map((a,y)=>x[y]&a))},
  	'|':x=>{x=stack.pop();stack.push(stack.pop().map((a,y)=>x[y]|a))},
  	'^':x=>{x=stack.pop();stack.push(stack.pop().map((a,y)=>x[y]^a))},
  	'~':x=>{stack.push(stack.pop().map(x=>+!x))},
  	'<':x=>{stack[stack.length-1].push(0);stack[stack.length-1][0]?bits++:stack[stack.length-1].shift()},
  	'>':x=>{stack[stack.length-1].pop(),stack[stack.length-1].unshift(0)},
	'[':x=>{stack.push(a=[0,...BigInteger(ip).toString(2)].map(x=>+x));a.length>bits&&(bits=a.length);ip=matching_brace()},
	']':x=>{ip=ret.pop()},
	'!':x=>{ret.push(ip);ip=BigInteger('0b'+stack.pop().join``)},
	'?':x=>{x=+BigInteger('0b'+stack.pop().join``);if(+BigInteger('0b'+stack.pop().join``))ret.push(ip),ip=x},
	'=':x=>{op=+BigInteger('0b'+stack.pop().join``);commands[code[++ip]]=x=>(ret.push(ip),ip=op)}
}

//good-to-know data for runtime
log=_=>stats.innerHTML=`Code          │ ${format=[...code.replace(/[\x00-\x1f]/g,x=>String.fromCharCode(x.charCodeAt()+9216))],format[ip]=`<span style=background-color:#7ec0ee>${format[ip]||""}</span>`,format.join``.replace(/</g,'&lt;').replace(/>/g,'&gt;')}
IP            │ ${ip}
Bits          │ ${bits}
Return Stack  │ ${JSON.stringify(ret)}
Stack         │ ${stack.length?stack.slice(0).reverse().map(x=>x.join``).join`
              │ `:''}`
nsc.oninput=onload=_=>(code=nsc.value,log())

//actual parsing
parse=_=>{
	c=code[ip]
	log()
	if(commands[c])commands[c]();stack=stack.map(x=>Array(bits).fill(x[0]).concat(x).slice(-bits));ip++
}

//clearing everything before starting prog
init=_=>(code=nsc.value,ahead=[],ip=0,bits=32,stack=[],ret=[],console.clear())

//determines either full or timed run
run=_=>{init();if(time.checked)interval=setInterval('ip<code.length?parse():(clearInterval(interval),log())',ms.value||1);else for(;ip<code.length;)parse();log()}
