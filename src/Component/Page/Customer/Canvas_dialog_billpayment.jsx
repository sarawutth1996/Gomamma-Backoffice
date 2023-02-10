/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import QRCode from "qrcode.react";
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    display_qrcode: {
        [theme.breakpoints.up('sm')]: {
            width: '95%', border: 'solid 1px gainsboro',
        },
        [theme.breakpoints.down('sm')]: {
            width: '80%', border: 'solid 1px gainsboro',
        },
    },
}));

export default function Canvas_qrcode({ location, product_name, date, time, tracking }) {
    const classes = useStyles();
    const canvas = useRef();
    let ctx = null;
    // initialize the canvas context
    useEffect(() => {
        // dynamically assign the width and height to canvas
        const timer = setTimeout(() => {
            const canvasEle = canvas.current;
            if (location.length <= 3) {
                canvasEle.width = 500
                canvasEle.height = 800
            } else if (location.length === 4) {
                canvasEle.width = 500
                canvasEle.height = 1000
            } else if (location.length === 5) {
                canvasEle.width = 500
                canvasEle.height = 1100
            }


            let ImageOnSrc = new Image();
            ImageOnSrc.src = "/image/coupon.png"
            ImageOnSrc.onload = function () {
                ctx.fillRect(0, 0, canvasEle.width, canvasEle.height);

                ctx.fillStyle = "white";
                ctx.fillRect(20, 20, 460, 160);

                writeText({ text: 'รายละเอียดการเดินทาง', x: 250, y: 50 }, { textAlign: 'center', fontSize: 24, color: 'black' });
                writeText({ text: product_name, x: 250, y: 90 }, { textAlign: 'center', fontSize: 24, color: 'black' });

                writeText({ text: 'เดินทางวันที่', x: 50, y: 140 }, { textAlign: 'left', fontSize: 20, color: '#989898' });
                writeText({ text: 'เวลา', x: 450, y: 140 }, { textAlign: 'right', fontSize: 20, color: '#989898' });

                writeText({ text: date, x: 50, y: 195 }, { textAlign: 'left', fontSize: 24, color: 'black' });
                writeText({ text: time, x: 450, y: 195 }, { textAlign: 'right', fontSize: 24, color: 'black' });


                if (location.length <= 3) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(20, 230, 460, 550); // 1-3 localtion
                } else if (location.length === 4) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(20, 230, 460, 750); // 4 localtion
                } else if (location.length === 5) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(20, 230, 460, 850); // 4 localtion
                }


                writeText({ text: 'ลำดับการเดินทาง', x: 40, y: 260 }, { textAlign: 'left', fontSize: 24, color: 'black' });

                for (var i = 0; i < location.length; i++) {
                    writeText({ text: location[i].gmm_location_route_name + ' : ', x: location[i].headX, y: location[i].headY }, { textAlign: 'left', fontSize: 20, color: 'red' });
                    ctx.fillStyle = "black";
                    ctx.wrapText(location[i].gmm_location_address, location[i].pos1, location[i].pos2, location[i].pos3, location[i].pos4)
                }

                // writeText({ text: 'ต้นทาง :', x: 40, y: 325 }, { textAlign: 'left', fontSize: 20, color: 'red' });
                // ctx.fillStyle = "black";
                // ctx.wrapText("9911 ซอย รัชดาภิเษก 14/1 แขวง บุคคโล เขตธนบุรี กรุงเทพมหานคร 10600 ประเทศไทย", 40, 355, 440, 26);

                // writeText({ text: 'ปลายทาง1 :', x: 40, y: 425 }, { textAlign: 'left', fontSize: 20, color: 'red' });
                // ctx.fillStyle = "black";
                // ctx.wrapText("เซ็นทรัล ลาดพร้าว ถนน พหลโยธิน แขวง จตุจักร เขตจตุจักร กรุงเทพมหานคร ประเทศไทย", 40, 455, 440, 26);

                // writeText({ text: 'จุดส่งกลับ :', x: 40, y: 525 }, { textAlign: 'left', fontSize: 20, color: 'red' });
                // ctx.fillStyle = "black";
                // ctx.wrapText("ช่างชุ่ย ถนน สิรินธร แขวง บางพลัด เขตบางพลัด กรุงเทพมหานคร ประเทศไทย", 40, 555, 440, 26);
                // $location[$x]['pos1'] = 150;
                // $location[$x]['pos2'] = 545;
                // $location[$x]['pos3'] = 330;
                // $location[$x]['pos4'] = 26;
                if (location.length <= 3) {
                    // หมายเหตุ
                    // writeText({ text: 'หมายเหตุ : ', x: 40, y: 640 }, { textAlign: 'left', fontSize: 20, color: 'black' });
                    // writeText({ text: '', x: 0, y: 0 }, { textAlign: 'left', fontSize: 16, color: 'black' });
                    // ctx.wrapText('1. เงื่อนไขการใช้บริการ xxx xxxxxxx xxxxxxxxxxxxxx ', 40, 670, 320, 26);
                    // ctx.wrapText('2. เงื่อนไขการใช้บริการ xxx xxxxxxx xxxxxxxxxxxxxx ', 40, 725, 320, 26);


                    writeText({ text: 'Tracking scan', x: 405, y: 750 }, { textAlign: 'center', fontSize: 16, color: 'black' });
                    ctx.drawImage(document.getElementById('icon'), 350, 640, 110, 100);
                } else if (location.length === 4) {
                    writeText({ text: 'scan for tracking', x: 250, y: 900 }, { textAlign: 'center', fontSize: 20, color: 'black' });
                    ctx.drawImage(document.getElementById('icon'), 350, 860, 110, 100);
                } else if (location.length === 5) {
                    writeText({ text: 'scan for tracking', x: 250, y: 1000 }, { textAlign: 'center', fontSize: 20, color: 'black' });
                    ctx.drawImage(document.getElementById('icon'), 350, 960, 110, 100);
                }
            }

            ctx = canvasEle.getContext("2d");
            ctx.fillStyle = "#ffdc52";
        }, 150);
        return () => clearTimeout(timer);

    }, []);


    CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {

        var lines = text.split("\n");

        for (var i = 0; i < lines.length; i++) {

            var words = lines[i].split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    this.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }

            this.fillText(line, x, y);
            y += lineHeight;
        }
    };

    // write a text
    const writeText = (info, style = {}) => {
        const { text, x, y } = info;
        const { fontSize = 20, fontFamily = 'Regular', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;


        ctx.beginPath();
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.stroke();
    }

    return (
        <>
            <div style={{ textAlign: 'center', }}>

                <img id="promptpay" src='/image/prompt-pay-logo.png' width="500" height="500" hidden></img>
                <canvas id="canvas" ref={canvas} className={classes.display_qrcode}></canvas>
                <QRCode
                    id="icon"
                    value={config.PATH_URL + "Tracking/" + tracking}
                    size={250}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                    renderAs={"canvas"}
                    imageSettings={{
                        src: "/image/Gomammalogo.png",
                        x: null,
                        y: null,
                        height: 48,
                        width: 50,
                        excavate: false,
                    }}
                    hidden
                />
            </div>
        </>
    );
}


