window.alert = function(msg) {
    let maskBackGround = '#0000002b';  //蒙版展示色
    let zIndex = 9999;
    let desColor = '#000';             //提示信息字体颜色
    let btnValue = 'OK';               //确定按钮名称
    let btnBgColor = 'black';          //确定按钮背景颜色
    let btnColor = '#fff';             //确定按钮字体颜色
    let btnAlign = 'right';            //按钮在水平位置

    let style = `
        <style class="my_mask_style">
            .box-sizing {
                box-sizing: border-box;
            }

            .alertMask {
                position: fixed;
                display: flex;
                display: webkit-flex;
                flex-direction: row;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
                top: 0;
                z-index: ${zIndex};
                background: ${maskBackGround}
            }

            .alertContainer{
                min-heigth: 100px;
                min-width: 220px;
                max-width: 300px;
                background: #fff;
                border: 1px solid ${maskBackGround};
                border-radius: 8px;
                overflow: hidden;
            }

            .alertDes {
                line-height: 60px;
                height: 60px;
                text-align: center;
                font-size: 16px;
                color: ${desColor};
            }
            

            .alertConfirmParent{
                width: 100%;
                padding: 10px 30px;
                text-align: `+btnAlign+`;
                box-sizing: border-box;
                background: #f2f2f2;
            }
            .alertConfirmBtn{
                cursor: pointer;
                padding: 8px 10px;
                border: none;
                border-radius: 2px;
                color: `+btnColor+`;
                background-color: `+btnBgColor+`;
                box-shadow: 0 0 2px `+btnBgColor+`;
            }
        </style>
    `

    // 把样式放入head标签中
    var head = document.getElementsByTagName('head')[0];
    head.innerHTML += style;

    const body = document.body;
    var alertMask = document.createElement('div');
	var alertContainer = document.createElement('div');
	var alertDes = document.createElement('div');
	var alertConfirmParent = document.createElement('div');
	var alertConfirmBtn = document.createElement('button');	

    body.append(alertMask);
	alertMask.classList.add('alertMask');
	alertMask.classList.add('box-sizing');
	
	alertMask.append(alertContainer);
	alertContainer.classList.add('alertContainer');
	alertContainer.classList.add('box-sizing');
		
	alertContainer.append(alertDes);
	alertDes.classList.add('alertDes');
	alertDes.classList.add('box-sizing');
	
	alertContainer.append(alertConfirmParent);
	alertConfirmParent.classList.add('alertConfirmParent');
	alertConfirmParent.classList.add('box-sizing');	
	
	alertConfirmParent.append(alertConfirmBtn);
	alertConfirmBtn.classList.add('alertConfirmBtn');
	alertConfirmBtn.classList.add('box-sizing');
	alertConfirmBtn.innerText = btnValue;

    //提示信息的内容	
	alertDes.innerHTML = msg;
	//关闭当前alert弹窗
	function alertBtnClick(){
		body.removeChild(alertMask);
		let maskStyle = head.getElementsByClassName('mask-style')[0];
		head.removeChild(maskStyle);	//移除生成的css样式
		
	}
	alertConfirmBtn.addEventListener("click", alertBtnClick);
}