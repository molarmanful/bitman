//initial vars+functions
ahead=[]
ip=0
stack=[]
ret=[]
c=''
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
  '1':x=>{stack[stack.length-1].push(1);stack[stack.length-1].shift()},
  '+':x=>{stack.push(Array(32).fill(0))},
  '$':x=>{stack.push(stack.pick(`0b${stack.pop().join``}`))},
  '%':x=>{stack.pop()},
  '@':x=>{stack.push(stack.splice(stack.length-`0b${stack.pop().join``}`-1,1))},
  '&':x=>{x=stack.pop();stack.push(stack.pop().map((a,y)=>x[y]&a))},
  '|':x=>{x=stack.pop();stack.push(stack.pop().map((a,y)=>x[y]|a))},
  '^':x=>{x=stack.pop();stack.push(stack.pop().map((a,y)=>x[y]^a))},
  '~':x=>{stack.push(stack.pop().map(x=>+!x))},
  '<':x=>{stack[stack.length-1].shift();stack[stack.length-1].push(0)},
  '>':x=>{stack[stack.length-1].pop();stack[stack.length-1].shift(0)},
	'[':x=>{stack.push([...(ip>>>0).toString(2)].map(x=>+x));ip=matching_brace()},
	']':x=>{ip=ret.pop()},
	'!':x=>{ret.push(ip);ip=+`0b${stack.pop().join``}`},
	'?':x=>{if(x=stack.pop(),+`0b${stack.pop().join``}`)ret.push(ip),ip=+`0b${stack.pop().join``}`}
}

//good-to-know data for runtime
log=_=>stats.innerHTML=`Code          │ ${format=[...code.replace(/[\x00-\x1f]/g,x=>String.fromCharCode(x.charCodeAt()+9216))],format[ip]=`<span style=background-color:#7ec0ee>${format[ip]||""}</span>`,format.join``}
IP            │ ${ip}
Stack         │ ${JSON.stringify(stack)}
Return Stack  │ ${JSON.stringify(ret)}`
nsc.oninput=onload=_=>(code=nsc.value,log())

//actual parsing
parse=_=>{
	c=code[ip]
	log()
	if(commands[c])commands[c]();ip++
}

//clearing everything before starting prog
init=_=>(code=nsc.value,ahead=[],ip=0,stack=[],ret=[],console.clear())

//determines either full or timed run
run=_=>{init();if(time.checked)interval=setInterval('ip<code.length?parse():(clearInterval(interval),log())',ms.value||1);else for(;ip<code.length;)parse();log()}
