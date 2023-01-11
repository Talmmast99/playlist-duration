
// i want to execute this code 
var listVideo = document.querySelectorAll('ytd-playlist-video-renderer')
// var listVideo  = document.querySelectorAll("#playlist-items");

var arr = []

listVideo.forEach(video => {
    let time =  video.querySelector('span.ytd-thumbnail-overlay-time-status-renderer').innerHTML;
  	if(time != '')
    {
		    console.log(time)
      	arr.push(generateTime(time))
    }
})


function generateTime(time)
{	
		let valAfterSplit = time.split(':');
    let timeObj = {
    	hour : 0,
      minute : 0,
      seconde : 0
    }
    	 
    if(Array.isArray(valAfterSplit))
    {
    	// Optimize This Code ( Use Foreach to push data in Obj)
    	switch(valAfterSplit.length > 0)
      {
      	case valAfterSplit.length === 3:
        	timeObj.hour = parseInt(valAfterSplit[0]);
          timeObj.minute = parseInt(valAfterSplit[1]);
        	timeObj.seconde = parseInt(valAfterSplit[2]);
					break;
        case valAfterSplit.length === 2:	
          timeObj.minute = parseInt(valAfterSplit[0]);
          timeObj.seconde = parseInt(valAfterSplit[1]);
        	break;
      }
    }
   return timeObj
}


function calculate(times)
{
	let hours = 0;
	let minutes = 0;
  let secondes = 0;
  
	times.forEach(time => 
  {
  	hours += time.hour;
  	minutes += time.minute;
    secondes += time.seconde;
  })
  
  let val;	
    
  /*while(minutes >= 60)
  {
	  val = a(minutes);
  	hours = val[0];
    minutes = val[1];	
  }
  
  while(secondes >= 60)
  {
  	val = a(secondes)	
  	minutes = val[0];
    secondes = val[1];	
  }*/
	
  return hours + ' Hours,' + minutes + ' Minutes,'+ secondes +' Secondes' ;
}


function a(value)
{
	let val1, val2;
	val1 = Math.floor(value / 60);
  val2 = value % 60;
  
  return [val1, val2]
}

console.log(listVideo)
calculate(arr);
