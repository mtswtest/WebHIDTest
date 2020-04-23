document.addEventListener('DOMContentLoaded', event => {
    let button = document.getElementById('ShowHIDDevices')
	
	let commandString = 'AA00810401001001843D100182013CA3098101018201018301018402000386279C01009F02060000000001009F03060000000000005F2A0208405F3601029F150200009F530100';
	let commandReport = hexStringToByte(commandString);

    button.addEventListener('click', async () => {
		let deviceFilter = { vendorId: 0x0801, productId: 0x2020 };
		let requestParams  = { filters: [deviceFilter] };
		let device;

		try {
			const devices = await navigator.hid.requestDevice(requestParams);
			device = devices[0];
		  } catch (error) {
			console.warn('No device access granted', error);
			return;
		  }
		
		console.log(device.vendorId); 
		console.log(device.productId);
        console.log(device.productName);

	
		device.open().then(() => {
			console.log('Opened HID device');
			device.addEventListener('inputreport', handleInputReport);
			device.sendReport(0xFF, commandReport).then(() => {
				console.log('Sent command');
			});
        });

        console.log('done');
    })
	
	function handleInputReport(e) {
		let responseValue = e.data;
		console.log('Button value is ' + responseValue);
	}

})


	
	function byteToHexString(uint8arr) {
	  if (!uint8arr) {
		return '';
	  }
	  
	  var hexStr = '';
	  for (var i = 0; i < uint8arr.length; i++) {
		var hex = (uint8arr[i] & 0xff).toString(16);
		hex = (hex.length === 1) ? '0' + hex : hex;
		hexStr += hex;
	  }
	  
	  return hexStr.toUpperCase();
	}

	function hexStringToByte(str) {
	  if (!str) {
		return new Uint8Array();
	  }
	  
	  var a = [];
	  for (var i = 0, len = str.length; i < len; i+=2) {
		a.push(parseInt(str.substr(i,2),16));
	  }
	  
	  return new Uint8Array(a);
	}