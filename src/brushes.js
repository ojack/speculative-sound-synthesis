function rect ({ x, y, ctx, w = 10, h = 10, showStroke = false, showFill = true }) {
  if (showFill) ctx.fillRect(x - w / 2, y - h / 2, w, h)
  if (showStroke) ctx.strokeRect(x - w / 2, y - h / 2, w, h)
}

function eraser ({ x, y, ctx, w = 60 }) {
  ctx.clearRect(x - w / 2, y - w / 2, w, w)
}

function text ({ ctx, x, y, w }) {
  console.log('drawing text')
  ctx.font = '48px sans-serif'
  ctx.lineWidth = 2
  //   ctx.strokeText('FREE PALESTINE', 10, ctx.canvas.height / 2 - 50)
  ctx.fillText('FREE PALESTINE', x - w / 2, y - w / 2)
  ctx.strokeText('FREE PALESTINE', x - w / 2, y - w / 2)
}

function circle ({ ctx, x, y, r = 10, showFill = true, showStroke = false }) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  if (showStroke) ctx.stroke()
  if (showFill) ctx.fill()
//   ctx.stroke()
}

function stamp ({ ctx, img, x, y, w, h }) {
  ctx.drawImage(img, x - w / 2, y - h / 2, w, h)
}

export default { rect, pencil: rect, eraser, letter: text, circle, stamp }
