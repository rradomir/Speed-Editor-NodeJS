/*

based on:

https://github.com/Haavard15/SpeedEditorHID/blob/test/speedEditor.js

https://github.com/smunaut/blackmagic-misc/blob/master/bmd.py
# Copyright (C) 2021 Sylvain Munaut <tnt@246tNt.com>

python to node conversion by Radomir Rytych

*/


var HID = require('node-hid');

var device = new HID.HID(7899,55822);

var rol8=function (v){
	return BigInt(((v << 56n) | (v >> 8n)) & 18446744073709551615n)
}

var rol8n=function(v, n){
	for (let i=0;i<n;i++) // in range(n):
		v = rol8(v);
	return v;

}

var generate=function(challenge){
  
  let 	AUTH_EVEN_TBL = [
		4242707987619187656n,
		3069963097229903046n,
		2352841328256802570n,
		12646368222702737177n,
		17018789593460232529n,
		12706253227766860309n,
		11978781369061872007n,
		8438608961089703390n,
	];
  
  let	AUTH_ODD_TBL = [
		4477338132788707294n,
		2622620659002747676n,
		11637077509869926595n,
		7923852755392722584n,
		8224257920127642516n,
		4049197610885016386n,
		18266591397768539273n,
		7035737829027231430n,
	];
	let MASK = 12077075256910773232n;

  let	n = BigInt( challenge & 7n);
	
  let v = BigInt(rol8n(challenge, n));
 
  let k = BigInt(0n);

	if ((v & 1n) == ((120n >> n) & 1n))
		k = AUTH_EVEN_TBL[n];
	else
  {
		v = v ^ rol8(v);
		k = AUTH_ODD_TBL[n];
    }
	return BigInt(v ^ (rol8(v) & MASK) ^ k);
}




    // Reset the auth state machine
    device.sendFeatureReport(Buffer.from([6,0,0,0,0,0,0,0,0,0]));

    // Read the keyboard challenge (for keyboard to authenticate app)
    let data=device.getFeatureReport(6, 10);
    if (data[0]!=6||data[1]!=0) console.log("Failed authentication get challenge");
    
    const data_buf=Buffer.from(data);
    let challenge = data_buf.readBigUInt64LE(2);

    // Send our challenge (to authenticate keyboard)
		// We don't care ... so just send 0x0000000000000000
    device.sendFeatureReport(Buffer.from([6,1,0,0,0,0,0,0,0,0]));

    // Read the keyboard response
		// Again, we don't care, ignore the result
    data=device.getFeatureReport(6, 10);
    if (data[0]!=6||data[1]!=2) console.log("Failed authentication response");
    
    let response=generate(challenge);

    //Read the status
    const buf = Buffer.allocUnsafe(8);
    buf.writeBigUInt64LE(response, 0);
    
    const buf2=Buffer.from([6,3]);

    device.sendFeatureReport(Buffer.concat([buf2,buf]));
    
    data=device.getFeatureReport(6, 10);
    if (data[0]!=6||data[1]!=4) console.log("Failed authentication status");
    

    
var buttons = [
  "Smart Insert",
  "Append",
  "Ripple",
  "Close Up",
  "Place On Top",
  "Source",
  "In",
  "Out",
  "Trim In",
  "Trim Out",
  "Roll",
  "Slip Source",
  "Slip Destination",
  "Transistion Duration",
  "Cut",
  "Dissolve",
  "Smooth Cut"
]

var otherButtons = {
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

Object.keys(otherButtons).forEach(buttonNumber => {
  buttons[buttonNumber - 1] = otherButtons[buttonNumber];
});

var previousButtons = [];

device.on("data", function(data) {
  console.log(data)
  var dataArray = [...data];
  if(dataArray[0] == 4){
    
    var buttonsPressed = []
    if(dataArray[1] != 0){
      buttonsPressed.push(dataArray[1])
    }
    if(dataArray[3] != 0){
      buttonsPressed.push(dataArray[3])
    }
    if(dataArray[5] != 0){
      buttonsPressed.push(dataArray[5])
    }
    if(dataArray[7] != 0){
      buttonsPressed.push(dataArray[7])
    }
    if(dataArray[9] != 0){
      buttonsPressed.push(dataArray[9])
    }
    if(dataArray[11] != 0){
      buttonsPressed.push(dataArray[11])
    }
    //console.log(previousButtons)
    //console.log(buttonsPressed)
    buttonsPressed.forEach(button => {
      if(previousButtons.indexOf(button) == -1){
        console.log("Pressed ", buttons[button - 1])


      }
      
    });
    previousButtons.forEach(button => {
      if(buttonsPressed.indexOf(button) == -1){
        console.log("Unpressed ", buttons[button - 1])

      }
      
    });
    previousButtons = buttonsPressed;

  }

});
