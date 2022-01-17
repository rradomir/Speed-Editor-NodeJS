# Speed-Editor-NodeJS
Speed Editor HID implementation in Node JS

### Info
This project was tested only on Raspberry PI Electron build, just for my own needs. But maybe you find it usable for you.
If you want to use this on RPI also, or I think any other linux distribution, you need to alter priveleges, because this is needed for connection.

### What is done
With [authentication formula by Sylvain Munaut](https://github.com/smunaut/blackmagic-misc "Github link") this script can:
* connect Speed Editor
* catch all keys down/up 
* force & direction of knob spin in actual moment.
* light on/off LEDS on keys (for now not for jog keys)

## Usage
Just require script and create new instance:
```js
const SpeedEditor = require('./SpeedEditor');
var se = new SpeedEditor();

se.on("keydown",(data)=>{
  console.log("Keydown:",data);
  });

se.on("keyup",(data)=>{
  console.log("Keyup:", data);
  });

se.on("jog",(data)=>{
  console.log("Jog:", data);
  });
  
se.setLight(true,SpeedEditor.leds.cam1,SpeedEditor.leds.cam3); //turn on light on Cam 1 and Cam 3 keys

```
Expected output:
```
Keydown: { keyCode: 51, keyName: 'Camera 1' }
Keyup: { keyCode: 51, keyName: 'Camera 1' }
Keydown: { keyCode: 51, keyName: 'Camera 1' }
Keydown: { keyCode: 52, keyName: 'Camera 2' }
Keydown: { keyCode: 53, keyName: 'Camera 3' }
Keyup: { keyCode: 51, keyName: 'Camera 1' }
Keyup: { keyCode: 52, keyName: 'Camera 2' }
Keyup: { keyCode: 53, keyName: 'Camera 3' }
Jog:-1
Jog:-1
Jog:-3
```
You can do what you want by keyCode or keyName. Please remember, that's for now, script assume that SpeedEditor device is connected. Otherwise it throw an error.

Setting leds on/off is done by using `se.setLight(value,led[,led])` where name is one of 18 led names defined in SpeedEditor class. Value `true` turn off light, `false` of course set light on. You can also set more leds at once, by adding more arguments.
On every startup all lights is set to `false`. At this moment there is no veryfication on automation for leds. You can set on all 18 leds :)

### Todo
* JOG LEDs onboard
* USB autoconnect / disconnect
* code cleaning 
