# Speed-Editor-NodeJS
Speed Editor HID implementation in Node JS

### Info
This project was tested only on Raspberry PI Electron build, just for my own needs. But maybe you find it usable for you.
If you want to use this on RPI also, or I think any other linux distribution, you need to alter priveleges, because this is needed for connection.

### What is done
Thanks to authentication formula this script can connect Speed Editor and put to console jog and keys actions. 

## Usage
Just require script and create new instance:
```js
const SpeedEditor = require('./SpeedEditor2b');

var se = new SpeedEditor();

se.on("keydown",(data)=>{
  console.log("Keydown:",data);
});

se.on("keyup",(data)=>{
  console.log("Keyup:", data);
});

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
```
You can do what you want by keyCode or keyName.
That's it for now!

### Todo
* Keep connection (it should be easy, because it's only need to reauthenticate within 10 minutes)
* USB autoconnect / disconnect
* LEDs onboard 
* code cleaning 

