// // AIzaSyBpyJwdVpxEsuBz7p1WQZoVv0hbde7VYp4
// // 321774260622-2gljopurch9dgrbhtj12n8po5vo8ic37.apps.googleusercontent.com
// // 0EY9iLWSal8hq56OcSMxmG0Y
const CLIENT_ID = '820880022272-fleabsaqiurqa6trnalvn8qlur7tkqgl.apps.googleusercontent.com';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

// Form submit and change channel
channelForm.addEventListener('submit', e => {
    e.preventDefault();

    const channel = channelInput.value;

    getChannel(channel);
});

// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners
function initClient() {
    gapi.client
        .init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        })
        .then(() => {
            // Listen for sign in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // Handle initial sign in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'inline-flex';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Display channel data

    


// Get channel from API
function getChannel(channel) {
    gapi.client.youtube.search
        .list({
            part: 'snippet',
            q: channel,
            type: 'channel'
        })
        .then(response => {

            console.log(response);
            var channelData = document.getElementById('channel-data');
            channelData.innerHTML = "";
            for(i=0;i<4;i++){
                var channel = response.result.items[i];
                console.log(channel);
                var channelID = channel.snippet.channelId;
                statistics(channelID);
                console.log(channelID + " in main div");
            var output = `         
        <div class="collection col p-4 border border-dark border border-3 mx-1 my-3 rounded-4 black-bg text-white justify-content-evenly">
        <p class="collection-item fs-5"><span class="cyan"> ${channel.snippet.channelTitle}</span></p>
        <div id="${channelID}" >  </div>
        <img class="border-0 rounded-circle" src="${channel.snippet.thumbnails.high.url}" width="200" height="200">
        </div>`        
        channelData.innerHTML += output;    
            }          
        })
        // .catch(err => alert('No Channel By That Name'));
}
function statistics(channelID){
    gapi.client.youtube.channels
    .list({
    part: 'snippet,contentDetails,statistics',
    id: channelID
    })
    .then(response => {
        
        var subs = response.result.items[0].statistics.subscriberCount;
        var title = response.result.items[0].snippet.title;
        var videoCount = response.result.items[0].statistics.videoCount;
        var viewCount = response.result.items[0].statistics.viewCount;
        const playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
        var content = 
        `<p>Subscribers : ${numberWithCommas(subs)}</p>
        <p>Videos : ${numberWithCommas(videoCount)}</p>
        <p>Views : ${numberWithCommas(viewCount)}</p>
        <button id="${playlistId}" type="button" class="btn black-bg cyan>Videos</button>`
        subDiv = document.getElementById(`${channelID}`)
        console.log(response);
        subDiv.innerHTML += content;  
    })   
}

// Add commas to number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// function requestVideoPlaylist(playlistId) {
//     const requestOptions = {
//         playlistId: playlistId,
//         part: 'snippet',
//         maxResults: 10
//     };
//     console.log(playlistId);
//     const request = gapi.client.youtube.playlistItems.list(requestOptions);

//     request.execute(response => {
//         console.log(response);
//         const playListItems = response.result.items;
//         if (playListItems) {
//             let output = '<br><h4 class="center-align">Latest Videos</h4>';

//             // Loop through videos and append output
//             playListItems.forEach(item => {
//                 const videoId = item.snippet.resourceId.videoId;

//                 output += `
//             <div class="col-3">
//             <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
//             </div>
//         `;
//             });

//             // Output videos
//             videoContainer.innerHTML = output;
//         } else {
//             videoContainer.innerHTML = 'No Uploaded Videos';
//         }
//     });
// }