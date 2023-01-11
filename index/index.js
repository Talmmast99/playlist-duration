function submitForm(url)
{
    var xhr = new XMLHttpRequest();
    data = 'url=' + url
    //data = data.replace('?','%%')
    //data = data.replace('&','%%')

    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                res = JSON.parse(xhr.response)
                console.log(res)

                let time = 
                {
                    'hours' : res.duration.hours ? res.duration.hours : 0,
                    'minutes' : res.duration.minutes ? res.duration.minutes : 0,
                    'seconds' : res.duration.seconds  ? res.duration.seconds : 0,
                }

                let channel = {
                    'title' : res.aboutChannel.brandingSettings.channel.title,
                    'description' : res.aboutChannel.brandingSettings.channel.description,
                    'publishedAt' : res.aboutChannel.snippet.publishedAt ? res.aboutChannel.snippet.publishedAt : '',
                    'customUrl' : res.aboutChannel.snippet.customUrl,
                    'thumbnail' : res.aboutChannel.snippet.thumbnails.default.url,
                    'country' : res.aboutChannel.snippet.country ? res.aboutChannel.snippet.country : '',
                    'statistics' : res.aboutChannel.statistics,
                    'keywords' : res.aboutChannel.brandingSettings.channel.keywords ? res.aboutChannel.brandingSettings.channel.keywords : ''
                }

                let playlist = {
                    'channelImage' : res.duration.channelImage,
                    'count' : res.duration.count,
                    'playlistName' : res.duration.playlistName,
                    'url' : url
                }

                generateTiming(time)
                generateChannel(channel)
                generatePlaylistLink(playlist)
            }
        }
    }

    xhr.open('POST','http://localhost:5000/playlistUrl',true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);

}


/**  part 1  **/

function generateTiming(data)
{
    document.querySelector('.operation-duration').innerHTML = "";


    let html = 
    `
        <div class="operation-duration-part1">
            <div>   
                <span> ${data.hours} </span> 
                <span> Hours </span>
            </div>
            <div>   
                <span> ${data.minutes} </span> 
                <span> Minutes </span>
            </div>
            <div>   
                <span> ${data.seconds} </span> 
                <span> Seconds </span>
            </div>
        </div>  
    ` 
    document.querySelector('.operation-duration').innerHTML += html;

}


function generateChannel(data)
{
    let img = document.createElement('img');
    console.log(data.thumbnail)

    let html = 
    `
    <div class="operation-channel-part1">
        <div>
            <img src="${data.thumbnail}">
        </div>
        <div>
            <h2> ${data.title} </h2>
            <span> ${data.statistics.subscriberCount} Subscribers</span>
        </div>
        <div>
            <a href="https://www.youtube.com/${data.customUrl}" target="__blank">Channel</a>
        </div>
    </div>  
    <div class="operation-channel-part2">
        <p>
            ${data.description}
        </p>
    </div>
    <div class="operation-channel-part3">
        <div>
            <h4>View Count</h4>
            <span>${data.statistics.viewCount}</span>
        </div>
        <div>
            <h4>Subscriber Count</h4>
            <span>${data.statistics.subscriberCount}</span>
        </div>
        <div>
            <h4>Video Count</h4>
            <span>${data.statistics.videoCount}</span>
        </div>
    </div>
    <div class="operation-channel-part4 keywords">
        ${ splitKeywords(data.keywords)}
    </div>
    `

    document.querySelector('.operation-channel').innerHTML = html;
}


const form = document.querySelector('#playlistForm')

form.addEventListener('submit',function(e)
{
    e.preventDefault();
    submitForm(form['playlistUrl'].value)
})



function generatePlaylistLink(data)
{
    
    let html = `
        <div class="operation-duration-part2">
            <div>
                <img src="${data.channelImage}">
            </div>
            <div>
                <h2>${data.playlistName}</h2>
                <span>${data.count} videos</span>
            </div>
            <div>
                <a href="${data.url}" target="_blank" class="link"> <i class="fa-solid fa-play"></i> </a>
            </div>
        </div>

    `
    
    document.querySelector('.operation-duration').innerHTML += html;
}



function splitKeywords(keys)
{
    let vals = keys.split(' ')
    let html = ``


    vals.forEach(keyword => {
        html += '<div>'+ keyword +'</div>'
    });
    return html 
}
