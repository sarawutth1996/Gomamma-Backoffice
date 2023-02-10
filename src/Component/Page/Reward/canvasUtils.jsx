/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';

export default function TagCanvas({ message }) {

    const canvas = useRef();
    let ctx = null;
    // initialize the canvas context
    useEffect(() => {
        // dynamically assign the width and height to canvas
        const canvasEle = canvas.current;

        canvasEle.width = 568
        canvasEle.height = 213

        let ImageOnSrc = new Image();
        // http://i.picsum.photos/id/119/200/300.jpg?hmac=1NqHBHR5JDtc_FgBO6wYZJYAWBRIPfgNbRoiqVQ5m-k
        // http://media.istockphoto.com/photos/no-better-adventure-buddy-picture-id1265024528
        // /Backoffice/image/banner_file3.jpg
        ImageOnSrc.setAttribute('crossorigin', 'anonymous'); // works for me
        ImageOnSrc.src = message.image
        ImageOnSrc.onload = function () {
            ctx.drawImage(ImageOnSrc, 0, 0, canvasEle.width, canvasEle.height);
            // right center left ชุดข้อความเริ่มจากฝั่งไหน
            writeText({ text: 'E-Coupon', x: 20, y: 15 }, { textAlign: 'left', fontSize: 24, });

            writeText({ text: message.gmm_partner_name, x: 548, y: 15 }, { textAlign: 'right', fontSize: 24, });

            writeText({ text: 'รหัสคูปอง : ' + message.gmm_user_temp_desc02, x: 20, y: 183 }, { textAlign: 'left', fontSize: 16, });

            writeText({ text: 'หมดเขตวันที่ : ' + message.gmm_reward_item_exp, x: 548, y: 183 }, { textAlign: 'right', fontSize: 16, });
        }

        ctx = canvasEle.getContext("2d");

        // eslint-disable-next-line


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
            <canvas id={message.gmm_user_temp_desc02} ref={canvas} style={{ width: '100%', }}></canvas>
        </>
    );
}


