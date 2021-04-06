let widget = new ListWidget()
widget.backgroundColor = Color.widget()

let titleTxt = widget.addText('테스트')
titleTxt.textColor = Color.black()

widget.addSpacer(5)

Script.setWidget(widget)
Script.complete()