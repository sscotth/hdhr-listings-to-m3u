const { get } = require('http')

const HDHR_IP = '10.0.1.2'
const HDHR_URL = `http://${HDHR_IP}/lineup.json`

const INCLUDE_UNPROTECTED_CHANNELS = true
const INCLUDE_PROTECTED_CHANNELS = false

const INCLUDE_SUBSCRIBED_CHANNELS = true
const INCLUDE_UNSUBSCRIBED_CHANNELS = true

const INCLUDE_ENABLED_CHANNELS = true
const INCLUDE_DISABLED_CHANNELS = true

const INCLUDE_UNFAVORITED_CHANNELS = true
const INCLUDE_FAVORITED_CHANNELS = true

const INCLUDE_HD_CHANNELS = true
const INCLUDE_SD_CHANNELS = true

const INCLUDE_AVC_CHANNELS = true
const INCLUDE_MPEG2_CHANNELS = true

get(HDHR_URL, res => {
    let body = ''

    res.on('data', chunk => body += chunk)
    res.on('end', () => {
        const channels = JSON.parse(body)
        console.log('#EXTM3U')
        channels
        .filter(({ DRM }) => DRM ? INCLUDE_PROTECTED_CHANNELS : INCLUDE_UNPROTECTED_CHANNELS)
        .filter(({ Subscribed }) => Subscribed === 0 ? INCLUDE_UNSUBSCRIBED_CHANNELS : INCLUDE_SUBSCRIBED_CHANNELS)
        .filter(({ Enabled }) => Enabled === 0 ? INCLUDE_DISABLED_CHANNELS : INCLUDE_ENABLED_CHANNELS)
        .filter(({ Favorite }) => Favorite ? INCLUDE_FAVORITED_CHANNELS : INCLUDE_UNFAVORITED_CHANNELS)
        .filter(({ HD }) => HD ? INCLUDE_HD_CHANNELS : INCLUDE_SD_CHANNELS)
        .filter(({ VideoCodec }) => VideoCodec === 'MPEG2' ? INCLUDE_MPEG2_CHANNELS : INCLUDE_AVC_CHANNELS)
        .forEach(({ GuideNumber, GuideName, URL }) => {
          console.log(`#EXTINF:${GuideNumber},${GuideNumber}:${GuideName}`)
          console.log(URL)
        })
    })
})
.on('error', console.error)
