import { Params } from './types/index'

const watermark: any = {}

const setWatermark = (params: Params) => {
  const id = '1.23452384164.123412416'


  if (document.getElementById(id) !== null) {
    // @ts-ignore
    document.body.removeChild(document.getElementById(id))
  }

  const watermarkContainer: any = document.getElementById('app')
  const { width, height } = watermarkContainer.getBoundingClientRect()
  const watermarkWidth = width / 8
  const watermarkHeight = height / 8
  // 创建一个画布
  const canvas = document.createElement('canvas')
  // 设置画布的长宽
  canvas.width = watermarkWidth
  canvas.height = watermarkHeight

  const ctx: any = canvas.getContext('2d')
  // 控制文字的旋转角度和上下位置
  ctx.rotate((-20 * Math.PI) / 180)
  ctx.translate(-50, 20)
  // 文字颜色
  ctx.font = '22px Arial' // 设置水印文字样式
  ctx.fillStyle = 'rgba(0,0,0,0.05)'
  if (params.theme === 'dark') {
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
  }
  ctx.textBaseline = 'Middle'
  ctx.font =
    '18px Arial,"PingFang SC","Microsoft YaHei","Helvetica Neue",Helvetica,"Hiragino Sans GB",sans-serif'
  ctx.textAlign = 'center'
  // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  ctx.fillText(params.mark1, canvas.width / 1.5, canvas.height / 2)
  ctx.font =
    '18px Arial,"PingFang SC","Microsoft YaHei","Helvetica Neue",Helvetica,"Hiragino Sans GB",sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(params.mark2, canvas.width / 1.5, canvas.height / 2 + 30)
  const img = new Image()
  const div = document.createElement('div')
  img.onload = function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0'
    div.style.left = '0'
    div.style.position = 'fixed'
    div.style.zIndex = '9999'
    div.style.width = '100vw'
    div.style.height = '100vh'
    div.style.background = `url(${canvas.toDataURL('image/png')}) left top repeat`
    document.body.appendChild(div)
  }
  img.src = canvas.toDataURL('image/png')

  setTimeout(() => {
    // 防止用户在控制台修改删除水印
    const body = document.getElementsByTagName('body')[0]
    const options = {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    }
    const observer = new MutationObserver(() => {
      div.id = id
      div.style.pointerEvents = 'none'
      div.style.top = '0'
      div.style.left = '0'
      div.style.position = 'fixed'
      div.style.zIndex = '9999'
      div.style.width = '100vw'
      div.style.height = '100vh'
      div.style.background = `url(${canvas.toDataURL('image/png')}) left top repeat`
      observer.disconnect()
      observer.observe(body, options)
      return false
    })
    observer.observe(body, options) // 监听body节点
  }, 500) // 防止在页面未渲染完成的时候找不到页面id
  return id
}

const outWatermark = (id: string) => {
  if (document.getElementById(id) !== null) {
    const div: any = document.getElementById(id)
    div.style.display = 'none'
  }
}

let timer: any = null

// 添加水印该方法只允许调用一次
watermark.set = (params: Params) => {
  let id = setWatermark(params)
  clearInterval(timer)
  timer = setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(params)
    }
  }, 100)
  window.onresize = () => {
    // setWatermark(params)
  }
}

watermark.out = () => {
  const params = '1.23452384164.123412416'
  outWatermark(params)
  clearInterval(timer)
}

export default watermark
