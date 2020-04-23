document.addEventListener('DOMContentLoaded', event => {
    let button = document.getElementById('ShowHIDDevices')

    button.addEventListener('click', async () => {

		let device = await navigator.hid.requestDevice({filters:[]});

        console.log('done');
    })
})
