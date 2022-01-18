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
* light on/off LEDS on all keys

# Usage
Just require script and create new instance:
```js
const SpeedEditor = require('./SpeedEditor');
var se = new SpeedEditor();
```
### Keys events
Now you can catch events:
```js
se.on("keydown",(data)=>{
  console.log("Keydown:",data);
  });
```
This will output: `Keydown: { keyCode: 51, keyName: 'Camera 1' }` Keyboard can handle 6 simultaneous buttons. Same thing about key release:
```js
se.on("keyup",(data)=>{
  console.log("Keyup:", data);
  });
```
Will output: ```Keyup: { keyCode: 51, keyName: 'Camera 1' }```
### Jog
```js
se.on("jog",(data)=>{
  console.log("Jog:", data);
  });
```
Jog event is fired only when jog is spinning, `data` will return how fast it is, and which direction.
### Key leds
```js
se.setLight(true,SpeedEditor.leds.closeUp,SpeedEditor.leds.cut); //turn on light on Close Up 1 and Cut 3 keys
//you can also pass array or both
let cams=[SpeedEditor.leds.cam1,SpeedEditor.leds.cam2];
se.setLight(true,cams,SpeedEditor.leds.cam3); //turn on light on keys Cam1, Cam2, Cam3
se.setLight(false,cams);//will turn off leds in Cam1, Cam2
```
You can also check which leds is currently on.
* `se.getLight()` - will return array of leds codes. 
* `se.getLightNames()` - will return array of names, just more user-friendly list.

List of all names:

``` closeUp, cut, dis, smthCut, trans, snap, cam1, cam2, cam3, cam4, cam5, cam6, cam7, cam8, cam9, liveOwr, videoOnly, audioOnly, jog, shtl, scrl ```

On every startup all lights is set to `false`. At this moment there is no automation for leds. Keys isn't anyway connected to their leds. You can set on all 21 leds :) this also counts for JOG keys, they are independent and you can turn all 3.
Please remember, that's for now, script assume that SpeedEditor device is connected. Otherwise it throw an error.

### Todo
* USB autoconnect / disconnect
* option to connect keys to leds, so pressing button with led turn it on or off
* code cleaning 
* more testing
