/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import QRCode from "qrcode.react";
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    display_qrcode: {
        [theme.breakpoints.up('sm')]: {
            width: 'auto', border: 'solid 1px gainsboro',
        },
        [theme.breakpoints.down('sm')]: {
            width: '80%', border: 'solid 1px gainsboro',
        },
    },
}));

export default function Canvas_qrcode({ path }) {
    const classes = useStyles();
    const canvas = useRef();
    let ctx = null;
    // initialize the canvas context
    useEffect(() => {
        // dynamically assign the width and height to canvas
        const timer = setTimeout(() => {
            const canvasEle = canvas.current;
            canvasEle.width = 500
            canvasEle.height = 650

            let ImageOnSrc = new Image();
            ImageOnSrc.src = "/image/GomammaWithText.png"
            ImageOnSrc.onload = function () {
                ctx.fillRect(0, 0, canvasEle.width, canvasEle.height);
                ctx.drawImage(document.getElementById('icon'), 150, 160, 200, 200);
                ctx.drawImage(document.getElementById('promptpay'), 160, 25, 180, 60);

                writeText({ text: 'ค่าบริการ: ' + Number(path.amount).toLocaleString("en-US") + ' บาท', x: 250, y: 110 }, { textAlign: 'center', fontSize: 24, color: 'black' });

                writeText({ text: 'แสกน QR เพื่อโอนเข้าบัญชี', x: 250, y: 395 }, { textAlign: 'center', fontSize: 24, color: '#2bb09b' });

                writeText({ text: 'ชื่อ : บริษัท บางกอกแนนนี่เซ็นเตอร์ จำกัด', x: 250, y: 440 }, { textAlign: 'center', fontSize: 18, });

                // writeText({ text: 'บัญชี: 414-095863-8', x: 250, y: 470 }, { textAlign: 'center', fontSize: 18, });

                writeText({ text: 'เลขที่อ้างอิง : ' + path.invoice, x: 250, y: 470 }, { textAlign: 'center', fontSize: 16, });

                // writeText({ text: Number(path.amount).toLocaleString("en-US") + ' บาท', x: 250, y: 95 }, { textAlign: 'center', fontSize: 24, color: 'gray' });

                // writeText({ text: 'เลขที่ชำระเงิน : ' + path.invoice, x: 250, y: 135 }, { textAlign: 'center', fontSize: 16, });

                // writeText({ text: 'QR Code นี้ใช้จ่าย ในวันที่ ' + path.csExtExpiryTimeWithPay, x: 250, y: 500 }, { textAlign: 'center', fontSize: 16, });
                writeText({ text: 'กรุณาชำระก่อนเวลา ' + path.csExtExpiryTimeWithPay + ' น. ในวันที่ ' + path.csExtExpiryDateWithPay, x: 250, y: 500 }, { textAlign: 'center', fontSize: 16, });

                // writeText({ text: path.csExtExpiryTime, x: 250, y: 425 }, { textAlign: 'center', fontSize: 16, });

                writeText({ text: 'ชำระผ่าน Mobile Banking ได้โดย Capture ', x: 250, y: 530 }, { textAlign: 'center', fontSize: 16, });

                writeText({ text: 'หน้าจอโทรศัพท์ และนำภาพ QR ชำระผ่าน App ของ', x: 250, y: 560 }, { textAlign: 'center', fontSize: 16, });

                writeText({ text: 'ธนาคาร', x: 250, y: 590 }, { textAlign: 'center', fontSize: 16, });
            }

            ctx = canvasEle.getContext("2d");
            ctx.fillStyle = "white";

        }, 500);
        return () => clearTimeout(timer);

    }, []);

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
                    value={path.qrRawData}
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


