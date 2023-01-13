from flask import Flask, Response, request, render_template
from flask_cors import CORS, cross_origin
import re
from datetime import timedelta
from googleapiclient.discovery import build

## variables

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

api_key = 'xxxxxx API_KEY'
youtube = build('youtube', 'v3', developerKey=api_key)

## url for test
url = ''

## paterns
hours_pattern = re.compile(r'(\d+)H')
minutes_pattern = re.compile(r'(\d+)M')
seconds_pattern = re.compile(r'(\d+)S')
url_pattern = re.compile('^([\S]+list=)?([\w_-]+)[\S]*$')

## extract id from url

total_seconds = 0


## routes 

@app.route('/playlistUrl',methods=['GET', 'POST'])
@cross_origin()
def index():
    global url
    if request.method == 'POST':
        url = request.form['url']
    if "list" in request.form:
        url = url + '?list=' + request.form['list']

    return generateResult()


## function to calculate duration 
def playlistDuration():
    
    global total_seconds, url
    total_seconds = 0
    url_id = url_pattern.search(url) 
    countPls = 0
    nextPageToken = None

    if url_id is None :
        return 'Url Invalid'

    
    while True:

        pl_request = youtube.playlistItems().list(
            part='contentDetails, snippet',
            playlistId= url_id.group(2),
            maxResults=50,
            pageToken=nextPageToken
        )

        pl_response = pl_request.execute()
        vid_ids = []

        for item in pl_response['items']:
            vid_ids.append(item['contentDetails']['videoId'])
            channelId = item['snippet']['channelId']
            playlistName = item['snippet']['title']
            channelImage = item['snippet']['thumbnails']['default']['url']
            playlistDetails = item['contentDetails']
            countPls += 1

        vid_request = youtube.videos().list(
            part="contentDetails",
            id=','.join(vid_ids)
        )

        vid_response = vid_request.execute()

        for item in vid_response['items']:
            duration = item['contentDetails']['duration']

            hours = hours_pattern.search(duration)
            minutes = minutes_pattern.search(duration)
            seconds = seconds_pattern.search(duration)

            hours = int(hours.group(1)) if hours else 0
            minutes = int(minutes.group(1)) if minutes else 0
            seconds = int(seconds.group(1)) if seconds else 0

            video_seconds = timedelta(
                hours=hours,
                minutes=minutes,
                seconds=seconds
            ).total_seconds()

            total_seconds += video_seconds

        nextPageToken = pl_response.get('nextPageToken')

        if not nextPageToken:
            break

        total_seconds = int(total_seconds)

    minutes, seconds = divmod(total_seconds, 60)
    hours, minutes = divmod(minutes, 60)
    
    obj = {
        'hours' : hours,
        'minutes' : minutes,
        'seconds' : seconds,
        'channelId' : channelId,
        'playlistDetails' : playlistDetails,
        'channelImage' : channelImage,
        'count': countPls,
        'playlistName' : playlistName
    }
    
    return obj


## function to get All Data about Channel
def getChannel(idChannel):
    channelRequest = youtube.channels().list(
        part='snippet, brandingSettings, statistics',
        id = idChannel
       )

    channelResponse = channelRequest.execute()
    
    obj = {
        'snippet': channelResponse['items'][0]['snippet'],
        'statistics': channelResponse['items'][0]['statistics'],
        'brandingSettings': channelResponse['items'][0]['brandingSettings']
    }
    
    return obj


## generate Result 

def generateResult(): 
    durationObj = playlistDuration()
    if durationObj is None:
        return 'Url Invalid'

    channelObj = getChannel(durationObj['channelId'])

    obj = {
        'duration' : durationObj,
        'aboutChannel' : channelObj
    }

    return obj


if __name__ == "__main__":
    app.run(debug=True)

