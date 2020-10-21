const topText = document.getElementById('topText')
const topTextSize = document.getElementById('topTextSize')
const topTextColor = document.getElementById('topTextColor')
const topTextStroke = document.getElementById('topTextStroke')
const topTextFont = document.getElementById('topTextFont')
const topTextBg = document.getElementById('topTextBg')

const bottomText = document.getElementById('bottomText')
const bottomTextSize = document.getElementById('bottomTextSize')
const bottomTextColor = document.getElementById('bottomTextColor')
const bottomTextStroke = document.getElementById('bottomTextStroke')
const bottomTextFont = document.getElementById('bottomTextFont')
const bottomTextBg = document.getElementById('bottomTextBg')

const modalBg = document.querySelector('.modal-bg')
const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal-close')
const modalContent = document.querySelector('.modal-content')
const btnOK = document.querySelector('.btn_ok')

const btnTop = document.querySelector('.btn_top')
const rootElement = document.documentElement

const imgPreviewDiv = document.getElementById('imgPreviewDiv')
const uploadBtnBlock = document.getElementById('uploadBtnBlock')
const sizeHint = document.getElementById('sizeHint')
const btnGroupDiv = document.getElementById('btnGroupDiv')

const imgUpload = document.getElementById('imgUpload')
const imgRenew = document.getElementById('imgRenew')
const imgDownload = document.getElementById('imgDownload')

const loading = document.getElementById('loading')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let topFont = 'Acme'
let bottomFont = 'Acme'

const bgArr = ['transparent', 'black', 'white']
let topBg = 'transparent'
let bottomBg = 'transparent'

let img = new Image()

let fileName
let fileType

function init() {
	canvas.width = 0
	canvas.height = 0

	imgUpload.addEventListener('change', function () {
		const file = this.files[0]
		if (file) {
			if (file.size / 1024 / 1024 > 3) {
				showAlert('The file size exceeds the maximum limit (3MB).')
				this.value = null
				return
			}
			if (file.type != 'image/jpeg' && file.type != 'image/png') {
				showAlert('Invalid file type.')
				this.value = null
				return
			}

			let reader = new FileReader()

			reader.addEventListener('load', function () {
				loading.classList.add('active')

				img.onload = function () {
					loading.classList.remove('active')
					if (img.width / img.height > 1.78 || img.width / img.height < 0.56) {
						showAlert('wrong size')
						return
					}

					canvas.width = img.width
					canvas.height = img.height

					imgPreviewDiv.style.minHeight = 'auto'
					imgPreviewDiv.style.minWidth = 'auto'
					uploadBtnBlock.style.display = 'none'
					btnGroupDiv.style.display = 'flex'

					sizeHint.style.display = 'block'
					sizeHint.innerText = `Original size: ${img.width} × ${img.height}`

					fileName = file.name
					fileType = file.type

					canvasRender()
				}

				img.src = reader.result
			})

			reader.readAsDataURL(file)
		}
	})

	imgRenew.addEventListener('change', function () {
		const file = this.files[0]
		console.log(file.name)
		console.log(file.type)
		if (file) {
			if (file.size / 1024 / 1024 > 3) {
				showAlert('The file size exceeds the maximum limit (3MB).')
				this.value = null
				return
			}
			if (file.type != 'image/jpeg' && file.type != 'image/png') {
				showAlert('Invalid file type.')
				this.value = null
				return
			}
			let reader = new FileReader()

			reader.addEventListener('load', function () {
				loading.classList.add('active')

				img.onload = function () {
					loading.classList.remove('active')
					if (img.width / img.height > 1.78 || img.width / img.height < 0.56) {
						showAlert('Invalid width/height ratio. (16:9 ~ 9:16)')
						return
					}
					canvas.width = img.width
					canvas.height = img.height

					sizeHint.innerText = `Original size: ${img.width} × ${img.height}`

					fileName = file.name
					fileType = file.type

					canvasRender()
				}
				img.src = reader.result
			})

			reader.readAsDataURL(file)
		}
	})

	imgDownload.addEventListener('click', function () {
		const link = document.createElement('a')
		link.download = fileName
		if (fileType === 'image/jpeg') {
			link.href = canvas.toDataURL('image/jpeg')
		}
		if (fileType === 'image/png') {
			link.href = canvas.toDataURL('image/png')
		}

		link.click()
	})

	modalClose.addEventListener('click', hideAlert)
	btnOK.addEventListener('click', hideAlert)

	btnTop.addEventListener('click', function () {
		rootElement.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	})

	document.addEventListener('scroll', function () {
		// scrollHeight (網頁高度) 不變，clientHeight (視窗高度) 會變，兩者相減就是未顯示的高度
		// scrollTop 是目前位置 (網頁上緣為 0，向下逐漸遞增)
		// scrollTop 的最大值為 scrollHeight - 不變，clientHeight
		let scrollTotal = rootElement.scrollHeight - rootElement.clientHeight

		if (rootElement.scrollTop / scrollTotal >= 0.4) {
			btnTop.classList.add('show')
		} else {
			btnTop.classList.remove('show')
		}
	})
}

function canvasRenderListener(dom, event, actionFunc) {
	dom.addEventListener(event, function (e) {
		if (actionFunc) {
			actionFunc(e)
		}
		if (img.src) {
			canvasRender()
		}
	})
}

function bgSwitch(dom, targetBg) {
	const index = bgArr.findIndex(item => item === this[targetBg])
	if (index >= 2) {
		this[targetBg] = bgArr[0]
	} else {
		this[targetBg] = bgArr[index + 1]
	}
	dom.innerText = this[targetBg]
	dom.classList = []
	dom.classList.add(this[targetBg])
}

function fontSwitch(tragetFont, assignValue) {
	this[tragetFont] = assignValue
}

function showAlert(text) {
	modalBg.classList.add('show')
	modalContent.innerText = text
}

function hideAlert() {
	modalBg.classList.remove('show')
}

function canvasRender() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(img, 0, 0)

	let fontSize

	// 文字外框顏色
	ctx.strokeStyle = '#ffffff'
	// 文字置中
	ctx.textAlign = 'center'

	//! Top text font size
	fontSize = canvas.width * topTextSize.value

	// 背景顏色
	ctx.fillStyle = topBg
	// 背景範圍 (x, y, width, height)
	ctx.fillRect(
		0,
		0,
		canvas.width,
		topText.value.split('\n')[0] != ''
			? topText.value.split('\n').length * fontSize + 40
			: 0
	)
	// 文字顏色
	ctx.fillStyle = topTextColor.value
	// 文字外框顏色
	ctx.strokeStyle = topTextStroke.checked ? 'black' : topTextColor.value
	// font 的是設定是寫在一起的 => ctx.font = "bold 48px serif";
	ctx.font = `${fontSize}px ${topFont}`
	// 文字外框粗細
	ctx.lineWidth = 2

	//! Draw top text
	// 預設值是 'alphabetic'
	// 預設文字基線在文字底部，fillText 把 y 設為 0 時，文字會超出圖片上緣，所以要把基線設在文字上緣即可 (top)
	ctx.textBaseline = 'top'
	topText.value.split('\n').forEach(function (text, i) {
		// ctx.fillText(文字內容, x, y, 最大寬度)
		// 在指定位置填入文字
		ctx.fillText(text, canvas.width / 2, i * fontSize + 30, canvas.width)
		// 在指定位置填入文字外框
		ctx.strokeText(text, canvas.width / 2, i * fontSize + 30, canvas.width)
	})

	//! Bottom text font size
	fontSize = canvas.width * bottomTextSize.value

	// 背景顏色
	ctx.fillStyle = bottomBg
	// 背景範圍 (x, y, width, height)
	ctx.fillRect(
		0,
		canvas.height,
		canvas.width,
		bottomText.value.split('\n')[0] != ''
			? -(bottomText.value.split('\n').length * fontSize + 60)
			: 0
	)
	// 文字顏色
	ctx.fillStyle = bottomTextColor.value
	// 文字外框顏色
	ctx.strokeStyle = bottomTextStroke.checked ? 'black' : bottomTextColor.value
	// font 的是設定是寫在一起的 => ctx.font = "bold 48px serif";
	ctx.font = `${fontSize}px ${bottomFont}`
	// 文字外框粗細
	// ctx.lineWidth = fontSize / 15
	ctx.lineWidth = 2

	//! Draw bottom text
	ctx.textBaseline = 'bottom'
	bottomText.value
		.split('\n')
		.reverse()
		.forEach(function (text, i) {
			ctx.fillText(
				text,
				canvas.width / 2,
				canvas.height - i * fontSize - 30,
				canvas.width
			)
			ctx.strokeText(
				text,
				canvas.width / 2,
				canvas.height - i * fontSize - 30,
				canvas.width
			)
		})
}

init()

canvasRenderListener(topText, 'input')
canvasRenderListener(topTextSize, 'input')
canvasRenderListener(topTextColor, 'input')
canvasRenderListener(topTextStroke, 'change')
canvasRenderListener(topTextFont, 'change', e =>
	fontSwitch.call(window, 'topFont', e.target.value)
)
canvasRenderListener(topTextBg, 'click', e =>
	bgSwitch.call(window, topTextBg, 'topBg')
)
canvasRenderListener(bottomText, 'input')
canvasRenderListener(bottomTextSize, 'input')
canvasRenderListener(bottomTextColor, 'input')
canvasRenderListener(bottomTextStroke, 'change')
canvasRenderListener(bottomTextFont, 'change', e => {
	fontSwitch.call(window, 'bottomFont', e.target.value)
})
canvasRenderListener(bottomTextBg, 'click', e =>
	bgSwitch.call(window, bottomTextBg, 'bottomBg')
)
