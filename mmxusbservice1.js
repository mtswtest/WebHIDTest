
var PACKET_TYPE_SINGLE_DATA = 0;
var PACKET_TYPE_START_DATA = 1;
var PACKET_TYPE_CONTINUE_DATA = 2;
var PACKET_TYPE_END_DATA = 3;
var PACKET_TYPE_CANCEL = 4;
var START_PAYLOAD_SIZE = 59;
var PACKET_CONTINUE_DATA_SIZE = 61;
var END_DATA_SIZE = 62;
var SINGLE_DATA_SIZE = 62;
		
function mmxusbservice_sendData(device, data) {
	var packets = this.getPackets(data);
	for (var i = 0; i < packets.length; i++) {
		{
			var packet = packets[i];
			device.sendReport(0x00, packet)
		}
	}
}		
		
function mmxusbservice_getPackets(data) {
	if (data.length > SINGLE_DATA_SIZE) {
		return mmxusbservice_getMultiplePackets(data);
	}
	else {
		var result = ([]);
		/* add */ (result.push(mmxusbservice_getSinglePacket(data)) > 0);
		return result;
	}
}

function mmxusbservice_getSinglePacket(data) {
	var len = 2;
	if (data != null) {
		len += data.length;
	}
	var result = (function (s) { var a = []; while (s-- > 0)
		a.push(0); return a; })(len);
	result[0] = PACKET_TYPE_SINGLE_DATA;
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
}
	
function mmxusbservice_getMultiplePackets(data) {
	var result = ([]);
	var p0 = (function (s) { var a = []; while (s-- > 0)
		a.push(0); return a; })(5 + START_PAYLOAD_SIZE);
	p0[0] = PACKET_TYPE_START_DATA;
	var p0Len = mmxusbservice_getLengthArray(4, data.length);
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
	} })(data, 0, p0, 5, START_PAYLOAD_SIZE);
	/* add */ (result.push(p0) > 0);
	var seq = 1;
	var i = START_PAYLOAD_SIZE;
	for (; i < data.length - END_DATA_SIZE; i += PACKET_CONTINUE_DATA_SIZE) {
		{
			var pi = (function (s) { var a = []; while (s-- > 0)
				a.push(0); return a; })(3 + PACKET_CONTINUE_DATA_SIZE);
			var piLen = getLengthArray(2, seq);
			pi[0] = PACKET_TYPE_CONTINUE_DATA;
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
			} })(data, i, pi, 3, PACKET_CONTINUE_DATA_SIZE);
			/* add */ (result.push(pi) > 0);
			seq++;
		}
		;
	}
	var p1 = (function (s) { var a = []; while (s-- > 0)
		a.push(0); return a; })(2 + data.length - i);
	p1[0] = PACKET_TYPE_END_DATA;
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
}
	
function mmxusbservice_getLengthArray(nBytes, len) {
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
}
	
	