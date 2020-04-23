document.addEventListener('DOMContentLoaded', event => {
    let button = document.getElementById('ShowHIDDevices')

    button.addEventListener('click', async () => {
		let deviceFilter = { vendorId: 0x0801, productId: 0x2020 };
		let requestParams  = { filters: [deviceFilter] };
		let device = await navigator.hid.requestDevice(requestParams);

        console.log('done');
    })
})
