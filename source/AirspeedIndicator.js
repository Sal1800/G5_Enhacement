class ReferenceBug {
}
class AirspeedIndicator extends HTMLElement {
    constructor() {
        super();
        this.trendValue = 0;
        this.redBegin = 0;
        this.redEnd = 0;
        this.greenBegin = 0;
        this.greenEnd = 0;
        this.flapsBegin = 0;
        this.flapsEnd = 0;
        this.yellowBegin = 0;
        this.yellowEnd = 0;
        this.minValue = 0;
        this.maxValue = 0;
        this.currentCenterGrad = 0;
        this.referenceBugs = [];
        this.nocolor = false;
        this.height = 700;
        this.GF_font = 'Montserrat-Bold'; // custom font
        this.refBarWidth = 25; // width of the speed ref bars
        this.endDigitSpace = 70; // last digit vert spacing
    }
    static get observedAttributes() {
        return [
            "airspeed",
            "airspeed-trend",
            "min-speed",
            "green-begin",
            "green-end",
            "flaps-begin",
            "flaps-end",
            "yellow-begin",
            "yellow-end",
            "red-begin",
            "red-end",
            "max-speed",
            "true-airspeed",
            "no-true-airspeed",
            "reference-bugs",
            "display-ref-speed",
            "ref-speed",
            "ref-speed-mach",
            "display-mach",
            "mach-speed",
            "vyse-speed",
            "vmc-speed",
            "ground-airspeed"
        ];
    }
    parseDefinitionAttributes() {
        let height = this.getAttribute("height");
        if (height) {
            this.height = parseFloat(height);
        }
    }
    connectedCallback() {
        this.parseDefinitionAttributes();
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 -50 250 " + this.height);
        this.appendChild(this.root);
        {
            this.airspeedReferenceGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.airspeedReferenceGroup, "class", "airspeed-reference-group");
            this.root.appendChild(this.airspeedReferenceGroup);
            let background = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(background, "class", "background");
            diffAndSetAttribute(background, "x", "0");
            diffAndSetAttribute(background, "y", "-50");
            diffAndSetAttribute(background, "width", "200");
            diffAndSetAttribute(background, "height", "50");
            diffAndSetAttribute(background, "fill", "#1a1d21");
            diffAndSetAttribute(background, "fill-opacity", "1");
            this.airspeedReferenceGroup.appendChild(background);
            this.selectedSpeedFixedBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(this.selectedSpeedFixedBug, "class", "selected-speed-fixed-bug");
            diffAndSetAttribute(this.selectedSpeedFixedBug, "points", "190,-40 180,-40 180,-30 185,-25 180,-20 180,-10 190,-10 ");
            diffAndSetAttribute(this.selectedSpeedFixedBug, "fill", "#36c8d2");
            this.airspeedReferenceGroup.appendChild(this.selectedSpeedFixedBug);
            this.selectedSpeedText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.selectedSpeedText, "class", "selected-speed-text");
            diffAndSetAttribute(this.selectedSpeedText, "x", "20");
            diffAndSetAttribute(this.selectedSpeedText, "y", "-10");
            diffAndSetAttribute(this.selectedSpeedText, "fill", "#36c8d2");
            diffAndSetAttribute(this.selectedSpeedText, "font-size", "45");
            diffAndSetAttribute(this.selectedSpeedText, "font-family", this.GF_font);
            diffAndSetAttribute(this.selectedSpeedText, "text-anchor", "start");
            diffAndSetText(this.selectedSpeedText, "---");
            diffAndSetAttribute(this.selectedSpeedText, "display", "none");
            this.airspeedReferenceGroup.appendChild(this.selectedSpeedText);
            this.selectedSpeedTextMach = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.selectedSpeedTextMach, "class", "selected-speed-text-mach");
            diffAndSetAttribute(this.selectedSpeedTextMach, "x", "20");
            diffAndSetAttribute(this.selectedSpeedTextMach, "y", "-10");
            diffAndSetAttribute(this.selectedSpeedTextMach, "fill", "#36c8d2");
            diffAndSetAttribute(this.selectedSpeedTextMach, "font-size", "45");
            diffAndSetAttribute(this.selectedSpeedTextMach, "font-family", this.GF_font);
            diffAndSetAttribute(this.selectedSpeedTextMach, "text-anchor", "start");
            diffAndSetText(this.selectedSpeedTextMach, "---");
            diffAndSetAttribute(this.selectedSpeedTextMach, "display", "none");
            this.airspeedReferenceGroup.appendChild(this.selectedSpeedTextMach);
        }
        {
            let background = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(background, "class", "background");
            diffAndSetAttribute(background, "x", "0");
            diffAndSetAttribute(background, "y", "-62");
            diffAndSetAttribute(background, "width", "200");
            diffAndSetAttribute(background, "height", (this.height + 50) + '');
            diffAndSetAttribute(background, "fill", "#1a1d21");
            diffAndSetAttribute(background, "fill-opacity", "0.25");
            this.root.appendChild(background);

            // add gradient defs
            const defs = document.createElementNS(Avionics.SVG.NS, "defs");
            const shadowGradient = document.createElementNS(Avionics.SVG.NS, "linearGradient");
            diffAndSetAttribute(shadowGradient, "class", "shadow-gradient");
            shadowGradient.setAttribute("id", "shadowGradient");
            shadowGradient.setAttribute("gradientTransform", "rotate(90)");
            const shadowStop1 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop1.setAttribute("offset", "0%");
            shadowStop1.setAttribute("stop-color", "#000000");
            shadowStop1.setAttribute("stop-opacity", "0.8");
            const shadowStop2 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop2.setAttribute("offset", "10%");
            shadowStop2.setAttribute("stop-color", "#000000");
            shadowStop2.setAttribute("stop-opacity", "0");
            shadowGradient.appendChild(shadowStop1);
            shadowGradient.appendChild(shadowStop2);
            const shadowStop3 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop3.setAttribute("offset", "90%");
            shadowStop3.setAttribute("stop-color", "#000000");
            shadowStop3.setAttribute("stop-opacity", "0");
            const shadowStop4 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop4.setAttribute("offset", "100%");
            shadowStop4.setAttribute("stop-color", "#000000");
            shadowStop4.setAttribute("stop-opacity", "0.8");
            shadowGradient.appendChild(shadowStop3);
            shadowGradient.appendChild(shadowStop4);
            defs.appendChild(shadowGradient);

            const underShadowGradient = document.createElementNS(Avionics.SVG.NS, "linearGradient");
            underShadowGradient.setAttribute("id", "underShadowGradient");
            underShadowGradient.setAttribute("gradientTransform", "rotate(90)");
            const shadowStop5 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop5.setAttribute("offset", "0%");
            shadowStop5.setAttribute("stop-color", "rgb(0,0,0)");
            shadowStop5.setAttribute("stop-opacity", "0.8");
            const shadowStop6 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop6.setAttribute("offset", "100%");
            shadowStop6.setAttribute("stop-color", "rgb(0,0,0)");
            shadowStop6.setAttribute("stop-opacity", "0");
            underShadowGradient.appendChild(shadowStop5);
            underShadowGradient.appendChild(shadowStop6);
            defs.appendChild(underShadowGradient);     


            this.root.appendChild(defs);

            let center = (this.height - 100) / 2;
            this.centerSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.centerSvg, "class", "center-svg");
            diffAndSetAttribute(this.centerSvg, "x", "0");
            diffAndSetAttribute(this.centerSvg, "y", "0");
            diffAndSetAttribute(this.centerSvg, "width", "250");
            diffAndSetAttribute(this.centerSvg, "height", (this.height - 100) + '');
            diffAndSetAttribute(this.centerSvg, "viewBox", "0 0 250 " + (this.height - 100));
            this.root.appendChild(this.centerSvg);
            {
                this.centerGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.centerGroup, "class", "center-group");
                this.centerSvg.appendChild(this.centerGroup);
                {
                    this.gradTexts = [];
                    if (this.getAttribute("NoColor") != "True") {
                        this.redElement = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.redElement, "x", "175");
                        diffAndSetAttribute(this.redElement, "y", "-1");
                        diffAndSetAttribute(this.redElement, "width", this.refBarWidth);
                        diffAndSetAttribute(this.redElement, "height", "0");
                        diffAndSetAttribute(this.redElement, "fill", "red");
                        this.centerGroup.appendChild(this.redElement);
                        this.yellowElement = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.yellowElement, "x", "175");
                        diffAndSetAttribute(this.yellowElement, "y", "-1");
                        diffAndSetAttribute(this.yellowElement, "width", this.refBarWidth);
                        diffAndSetAttribute(this.yellowElement, "height", "0");
                        diffAndSetAttribute(this.yellowElement, "fill", "yellow");
                        this.centerGroup.appendChild(this.yellowElement);
                        this.greenElement = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.greenElement, "x", "175");
                        diffAndSetAttribute(this.greenElement, "y", "-1");
                        diffAndSetAttribute(this.greenElement, "width", this.refBarWidth);
                        diffAndSetAttribute(this.greenElement, "height", "0");
                        diffAndSetAttribute(this.greenElement, "fill", "green");
                        this.centerGroup.appendChild(this.greenElement);
                        this.flapsElement = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.flapsElement, "x", "187.5");
                        diffAndSetAttribute(this.flapsElement, "y", "-1");
                        diffAndSetAttribute(this.flapsElement, "width", this.refBarWidth/2);
                        diffAndSetAttribute(this.flapsElement, "height", "0");
                        diffAndSetAttribute(this.flapsElement, "fill", "white");
                        this.centerGroup.appendChild(this.flapsElement);
                        let dashSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                        diffAndSetAttribute(dashSvg, "id", "DASH");
                        diffAndSetAttribute(dashSvg, "x", "175");
                        diffAndSetAttribute(dashSvg, "y", "0");
                        diffAndSetAttribute(dashSvg, "width", this.refBarWidth);
                        diffAndSetAttribute(dashSvg, "height", (this.height - 100) + '');
                        diffAndSetAttribute(dashSvg, "viewBox", "0 0 25 " + (this.height - 100));
                        this.root.appendChild(dashSvg);
                        this.startElement = document.createElementNS(Avionics.SVG.NS, "g");
                        dashSvg.appendChild(this.startElement);
                        let startBg = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(startBg, "x", "0");
                        diffAndSetAttribute(startBg, "y", (-(this.height + 200)) + '');
                        diffAndSetAttribute(startBg, "width", this.refBarWidth);
                        diffAndSetAttribute(startBg, "height", (this.height + 100) + '');
                        diffAndSetAttribute(startBg, "fill", "white");
                        this.startElement.appendChild(startBg);
                        for (let i = 0; i < (Math.round((this.height + 100) / 25) - 1); i++) {
                            let redLine = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(redLine, "x", "0");
                            diffAndSetAttribute(redLine, "y", (-125 - 25 * i) + '');
                            diffAndSetAttribute(redLine, "width", this.refBarWidth);
                            diffAndSetAttribute(redLine, "height", this.refBarWidth/2);
                            diffAndSetAttribute(redLine, "transform", "skewY(-30)");
                            diffAndSetAttribute(redLine, "fill", "red");
                            this.startElement.appendChild(redLine);
                        }
                        this.endElement = document.createElementNS(Avionics.SVG.NS, "g");
                        dashSvg.appendChild(this.endElement);
                        let endBg = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(endBg, "x", "0");
                        diffAndSetAttribute(endBg, "y", (-(this.height + 200)) + '');
                        diffAndSetAttribute(endBg, "width", this.refBarWidth);
                        diffAndSetAttribute(endBg, "height", (this.height + 100) + '');
                        diffAndSetAttribute(endBg, "fill", "white");
                        this.endElement.appendChild(endBg);
                        for (let i = 0; i < (Math.round((this.height + 100) / 25) - 1); i++) {
                            let redLine = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(redLine, "x", "0");
                            diffAndSetAttribute(redLine, "y", (-125 - 25 * i) + '');
                            diffAndSetAttribute(redLine, "width", this.refBarWidth);
                            diffAndSetAttribute(redLine, "height", "12.5");
                            diffAndSetAttribute(redLine, "transform", "skewY(-30)");
                            diffAndSetAttribute(redLine, "fill", "red");
                            this.endElement.appendChild(redLine);
                        }
                        this.vyseElement = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.vyseElement.id = "vyse-pointer";
                        diffAndSetAttribute(this.vyseElement, "x", "170");
                        diffAndSetAttribute(this.vyseElement, "y", "-1");
                        diffAndSetAttribute(this.vyseElement, "width", "40");
                        diffAndSetAttribute(this.vyseElement, "height", "8");
                        diffAndSetAttribute(this.vyseElement, "fill", "cyan");
                        this.centerGroup.appendChild(this.vyseElement);
                        this.vmcElement = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.vmcElement.id = "vmc-pointer";
                        diffAndSetAttribute(this.vmcElement, "x", "170");
                        diffAndSetAttribute(this.vmcElement, "y", "-1");
                        diffAndSetAttribute(this.vmcElement, "width", "40");
                        diffAndSetAttribute(this.vmcElement, "height", "8");
                        diffAndSetAttribute(this.vmcElement, "fill", "red");
                        this.centerGroup.appendChild(this.vmcElement);
                    }
                    else {
                        this.nocolor = true;
                    }
                    for (let i = -4; i <= 4; i++) {
                        let grad = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(grad, "x", "150");
                        diffAndSetAttribute(grad, "y", (center - 2 + 100 * i) + '');
                        diffAndSetAttribute(grad, "height", "4");
                        diffAndSetAttribute(grad, "width", "50");
                        diffAndSetAttribute(grad, "fill", "white");
                        this.centerGroup.appendChild(grad);
                        if (i != 0) {
                            let halfGrad = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(halfGrad, "x", "175");
                            diffAndSetAttribute(halfGrad, "y", (center - 2 + 100 * i + (i < 0 ? 50 : -50)) + '');
                            diffAndSetAttribute(halfGrad, "height", "4");
                            diffAndSetAttribute(halfGrad, "width", "25");
                            diffAndSetAttribute(halfGrad, "fill", "white");
                            this.centerGroup.appendChild(halfGrad);
                        }
                        let gradText = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(gradText, "x", "140");
                        diffAndSetAttribute(gradText, "y", (center + 20 + 100 * i) + '');
                        diffAndSetAttribute(gradText, "fill", "white");
                        diffAndSetAttribute(gradText, "font-size", "50");
                        diffAndSetAttribute(gradText, "text-anchor", "end");
                        diffAndSetAttribute(gradText, "font-family", this.GF_font);
                        diffAndSetAttribute(gradText, "letter-spacing", "8");
                        diffAndSetText(gradText, "XXX");
                        this.gradTexts.push(gradText);
                        this.centerGroup.appendChild(gradText);
                    }
                    this.selectedSpeedBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                    diffAndSetAttribute(this.selectedSpeedBug, "class", "selected-speed-bug");
                    diffAndSetAttribute(this.selectedSpeedBug, "points", "200, " + (center - 20) + " 180, " + (center - 20) + " 180, " + (center - 15) + " 190, " + center + " 180, " + (center + 15) + " 180, " + (center + 20) + " 200, " + (center + 20));
                    diffAndSetAttribute(this.selectedSpeedBug, "fill", "#36c8d2");
                    this.centerSvg.appendChild(this.selectedSpeedBug);
                }
                this.cursor = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.cursor, "class", "cursor");
                diffAndSetAttribute(this.cursor, "points", "205," + center + " 180," + (center - 20) + " 180," + (center - 100) + " 120," + (center - 100) + " 120," + (center - 40) + " 10," + (center - 40) + " 10," + (center + 40) + " 120," + (center + 40) + " 120," + (center + 100) + " 180," + (center + 100) + " 180," + (center + 40) + " 180," + (center + 20));
                diffAndSetAttribute(this.cursor, "fill", "#1a1d21");
                diffAndSetAttribute(this.cursor, "stroke", "white");
                diffAndSetAttribute(this.cursor, "stroke-width", "3");
                this.root.appendChild(this.cursor);
                this.trendElement = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.trendElement, "class", "trend-element");
                diffAndSetAttribute(this.trendElement, "x", "200");
                diffAndSetAttribute(this.trendElement, "y", "-1");
                diffAndSetAttribute(this.trendElement, "width", "8");
                diffAndSetAttribute(this.trendElement, "height", "0");
                diffAndSetAttribute(this.trendElement, "fill", "#d12bc7");
                this.root.appendChild(this.trendElement);
                let baseCursorSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(baseCursorSvg, "class", "base-cursor-svg");
                diffAndSetAttribute(baseCursorSvg, "x", "0");
                diffAndSetAttribute(baseCursorSvg, "y", (center - 39) + '');
                diffAndSetAttribute(baseCursorSvg, "width", "120");
                diffAndSetAttribute(baseCursorSvg, "height", "75");
                diffAndSetAttribute(baseCursorSvg, "viewBox", "0 0 75 75");
                this.root.appendChild(baseCursorSvg);
                {
                    this.digit1Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.digit1Top, "x", "10");
                    diffAndSetAttribute(this.digit1Top, "y", "-1");
                    diffAndSetAttribute(this.digit1Top, "fill", "white");
                    diffAndSetAttribute(this.digit1Top, "font-size", "64");
                    diffAndSetAttribute(this.digit1Top, "font-family", this.GF_font);
                    diffAndSetText(this.digit1Top, "-");
                    baseCursorSvg.appendChild(this.digit1Top);
                    this.digit1Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.digit1Bot, "x", "10");
                    diffAndSetAttribute(this.digit1Bot, "y", "62");
                    diffAndSetAttribute(this.digit1Bot, "fill", "white");
                    diffAndSetAttribute(this.digit1Bot, "font-size", "64");
                    diffAndSetAttribute(this.digit1Bot, "font-family", this.GF_font);
                    diffAndSetText(this.digit1Bot, "-");
                    baseCursorSvg.appendChild(this.digit1Bot);
                    this.digit2Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.digit2Top, "x", "54");
                    diffAndSetAttribute(this.digit2Top, "y", "-1");
                    diffAndSetAttribute(this.digit2Top, "fill", "white");
                    diffAndSetAttribute(this.digit2Top, "font-size", "64");
                    diffAndSetAttribute(this.digit2Top, "font-family", this.GF_font);
                    diffAndSetText(this.digit2Top, "-");
                    baseCursorSvg.appendChild(this.digit2Top);
                    this.digit2Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.digit2Bot, "x", "54");
                    diffAndSetAttribute(this.digit2Bot, "y", "62");
                    diffAndSetAttribute(this.digit2Bot, "fill", "white");
                    diffAndSetAttribute(this.digit2Bot, "font-size", "64");
                    diffAndSetAttribute(this.digit2Bot, "font-family", this.GF_font);
                    diffAndSetText(this.digit2Bot, "-");
                    baseCursorSvg.appendChild(this.digit2Bot);
                }
                let rotatingCursorSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(rotatingCursorSvg, "class", "rotating-cursor-svg");
                diffAndSetAttribute(rotatingCursorSvg, "x", "122");
                diffAndSetAttribute(rotatingCursorSvg, "y", (center - 100) + '');
                diffAndSetAttribute(rotatingCursorSvg, "width", "70");
                diffAndSetAttribute(rotatingCursorSvg, "height", "200");
                diffAndSetAttribute(rotatingCursorSvg, "viewBox", "0 -100 50 200");
                this.root.appendChild(rotatingCursorSvg);
                {
                    this.endDigitsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    rotatingCursorSvg.appendChild(this.endDigitsGroup);
                    this.endDigits = [];
                    for (let i = -2; i <= 2; i++) {
                        let digit = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(digit, "x", "0");
                        diffAndSetAttribute(digit, "y", (15 + this.endDigitSpace * i) + '');
                        diffAndSetAttribute(digit, "fill", "white");
                        diffAndSetAttribute(digit, "font-size", "58");
                        diffAndSetAttribute(digit, "font-family", this.GF_font);
                        diffAndSetText(digit, i == 0 ? "-" : " ");
                        this.endDigits.push(digit);
                        this.endDigitsGroup.appendChild(digit);
                    }
                }
            }
            {
                // add speed display shadow rect
                const shadowRect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(shadowRect, "class", "rotating-cursor-shadow");
                shadowRect.setAttribute('fill', 'url(#shadowGradient)');
                shadowRect.setAttribute('x', '120');
                shadowRect.setAttribute('y', center - 98 + '');
                shadowRect.setAttribute('width', '60');
                shadowRect.setAttribute('height', '198');
                this.root.appendChild(shadowRect);
            }
        }
        {
            const underShadow = document.createElementNS(Avionics.SVG.NS, "rect");
            underShadow.setAttribute("class", "under-shadow");
            underShadow.setAttribute('fill', 'url(#underShadowGradient)');
            underShadow.setAttribute('x', '0');
            underShadow.setAttribute('y', '-50');  
            underShadow.setAttribute('width', this.compactVs ? "320" : "200");
            underShadow.setAttribute('height', '30');
            this.root.appendChild(underShadow);    

        }
        {
            this.tasBackground = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.tasBackground, "class", "tas-background");
            diffAndSetAttribute(this.tasBackground, "x", "0");
            diffAndSetAttribute(this.tasBackground, "y", (this.height - 105) + '');
            diffAndSetAttribute(this.tasBackground, "width", "200");
            diffAndSetAttribute(this.tasBackground, "height", "60");
            diffAndSetAttribute(this.tasBackground, "fill", "#1a1d21");
			diffAndSetAttribute(this.tasBackground, "stroke", "white");  // added stroke
			diffAndSetAttribute(this.tasBackground, "stroke-width", "2"); 
            this.root.appendChild(this.tasBackground);
            this.tasTasText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.tasTasText, "class", "tas-tas-text");
            diffAndSetAttribute(this.tasTasText, "x", "5");
            diffAndSetAttribute(this.tasTasText, "y", (this.height - 100 + 38) + '');
            diffAndSetAttribute(this.tasTasText, "fill", "white");
            diffAndSetAttribute(this.tasTasText, "font-size", "35");
            diffAndSetAttribute(this.tasTasText, "font-family", this.GF_font);
            diffAndSetAttribute(this.tasTasText, "text-anchor", "start");
            diffAndSetText(this.tasTasText, "TAS");
            diffAndSetAttribute(this.tasTasText, "display", "none");
            this.root.appendChild(this.tasTasText);
            this.tasText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.tasText, "class", "tas-text");
            diffAndSetAttribute(this.tasText, "x", "195");
            diffAndSetAttribute(this.tasText, "y", (this.height - 100 + 38) + '');
            diffAndSetAttribute(this.tasText, "fill", "white");
            diffAndSetAttribute(this.tasText, "font-size", "35");
            diffAndSetAttribute(this.tasText, "font-family", this.GF_font);
            diffAndSetAttribute(this.tasText, "text-anchor", "end");
            diffAndSetText(this.tasText, "0KT");
            diffAndSetAttribute(this.tasText, "display", "none");
            this.root.appendChild(this.tasText);
            this.machText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.machText, "class", "mach-text");
            diffAndSetAttribute(this.machText, "x", "195");
            diffAndSetAttribute(this.machText, "y", (this.height - 100 + 38) + '');
            diffAndSetAttribute(this.machText, "fill", "white");
            diffAndSetAttribute(this.machText, "font-size", "35");
            diffAndSetAttribute(this.machText, "font-family", this.GF_font);
            diffAndSetAttribute(this.machText, "text-anchor", "end");
            diffAndSetText(this.machText, "M .000");
            diffAndSetAttribute(this.machText, "display", "none");
            this.root.appendChild(this.machText);
            this.tasGsText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.tasGsText, "class", "tas-gs-text");
            diffAndSetAttribute(this.tasGsText, "x", "5");
            diffAndSetAttribute(this.tasGsText, "y", (this.height - 100 + 38) + '');
            diffAndSetAttribute(this.tasGsText, "fill", "white");
            diffAndSetAttribute(this.tasGsText, "font-size", "32");
            diffAndSetAttribute(this.tasGsText, "font-family", this.GF_font);
            diffAndSetAttribute(this.tasGsText, "text-anchor", "start");
            diffAndSetText(this.tasGsText, "GS");
            this.root.appendChild(this.tasGsText);
            this.GSText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.GSText, "class", "gs-text");
            diffAndSetAttribute(this.GSText, "x", "195");
            diffAndSetAttribute(this.GSText, "y", (this.height - 100 + 38) + '');
            diffAndSetAttribute(this.GSText, "fill", "magenta");
            diffAndSetAttribute(this.GSText, "font-size", "38");
            diffAndSetAttribute(this.GSText, "font-family", this.GF_font);
            diffAndSetAttribute(this.GSText, "text-anchor", "end");
            diffAndSetText(this.GSText, "0KT");
            this.root.appendChild(this.GSText);

        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        let centerY = (this.height - 100) / 2;
        switch (name) {
            case "airspeed":
                this.value = Math.max(parseFloat(newValue), 20);
                let center = Math.max(Math.round(this.value / 10) * 10, 60);
                if (!this.nocolor && ((this.minValue > 0) && (this.value < this.minValue)) || ((this.maxValue > 0) && (this.value > this.maxValue))) {
                    diffAndSetAttribute(this.cursor, "fill", "red");
                    diffAndSetAttribute(this.bottomBackground, "fill", "red");
                }
                else {
                    diffAndSetAttribute(this.cursor, "fill", "#1a1d21");
                    diffAndSetAttribute(this.bottomBackground, "fill", "#1a1d21");
                }
                
                diffAndSetAttribute(this.centerGroup, "transform", "translate(0, " + ((this.value - center) * 10) + ")");
                if (!this.nocolor) {
                    if (this.minValue > 0) {
                        let val = (this.height + 200) + ((center - this.minValue + ((this.height - 100) / 20)) * 10) + ((this.value - center) * 10);
                        diffAndSetAttribute(this.startElement, "transform", "translate(0," + val + ")");
                    }
                    if (this.maxValue > 0) {
                        let val = 100 + Utils.Clamp(((center - this.maxValue + ((this.height - 100) / 20)) * 10), -100, (this.height + 100)) + ((this.value - center) * 10);
                        diffAndSetAttribute(this.endElement, "transform", "translate(0," + val + ")");
                    }
                }
                for (let i = 0; i < this.referenceBugs.length; i++) {
                    diffAndSetAttribute(this.referenceBugs[i].group, "transform", "translate(0," + ((this.value - this.referenceBugs[i].value) * 10) + ")");
                }
                diffAndSetAttribute(this.selectedSpeedBug, "transform", "translate(0," + ((this.value - this.selectedSpeedBugValue) * 10) + ")");
                if (this.currentCenterGrad != center) {
                    this.currentCenterGrad = center;
                    for (let i = 0; i < this.gradTexts.length; i++) {
                        diffAndSetText(this.gradTexts[i], fastToFixed(((4 - i) * 10) + center, 0));
                    }
                    if (!this.nocolor) {
                        let greenEnd = Math.min(Math.max(-100, (centerY + (-10 * (this.greenEnd - center)))), this.height);
                        let greenBegin = Math.min(Math.max(-100, (centerY + (-10 * (this.greenBegin - center)))), this.height);
                        diffAndSetAttribute(this.greenElement, "y", greenEnd + '');
                        diffAndSetAttribute(this.greenElement, "height", (greenBegin - greenEnd) + '');
                        let yellowEnd = Math.min(Math.max(-100, (centerY + (-10 * (this.yellowEnd - center)))), this.height);
                        let yellowBegin = Math.min(Math.max(-100, (centerY + (-10 * (this.yellowBegin - center)))), this.height);
                        diffAndSetAttribute(this.yellowElement, "y", yellowEnd + '');
                        diffAndSetAttribute(this.yellowElement, "height", (yellowBegin - yellowEnd) + '');
                        let redEnd = Math.min(Math.max(-100, (centerY + (-10 * (this.redEnd - center)))), this.height);
                        let redBegin = Math.min(Math.max(-100, (centerY + (-10 * (this.redBegin - center)))), this.height);
                        diffAndSetAttribute(this.redElement, "y", redEnd + '');
                        diffAndSetAttribute(this.redElement, "height", (redBegin - redEnd) + '');
                        let flapsEnd = Math.min(Math.max(-100, (centerY + (-10 * (this.flapsEnd - center)))), this.height);
                        let flapsBegin = Math.min(Math.max(-100, (centerY + (-10 * (this.flapsBegin - center)))), this.height);
                        diffAndSetAttribute(this.flapsElement, "y", flapsEnd + '');
                        diffAndSetAttribute(this.flapsElement, "height", (flapsBegin - flapsEnd) + '');
                        if (this.vyseValue > 10) {
                            let vyseEnd = Math.min(Math.max(-100, (centerY + (-10 * (this.vyseValue - center)))) - 4, this.height);
                            diffAndSetAttribute(this.vyseElement, "y", vyseEnd.toFixed(0));
                        }
                        if (this.vmcValue > 10) {
                            let vmcEnd = Math.min(Math.max(-100, (centerY + (-10 * (this.vmcValue - center)))) - 4, this.height);
                            diffAndSetAttribute(this.vmcElement, "y", vmcEnd.toFixed(0));
                        }
                    }
                }
                let endValue = this.value % 10;
                let endCenter = Math.round(endValue);
                diffAndSetAttribute(this.endDigitsGroup, "transform", "translate(0, " + ((endValue - endCenter) * this.endDigitSpace) + ")");
                for (let i = 0; i < this.endDigits.length; i++) {
                    if (this.value == 20) {
                        diffAndSetText(this.endDigits[i], (i == 2 ? "-" : " "));
                    }
                    else {
                        let digitValue = (2 - i + endCenter);
                        diffAndSetText(this.endDigits[i], fastToFixed((10 + digitValue) % 10, 0));
                    }
                }
                if (this.value > 20) {
                    let d2Value = (Math.abs(this.value) % 100) / 10;
                    diffAndSetText(this.digit2Bot, fastToFixed(Math.floor(d2Value), 0));
                    diffAndSetText(this.digit2Top, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                    if (endValue > 9) {
                        let translate = (endValue - 9) * 55;
                        diffAndSetAttribute(this.digit2Bot, "transform", "translate(0, " + translate + ")");
                        diffAndSetAttribute(this.digit2Top, "transform", "translate(0, " + translate + ")");
                    }
                    else {
                        diffAndSetAttribute(this.digit2Bot, "transform", "");
                        diffAndSetAttribute(this.digit2Top, "transform", "");
                    }
                    if (Math.abs(this.value) >= 99) {
                        let d1Value = (Math.abs(this.value) % 1000) / 100;
                        diffAndSetText(this.digit1Bot, Math.abs(this.value) < 100 ? "" : fastToFixed(Math.floor(d1Value), 0));
                        diffAndSetText(this.digit1Top, fastToFixed((Math.floor(d1Value) + 1) % 10, 0));
                        if (endValue > 9 && d2Value > 9) {
                            let translate = (endValue - 9) * 55;
                            diffAndSetAttribute(this.digit1Bot, "transform", "translate(0, " + translate + ")");
                            diffAndSetAttribute(this.digit1Top, "transform", "translate(0, " + translate + ")");
                        }
                        else {
                            diffAndSetAttribute(this.digit1Bot, "transform", "");
                            diffAndSetAttribute(this.digit1Top, "transform", "");
                        }
                    }
                    else {
                        diffAndSetText(this.digit1Bot, "");
                        diffAndSetText(this.digit1Top, "");
                    }
                }
                else {
                    diffAndSetText(this.digit2Bot, "-");
                    diffAndSetText(this.digit1Bot, "-");
                    diffAndSetAttribute(this.digit1Bot, "transform", "");
                    diffAndSetAttribute(this.digit1Top, "transform", "");
                    diffAndSetAttribute(this.digit2Bot, "transform", "");
                    diffAndSetAttribute(this.digit2Top, "transform", "");
                }
                break;
            case "airspeed-trend":
                this.trendValue = Math.min(Math.max(centerY + parseFloat(newValue) * 6 * -10, 0), (this.height - 100));
                diffAndSetAttribute(this.trendElement, "y", Math.min(this.trendValue, centerY) + '');
                diffAndSetAttribute(this.trendElement, "height", Math.abs(this.trendValue - centerY) + '');
                break;
            case "min-speed":
                this.minValue = parseFloat(newValue);
                break;
            case "green-begin":
                this.greenBegin = parseFloat(newValue);
                break;
            case "green-end":
                this.greenEnd = parseFloat(newValue);
                break;
            case "yellow-begin":
                this.yellowBegin = parseFloat(newValue);
                break;
            case "yellow-end":
                this.yellowEnd = parseFloat(newValue);
                break;
            case "flaps-begin":
                this.flapsBegin = parseFloat(newValue);
                break;
            case "flaps-end":
                this.flapsEnd = parseFloat(newValue);
                break;
            case "red-begin":
                this.redBegin = parseFloat(newValue);
                break;
            case "red-end":
                this.redEnd = parseFloat(newValue);
                break;
            case "max-speed":
                this.maxValue = parseFloat(newValue);
                break;
            case "true-airspeed":
                diffAndSetText(this.tasText, fastToFixed(parseFloat(newValue), 0) + "KT");
                break; 
            case "ground-airspeed":
                diffAndSetText(this.GSText, fastToFixed(parseFloat(newValue), 0) + "KT");
                break;                               
            case "no-true-airspeed":
                if (newValue == "true") {
                    diffAndSetAttribute(this.tasText, "visibility", "hidden");
                    diffAndSetAttribute(this.tasBackground, "visibility", "hidden");
                    diffAndSetAttribute(this.tasTasText, "visibility", "hidden");
                }
                break;
            case "reference-bugs":
                let elements;
                if (newValue != "") {
                    elements = newValue.split(";");
                }
                else {
                    elements = [];
                }
                for (let i = 0; i < elements.length; i++) {
                    if (i >= this.referenceBugs.length) {
                        let newRef = new ReferenceBug();
                        newRef.group = document.createElementNS(Avionics.SVG.NS, "g");
                        this.centerSvg.appendChild(newRef.group);
                        newRef.bug = document.createElementNS(Avionics.SVG.NS, "polygon");
                        diffAndSetAttribute(newRef.bug, "points", "200,300 210,315 250,315 250,285 210,285");
                        diffAndSetAttribute(newRef.bug, "fill", "#1a1d21");
                        newRef.group.appendChild(newRef.bug);
                        newRef.text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(newRef.text, "fill", "aqua");
                        diffAndSetAttribute(newRef.text, "x", "230");
                        diffAndSetAttribute(newRef.text, "y", "310");
                        diffAndSetAttribute(newRef.text, "font-size", "25");
                        diffAndSetAttribute(newRef.text, "text-anchor", "middle");
                        diffAndSetAttribute(newRef.text, "font-family", this.GF_font);
                        newRef.group.appendChild(newRef.text);
                        this.referenceBugs.push(newRef);
                    }
                    let values = elements[i].split(':');
                    this.referenceBugs[i].value = parseFloat(values[1]);
                    diffAndSetText(this.referenceBugs[i].text, values[0]);
                    diffAndSetAttribute(this.referenceBugs[i].group, "transform", "translate(0," + ((this.value - this.referenceBugs[i].value) * 10) + ")");
                    diffAndSetAttribute(this.referenceBugs[i].group, "display", "");
                }
                for (let i = elements.length; i < this.referenceBugs.length; i++) {
                    diffAndSetAttribute(this.referenceBugs[i].group, "display", "none");
                }
                break;
            case "display-ref-speed":
                if (newValue == "True" || newValue == "Mach") {
                    diffAndSetAttribute(this.airspeedReferenceGroup, "display", "");
                    diffAndSetAttribute(this.selectedSpeedBug, "display", "");
                    if (newValue == "True") {
                        diffAndSetAttribute(this.selectedSpeedTextMach, "display", "none");
                        diffAndSetAttribute(this.selectedSpeedText, "display", "");
                    }
                    else if (newValue == "Mach") {
                        diffAndSetAttribute(this.selectedSpeedTextMach, "display", "");
                        diffAndSetAttribute(this.selectedSpeedText, "display", "none");
                    }
                }
                else {
                    diffAndSetAttribute(this.airspeedReferenceGroup, "display", "none");
                    diffAndSetAttribute(this.selectedSpeedBug, "display", "none");
                }
                break;
            case "ref-speed":
                this.selectedSpeedBugValue = parseFloat(newValue);
                diffAndSetText(this.selectedSpeedText, newValue);
                break;
            case "ref-speed-mach":
                diffAndSetText(this.selectedSpeedTextMach, newValue);
                break;
            case "display-mach":
                if (newValue == "True") {
                    diffAndSetAttribute(this.machText, "display", "");
                    diffAndSetAttribute(this.tasTasText, "display", "none");
                    diffAndSetAttribute(this.tasText, "display", "none");
                }
                else {
                    diffAndSetAttribute(this.machText, "display", "none");
                    diffAndSetAttribute(this.tasTasText, "display", "");
                    diffAndSetAttribute(this.tasText, "display", "");
                }
                break;
            case "mach-speed":
                diffAndSetText(this.machText, newValue);
                break;
            case "vyse-speed":
                this.vyseValue = parseFloat(newValue);
                break;
            case "vmc-speed":
                this.vmcValue = parseFloat(newValue);
                break;
        }
    }
}
customElements.define('glasscockpit-airspeed-indicator', AirspeedIndicator);
//# sourceMappingURL=AirspeedIndicator.js.map