---
emoji: 📽️
title: "Yet Another World’s Worst Video Card"
image: "video_card.png"
release: 2022
description: A simple research project based on Ben Eater’s video series about building a video card on breadboards. In this project, I reduced the memory usage by only having 1-bit images.
short-description: Creating a video card from scratch.
remarkable: true
banner: GraphicsCard.png
gallery:
  - type: image
    link: "video-card/1.jpg"
  - type: image
    link: "video-card/2.jpg"
  - type: image
    link: "video-card/3.jpg"
  - type: image
    link: "video-card/4.jpg"
  - type: image
    link: "video-card/5.jpg"
  - type: image
    link: "video-card/6.jpg"
  - type: image
    link: "video-card/7.jpg"
tools:
 - "Kicad.png"
 - "Arduino.png"
download:
  - img: "Hackaday.png"
    link: https://hackaday.io/project/186465-yet-another-worlds-worst-video-card
layout: research
---

I once stumbled across with Ben Eater's "[World's Worst Video Card](https://www.youtube.com/watch?v=l7rce6IQDWs/){:target="_blank"}" video. When I saw his implementation with a 6502 computer, I thought that by reducing the memory use I could use a dual port SRAM and skip all the video card's cycle stealing.

So, this is what I did, a 1-bit sequel to the World's Worst Video Card that nobody asked for.

The video card uses a 4kB dual port SRAM, a 25.175MHz oscillator downclocked to 6.29375MHz by a counter and has been tested using an Arduino Mega. In this version I generate an image with the size of 160x120px (A sixteenth part of 640x480).

## Languages

> English
