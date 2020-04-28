document.addEventListener('DOMContentLoaded', event => {
    let button = document.getElementById('ShowHIDDevices')
	
	let commandString = '0011AA0081040100DF018407DF018103414243000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
	let commandReport = hexStringToByte(commandString);

    button.addEventListener('click', async () => {


        console.log('done');
    })

})


