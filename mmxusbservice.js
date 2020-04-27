
var MMXUSBService = (function () {
	
    function MMXUSBService() {
        this.PACKET_TYPE_SINGLE_DATA = 0;
        this.PACKET_TYPE_START_DATA = 1;
        this.PACKET_TYPE_CONTINUE_DATA = 2;
        this.PACKET_TYPE_END_DATA = 3;
        this.PACKET_TYPE_CANCEL = 4;
        this.START_PAYLOAD_SIZE = 59;
        this.PACKET_CONTINUE_DATA_SIZE = 61;
        this.END_DATA_SIZE = 62;
        this.SINGLE_DATA_SIZE = 62;
		
		this.eventTarget = document.createDocumentFragment();
		
		this.device = null; 
    }
	
	MMXUSBService.prototype.addEventListener = function(type, listener, useCapture, wantsUntrusted) {
		return eventTarget.addEventListener(type, listener, useCapture, wantsUntrusted);
	};

	MMXUSBService.prototype.dispatchEvent = function(event) {
		return eventTarget.dispatchEvent(event);
	);
	
	MMXUSBService.prototype.removeEventListener = function(type, listener, useCapture) {
		return eventTarget.removeEventListener(type, listener, useCapture);
	};

	MMXUSBService.prototype.openDevice = function () {
		let deviceFilter = { vendorId: 0x0801, productId: 0x2020 };
		let requestParams  = { filters: [deviceFilter] };

		try {
			const devices = await navigator.hid.requestDevice(requestParams);
			this.device = devices[0];
		  } catch (error) {
			console.warn('No device access granted', error);
			return;
		  }
		
		console.log(device.vendorId); 
		console.log(device.productId);
        console.log(device.productName);

	
		this.device.open().then(() => {
			console.log('Opened HID device');
			this.device.addEventListener('inputreport', this.handleInputReport);
			});
        });

        console.log('done');
    };
	
	MMXUSBService.prototype.closeDevice = function () {

    };
	
	MMXUSBService.prototype.handleInputReport = function(data) {
		let responseValue = e.data;
		console.log('Device Response: ' + responseValue);
		console.log('Length: ' + responseValue.byteLength);
				
		databuffer = new Uint8Array(responseValue.buffer);
		console.log('Device Response: ' + byteToHexString(databuffer));
	};
	
    MMXUSBService.prototype.sendData = function (data) {
		console.log('sendData: ' + data);						
        var packets = this.getPackets(data);
        for (var i = 0; i < packets.length; i++) {
            {
                var packet = packets[i];
			
				device.sendReport(0x00, packet).then(() => {
					console.log('sent packet: ' + packet);	
				});
            }
            ;
        }
    };
	
    MMXUSBService.prototype.getPackets = function (data) {
        if (data.length > this.SINGLE_DATA_SIZE) {
            return this.getMultiplePackets(data);
        }
        else {
            var result = ([]);
            /* add */ (result.push(this.getSinglePacket(data)) > 0);
            return result;
        }
    };
	
    MMXUSBService.prototype.getSinglePacket = function (data) {
        var len = 2;
        if (data != null) {
            len += data.length;
        }
        var result = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(len);
        result[0] = this.PACKET_TYPE_SINGLE_DATA;
        result[1] = (data.length | 0);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(data, 0, result, 2, data.length);
        return result;
    };
	
    MMXUSBService.prototype.getMultiplePackets = function (data) {
        var result = ([]);
        var p0 = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(5 + this.START_PAYLOAD_SIZE);
        p0[0] = this.PACKET_TYPE_START_DATA;
        var p0Len = this.getLengthArray(4, data.length);
        p0[1] = p0Len[0];
        p0[2] = p0Len[1];
        p0[3] = p0Len[2];
        p0[4] = p0Len[3];
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i_1 = 0; i_1 < size; i_1++)
                dstPts[dstOff++] = tmp[i_1];
        } })(data, 0, p0, 5, this.START_PAYLOAD_SIZE);
        /* add */ (result.push(p0) > 0);
        var seq = 1;
        var i = this.START_PAYLOAD_SIZE;
        for (; i < data.length - this.END_DATA_SIZE; i += this.PACKET_CONTINUE_DATA_SIZE) {
            {
                var pi = (function (s) { var a = []; while (s-- > 0)
                    a.push(0); return a; })(3 + this.PACKET_CONTINUE_DATA_SIZE);
                var piLen = this.getLengthArray(2, seq);
                pi[0] = this.PACKET_TYPE_CONTINUE_DATA;
                pi[1] = piLen[0];
                pi[2] = piLen[1];
                /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
                    while (--size >= 0)
                        dstPts[dstOff++] = srcPts[srcOff++];
                }
                else {
                    var tmp = srcPts.slice(srcOff, srcOff + size);
                    for (var i_2 = 0; i_2 < size; i_2++)
                        dstPts[dstOff++] = tmp[i_2];
                } })(data, i, pi, 3, this.PACKET_CONTINUE_DATA_SIZE);
                /* add */ (result.push(pi) > 0);
                seq++;
            }
            ;
        }
        var p1 = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(2 + data.length - i);
        p1[0] = this.PACKET_TYPE_END_DATA;
        p1[1] = ((data.length - i) | 0);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i_3 = 0; i_3 < size; i_3++)
                dstPts[dstOff++] = tmp[i_3];
        } })(data, i, p1, 2, data.length - i);
        /* add */ (result.push(p1) > 0);
        return result;
    };
	
    MMXUSBService.prototype.getLengthArray = function (nBytes, len) {
        var lengthArray = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(nBytes);
        var shift = nBytes;
        for (var i = 0; i < nBytes; i++) {
            {
                shift--;
                lengthArray[i] = (((len >> (shift * 8)) & (255)) | 0);
            }
            ;
        }
        return lengthArray;
    };
	
	MMXUSBService.prototype.byteToHexString = function(uint8arr) {
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
	};

	MMXUSBService.prototype.hexStringToByte = function(str) {
	  if (!str) {
		return new Uint8Array();
	  }
	  
	  var a = [];
	  for (var i = 0, len = str.length; i < len; i+=2) {
		a.push(parseInt(str.substr(i,2),16));
	  }
	  
	  return new Uint8Array(a);
	};
	
    return MMXUSBService;
}());

MMXUSBService["__class"] = "MMXUSBService";
