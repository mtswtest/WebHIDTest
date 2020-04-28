document.addEventListener('DOMContentLoaded', event => {
    let button = document.getElementById('ShowHIDDevices')
	
	//let commandString = '0011AA0081040100DF018407DF018103414243000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
	let commandString = '0011AA0081040100DF018407DF018103414243';
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
			console.log('Sending: ' + commandReport);
			device.sendReport(0x00, commandReport).then(() => {
				console.log('Sent command');
			});
        });

        console.log('done');
		

    })
	
	function handleInputReport(e) {
		let responseValue = e.data;
		console.log('Device Response: ' + responseValue);
		console.log('Length: ' + responseValue.byteLength);
				
		databuffer = new Uint8Array(responseValue.buffer);
		console.log('Device Response: ' + byteToHexString(databuffer));
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