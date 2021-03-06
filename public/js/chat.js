const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.getElementById('send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username , room} = Qs.parse(location.search , { ignoreQueryPrefix: true })

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }


}

socket.on(`message` , (message) => {
    const html = Mustache.render(messageTemplate , {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on(`locationMessage` , (message) => {
    const html = Mustache.render(locationMessageTemplate , {
        username: message.username,
        url: message.text, 
        createdAt : moment(message.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})


socket.on('roomData' , ({room , users}) => {
    const html = Mustache.render(sidebarTemplate , {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit' , (e) => {
    e.preventDefault();

    //disable
    $messageFormButton.setAttribute('disabled' , 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage' , message , (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    
        if(error){
            return console.log('error')
        }
        console.log('Yoooo!')
    })
})

$sendLocationButton.addEventListener('click' , () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled' , 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation' , {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        } , () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Excellent, Location Shared')
        })
    })
})

socket.emit('join', { username , room } , (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})