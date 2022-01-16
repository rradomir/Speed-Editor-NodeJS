class SpeedEditor {
	device;
	keys=[];
	keyNames={
		1: "Smart Insert",
		2: "Append",
		3: "Ripple",
		4: "Close Up",
		5: "Place On Top",
		6: "Source",
		7: "In",
		8: "Out",
		9: "Trim In",
		10: "Trim Out",
		11: "Roll",
		12: "Slip Source",
		13: "Slip Destination",
		14: "Transistion Duration",
		15: "Cut",
		16: "Dissolve",
		17: "Smooth Cut",
		49: "Escape",
		31: "Sync Bin",
		44: "Audio Level",
		45: "Full View",
		34: "Transistion",
		47: "Split",
		46: "Snap",
		43: "Ripple Delete",
		51: "Camera 1",
		52: "Camera 2",
		53: "Camera 3",
		54: "Camera 4",
		55: "Camera 5",
		56: "Camera 6",
		57: "Camera 7",
		58: "Camera 8",
		59: "Camera 9",
		48: "Live",
		37: "Video Only",
		38: "Audio Only",
		60: "Play / Pause",
		26: "Source",
		27: "Timeline",
		28: "Shuffle",
		29: "Jog",
		30: "Scroll" 
	}
	
	keyAction(data){
	  /* on each keydown or keyup keyboard will send all pressed button at the moment
	   * so we need to filter new keys and check which keys was released.
	   * keyboard can handle 6 simultaneous buttons
	   * */
	  
		let currentKeys=[];
		for (let i=0;i<data.length;i+=2) if (data[i]>0) currentKeys.push(data[i]);
	  
		currentKeys.forEach(button => {
			if(this.keys.indexOf(button) == -1)
				this.emit('keydown',{keyCode:button,keyName:this.keyNames[button]});
		});
	  
	  
		this.keys.forEach(button => {
			if(currentKeys.indexOf(button) == -1)
				this.emit('keyup',{keyCode:button,keyName:this.keyNames[button]});
			});
		this.keys=currentKeys;
	}

	constructor() {
		let hid = require('node-hid');
		this.device = new hid.HID(7899,55822);
		let success=this.authenticate();
		if (success) this.device.on("data", (buffer)=>{
			let data = [...buffer];
			if (data[0]==4) this.keyAction(data.slice(1));
			//else if (data[0]==3) this.keyJog(data.slice(1));
		  
			});
	}
	  
	/* 
	* Authenticate module is taken from:
	* https://github.com/smunaut/blackmagic-misc
	* Copyright (C) 2021 Sylvain Munaut <tnt@246tNt.com>
	* 
	* */
	rol8(v){
		return BigInt(((v << 56n) | (v >> 8n)) & 18446744073709551615n)
	}

	rol8n(v, n){
		for (let i=0;i<n;i++)
			v = this.rol8(v);
		return v;
	}
	   
	#AUTH_EVEN_TBL = [
		4242707987619187656n,
		3069963097229903046n,
		2352841328256802570n,
		12646368222702737177n,
		17018789593460232529n,
		12706253227766860309n,
		11978781369061872007n,
		8438608961089703390n];
  	#AUTH_ODD_TBL = [
		4477338132788707294n,
		2622620659002747676n,
		11637077509869926595n,
		7923852755392722584n,
		8224257920127642516n,
		4049197610885016386n,
		18266591397768539273n,
		7035737829027231430n];
	#MASK = 12077075256910773232n;
	   
	authenticate(){

	// Reset the auth state machine
	this.device.sendFeatureReport(Buffer.from([6,0,0,0,0,0,0,0,0,0]));

	// Read the keyboard challenge (for keyboard to authenticate app)
	let data=this.device.getFeatureReport(6, 10);
	if (data[0]!=6||data[1]!=0) 
	{
		console.log("Failed authentication get challenge");
		return false;
	}
	
	const data_buf=Buffer.from(data);
	let challenge = data_buf.readBigUInt64LE(2);

	// Send our challenge (to authenticate keyboard)
	// We don't care ... so just send 0x0000000000000000
	this.device.sendFeatureReport(Buffer.from([6,1,0,0,0,0,0,0,0,0]));

	// Read the keyboard response
	// Again, we don't care, ignore the result
	data=this.device.getFeatureReport(6, 10);
	if (data[0]!=6||data[1]!=2) 
	{
		console.log("Failed authentication response");
		return false;
	}
	
	let	n = BigInt(challenge & 7n);
	let v = BigInt(this.rol8n(challenge, n));
	let k = BigInt(0n);
	if ((v & 1n) == ((120n >> n) & 1n))
		k = this.#AUTH_EVEN_TBL[n];
	else
		{
		v = v ^ this.rol8(v);
		k = this.#AUTH_ODD_TBL[n];
		}
	let response= BigInt(v ^ (this.rol8(v) & this.#MASK) ^ k);

	//Read the status
	const buf = Buffer.allocUnsafe(8);
	buf.writeBigUInt64LE(response, 0);
	
	this.device.sendFeatureReport(Buffer.concat([Buffer.from([6,3]),buf]));
	
	data=this.device.getFeatureReport(6, 10);
	if (data[0]!=6||data[1]!=4) 
		{
		console.log("Failed authentication status");
		return false;
		}
	return true;
	}// end of authenticate
	
}; //end of class
  
module.exports = SpeedEditor;
require('util').inherits(SpeedEditor,require('events').EventEmitter);
