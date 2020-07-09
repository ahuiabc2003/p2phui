var webdata = {
	set: function(key, val) {
		window.sessionStorage.setItem(key, val)
	},
	get: function(key) {
		return window.sessionStorage.getItem(key)
	},
	del: function(key) {
		window.sessionStorage.removeItem(key)
	},
	clear: function(key) {
		window.sessionStorage.clear()
	}
};
var urlPath = window.location.href.split('?url=')[1] ? window.location.href.split('?url=')[1] : '';
url = urlPath.split("://")[1].split("&")[0];
if (url == "" || url == undefined) {
	document.querySelector('#catP2pPlayer').style.display = 'none'
} else {
	ishttps = document.location.protocol == 'https:';
	if (ishttps) {
		url = "https://" + url
	} else {
		url = "http://" + url
	}
	const dp = new DPlayer({
		container: document.getElementById('catP2pPlayer'),
		autoplay: true,
		video: {
			url: url,
			type: 'customHls',
			customType: {
				'customHls': function(video, player) {
					const hls = new Hls({
						debug: false,
						p2pConfig: {
							logLevel: false,
							live: false,
							announce: '',
							wsSignalerAddr: ''
						}
					});
					hls.loadSource(video.src);
					hls.attachMedia(video)
				}
			}
		}
	});
	if (!dp.video.paused) {
		document.querySelector('.mask').style.display = 'none'
	} else {
		document.querySelector('.mask').onclick = function() {
			dp.play();
			document.querySelector('.mask').style.display = 'none'
		}
	}
	dp.seek(webdata.get('vod' + url));
	dp.on('loadstart', function(stats) {
		if (dp.video.paused) {
			dp.play()
		}
	});
	setInterval(function() {
		webdata.set('vod' + url, dp.video.currentTime)
	}, 1000)
}