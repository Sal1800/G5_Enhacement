class Altimeter extends HTMLElement {
    constructor() {
        super();
        this.currentCenterGrad = -10000;
        this.minimumAltitude = NaN;
        this.compactVs = false;
        this.height = 700;
        this.GF_font = 'Montserrat-Bold';
        this.endDigitSpace = 60; // last digit vert spacing
    }
    static get observedAttributes() {
        return [
            "altitude",
            "radar-altitude",
            "reference-altitude",
            "no-reference-altitude",
            "minimum-altitude",
            "minimum-altitude-state",
            "pressure",
            "no-pressure",
            "vspeed",
            "reference-vspeed",
            "vertical-deviation-mode",
            "vertical-deviation-value",
            "selected-altitude-alert"
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
        let vsStyle = this.getAttribute("VSStyle");
        if (!vsStyle) {
            vsStyle = "Default";
        }
        else if (vsStyle == "Compact") {
            this.compactVs = true;
        }
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "id", "AltimeterRoot");
        diffAndSetAttribute(this.root, "viewBox", "-55 -100 " + (this.compactVs ? 300 : 380) + " " + this.height);
        this.appendChild(this.root);
        let centerY = this.height / 2 - 100;
        {
            this.verticalDeviationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.verticalDeviationGroup, "class", "vertical-deviation-group");
            diffAndSetAttribute(this.verticalDeviationGroup, "visibility", "hidden");
            this.root.appendChild(this.verticalDeviationGroup);
            let background = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(background, "class", "vertical-deviation-background");
            diffAndSetAttribute(background, "x", "-50");
            diffAndSetAttribute(background, "y", (centerY - 200) + '');
            diffAndSetAttribute(background, "width", "50");
            diffAndSetAttribute(background, "height", "400");
            diffAndSetAttribute(background, "fill", "#1a1d21");
            diffAndSetAttribute(background, "fill-opacity", "0.25");
            this.verticalDeviationGroup.appendChild(background);
            let topBackground = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(topBackground, "class", "vertical-deviation-top-background");
            diffAndSetAttribute(topBackground, "x", "-50");
            diffAndSetAttribute(topBackground, "y", (centerY - 250) + '');
            diffAndSetAttribute(topBackground, "width", "50");
            diffAndSetAttribute(topBackground, "height", "50");
            diffAndSetAttribute(topBackground, "fill", "#1a1d21");
            this.verticalDeviationGroup.appendChild(topBackground);
            this.verticalDeviationText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.verticalDeviationText, "x", "-25");
            diffAndSetAttribute(this.verticalDeviationText, "y", (centerY - 210) + '');
            diffAndSetAttribute(this.verticalDeviationText, "fill", "#d12bc7");
            diffAndSetAttribute(this.verticalDeviationText, "font-size", "45");
            diffAndSetAttribute(this.verticalDeviationText, "font-family", this.GF_font);
            diffAndSetAttribute(this.verticalDeviationText, "text-anchor", "middle");
            diffAndSetText(this.verticalDeviationText, "V");
            this.verticalDeviationGroup.appendChild(this.verticalDeviationText);
            for (let i = -2; i <= 2; i++) {
                if (i != 0) {
                    let grad = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(grad, "class", "vertical-deviation-grad");
                    diffAndSetAttribute(grad, "cx", "-25");
                    diffAndSetAttribute(grad, "cy", (centerY + 66 * i) + '');
                    diffAndSetAttribute(grad, "r", "6");
                    diffAndSetAttribute(grad, "stroke", "white");
                    diffAndSetAttribute(grad, "stroke-width", "3");
                    diffAndSetAttribute(grad, "fill-opacity", "0");
                    this.verticalDeviationGroup.appendChild(grad);
                }
            }
            this.chevronBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(this.chevronBug, "class", "vertical-deviation-chevron-bug");
            diffAndSetAttribute(this.chevronBug, "points", "-45," + centerY + " -10," + (centerY - 20) + " -10," + (centerY - 10) + " -25," + centerY + " -10," + (centerY + 10) + " -10," + (centerY + 20));
            diffAndSetAttribute(this.chevronBug, "fill", "#d12bc7");
            this.verticalDeviationGroup.appendChild(this.chevronBug);
            this.diamondBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(this.diamondBug, "class", "vertical-deviation-diamond-bug");
            diffAndSetAttribute(this.diamondBug, "points", "-40," + centerY + " -25," + (centerY - 15) + " -10," + centerY + " -25," + (centerY + 15));
            diffAndSetAttribute(this.diamondBug, "fill", "#10c210");
            this.verticalDeviationGroup.appendChild(this.diamondBug);
            this.hollowDiamondBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(this.hollowDiamondBug, "class", "vertical-deviation-hollow-diamond-bug");
            diffAndSetAttribute(this.hollowDiamondBug, "points", "-40," + centerY + " -25," + (centerY - 15) + " -10," + centerY + " -25," + (centerY + 15) + " -25," + (centerY + 5) + " -20," + centerY + " -25," + (centerY - 5) + " -30," + centerY + " -25," + (centerY + 5) + " -25," + (centerY + 15));
            diffAndSetAttribute(this.hollowDiamondBug, "fill", "#DFDFDF");
            this.verticalDeviationGroup.appendChild(this.hollowDiamondBug);
        }

        {
            let background = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(background, "class", "background");
            diffAndSetAttribute(background, "x", "0");
            diffAndSetAttribute(background, "y", "-50");
            diffAndSetAttribute(background, "width", "350");
            diffAndSetAttribute(background, "height", (this.height - 100) + '');
            diffAndSetAttribute(background, "fill", "#1a1d21");
            diffAndSetAttribute(background, "fill-opacity", "0.25");
            this.root.appendChild(background);

            // add gradient refs
            const defs = document.createElementNS(Avionics.SVG.NS, "defs");
            const altshadowGradient = document.createElementNS(Avionics.SVG.NS, "linearGradient");
            altshadowGradient.setAttribute("id", "altshadowGradient");
            altshadowGradient.setAttribute("gradientTransform", "rotate(90)");
            const shadowStop1 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop1.setAttribute("offset", "0%");
            shadowStop1.setAttribute("stop-color", "rgb(0,0,0)");
            shadowStop1.setAttribute("stop-opacity", "0.8");
            const shadowStop2 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop2.setAttribute("offset", "15%");
            shadowStop2.setAttribute("stop-color", "rgb(0,0,0)");
            shadowStop2.setAttribute("stop-opacity", "0");
            altshadowGradient.appendChild(shadowStop1);
            altshadowGradient.appendChild(shadowStop2);
            const shadowStop3 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop3.setAttribute("offset", "85%");
            shadowStop3.setAttribute("stop-color", "rgb(0,0,0)");
            shadowStop3.setAttribute("stop-opacity", "0");
            const shadowStop4 = document.createElementNS(Avionics.SVG.NS, "stop");
            shadowStop4.setAttribute("offset", "100%");
            shadowStop4.setAttribute("stop-color", "rgb(0,0,0)");
            shadowStop4.setAttribute("stop-opacity", "0.8");
            altshadowGradient.appendChild(shadowStop3);
            altshadowGradient.appendChild(shadowStop4);
            defs.appendChild(altshadowGradient);

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


            let graduationSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(graduationSvg, "id", "GraduationSvg");
            diffAndSetAttribute(graduationSvg, "x", "0");
            diffAndSetAttribute(graduationSvg, "y", "-50");
            diffAndSetAttribute(graduationSvg, "width", "226");
            diffAndSetAttribute(graduationSvg, "height", (this.height - 100) + '');
            diffAndSetAttribute(graduationSvg, "viewBox", "0 0 226 " + (this.height - 100));
            this.root.appendChild(graduationSvg);
            let center = (this.height - 100) / 2;
            this.graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.graduationGroup, "class", "graduation-group");
            graduationSvg.appendChild(this.graduationGroup);
            {
                let graduationSize = 160;
                this.graduationTexts = [];
                let n = Math.ceil((this.height - 100) / 200);
                for (let i = -n; i <= n; i++) {
                    let mainGrad = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(mainGrad, "class", "main-grad");
                    diffAndSetAttribute(mainGrad, "x", "0");
                    diffAndSetAttribute(mainGrad, "y", fastToFixed(center - 2 + i * graduationSize, 0));
                    diffAndSetAttribute(mainGrad, "height", "4");
                    diffAndSetAttribute(mainGrad, "width", "40");
                    diffAndSetAttribute(mainGrad, "fill", "white");
                    this.graduationGroup.appendChild(mainGrad);
                    let gradText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(gradText, "class", "graduation-text");
                    diffAndSetAttribute(gradText, "x", "50");
                    diffAndSetAttribute(gradText, "y", fastToFixed(center + 16 + i * graduationSize, 0));
                    diffAndSetAttribute(gradText, "fill", "white");
                    diffAndSetAttribute(gradText, "font-size", "60");
                    diffAndSetAttribute(gradText, "font-family", this.GF_font);
                    diffAndSetText(gradText, "XXXX");
                    this.graduationGroup.appendChild(gradText);
                    this.graduationTexts.push(gradText);
                    for (let j = 1; j < 5; j++) {
                        let grad = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(grad, "class", "grad");
                        diffAndSetAttribute(grad, "x", "0");
                        diffAndSetAttribute(grad, "y", fastToFixed(center - 2 + i * graduationSize + j * (graduationSize / 5), 0));
                        diffAndSetAttribute(grad, "height", "4");
                        diffAndSetAttribute(grad, "width", "15");
                        diffAndSetAttribute(grad, "fill", "white");
                        this.graduationGroup.appendChild(grad);
                    }
                }
            }
            this.trendElement = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.trendElement, "class", "trend-element");
            diffAndSetAttribute(this.trendElement, "x", "0");
            diffAndSetAttribute(this.trendElement, "y", "-50");
            diffAndSetAttribute(this.trendElement, "width", "8");
            diffAndSetAttribute(this.trendElement, "height", "0");
            diffAndSetAttribute(this.trendElement, "fill", "#d12bc7");
            this.root.appendChild(this.trendElement);
            this.groundLine = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.groundLine, "class", "ground-line");
            diffAndSetAttribute(this.groundLine, "transform", "translate(0, " + this.height + ")");
            graduationSvg.appendChild(this.groundLine);
            {
                let background = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(background, "class", "ground-line-background");
                diffAndSetAttribute(background, "fill", "#654222");
                diffAndSetAttribute(background, "stroke", "white");
                diffAndSetAttribute(background, "stroke-width", "4");
                diffAndSetAttribute(background, "x", "0");
                diffAndSetAttribute(background, "y", "0");
                diffAndSetAttribute(background, "width", "196");
                diffAndSetAttribute(background, "height", (this.height - 100) + '');
                this.groundLine.appendChild(background);
                let groundLineSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(groundLineSvg, "class", "ground-line-hash-wrapper");
                diffAndSetAttribute(groundLineSvg, "x", "0");
                diffAndSetAttribute(groundLineSvg, "y", "0");
                diffAndSetAttribute(groundLineSvg, "width", "200");
                diffAndSetAttribute(groundLineSvg, "height", (this.height - 100) + '');
                diffAndSetAttribute(groundLineSvg, "viewBox", "0 0 200 " + (this.height - 100));
                this.groundLine.appendChild(groundLineSvg);
                for (let i = -5; i <= 25; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line, "class", "ground-line-hash");
                    diffAndSetAttribute(line, "fill", "white");
                    diffAndSetAttribute(line, "x", "0");
                    diffAndSetAttribute(line, "y", (-50 + i * 30) + '');
                    diffAndSetAttribute(line, "width", "200");
                    diffAndSetAttribute(line, "height", "4");
                    diffAndSetAttribute(line, "transform", "skewY(-30)");
                    groundLineSvg.appendChild(line);
                }
            }
            // cursor polygon
            let cursor = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(cursor, "class", "cursor");
            diffAndSetAttribute(cursor, "d", "M0 " + center + " L28 " + (center - 20) + " L28 " + (center - 50) + " L145 " + (center - 50) + " L145 " + (center - 80) + " L226 " + (center - 80) + " L226 " + (center + 80) + " L145 " + (center + 80) + " L145 " + (center + 50) + " L28 " + (center + 50) + " L28 " + (center + 20) + " L0 " + center + "Z");
            diffAndSetAttribute(cursor, "fill", "#1a1d21");
            diffAndSetAttribute(cursor, "stroke", "white");
            diffAndSetAttribute(cursor, "stroke-width", "3");
            graduationSvg.appendChild(cursor);
            let cursorBaseSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(cursorBaseSvg, "class", "cursor-svg");
            diffAndSetAttribute(cursorBaseSvg, "x", "30");
            diffAndSetAttribute(cursorBaseSvg, "y", (center - 48) + ''); // 40
            diffAndSetAttribute(cursorBaseSvg, "width", "120");
            diffAndSetAttribute(cursorBaseSvg, "height", "80");
            diffAndSetAttribute(cursorBaseSvg, "viewBox", "0 0 120 80");
            graduationSvg.appendChild(cursorBaseSvg);
            // enclose numbers in group
            let digitGroup =  document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(digitGroup, "class", "cursor-static-digit-group");
            diffAndSetAttribute(digitGroup, "transform", "scale(1, 1.25)");
            {
                this.digit1Top = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.digit1Top, "x", "4");
                diffAndSetAttribute(this.digit1Top, "y", "-1");
                diffAndSetAttribute(this.digit1Top, "fill", "white");
                diffAndSetAttribute(this.digit1Top, "font-size", "56");
                diffAndSetAttribute(this.digit1Top, "font-family", this.GF_font);
                diffAndSetText(this.digit1Top, "X");
                digitGroup.appendChild(this.digit1Top);
                this.digit1Bot = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.digit1Bot, "x", "4");
                diffAndSetAttribute(this.digit1Bot, "y", "57");
                diffAndSetAttribute(this.digit1Bot, "fill", "white");
                diffAndSetAttribute(this.digit1Bot, "font-size", "56");
                diffAndSetAttribute(this.digit1Bot, "font-family", this.GF_font);
                diffAndSetText(this.digit1Bot, "X");
                digitGroup.appendChild(this.digit1Bot);
                this.digit2Top = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.digit2Top, "x", "42");
                diffAndSetAttribute(this.digit2Top, "y", "-1");
                diffAndSetAttribute(this.digit2Top, "fill", "white");
                diffAndSetAttribute(this.digit2Top, "font-size", "56");
                diffAndSetAttribute(this.digit2Top, "font-family", this.GF_font);
                diffAndSetText(this.digit2Top, "X");
                digitGroup.appendChild(this.digit2Top);
                this.digit2Bot = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.digit2Bot, "x", "42");
                diffAndSetAttribute(this.digit2Bot, "y", "57");
                diffAndSetAttribute(this.digit2Bot, "fill", "white");
                diffAndSetAttribute(this.digit2Bot, "font-size", "56");
                diffAndSetAttribute(this.digit2Bot, "font-family", this.GF_font);
                diffAndSetText(this.digit2Bot, "X");
                digitGroup.appendChild(this.digit2Bot);
                this.digit3Top = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.digit3Top, "x", "80");
                diffAndSetAttribute(this.digit3Top, "y", "-1");
                diffAndSetAttribute(this.digit3Top, "fill", "white");
                diffAndSetAttribute(this.digit3Top, "font-size", "48");
                diffAndSetAttribute(this.digit3Top, "font-family", this.GF_font);
                diffAndSetText(this.digit3Top, "X");
                digitGroup.appendChild(this.digit3Top);
                this.digit3Bot = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetAttribute(this.digit3Bot, "x", "80");
                diffAndSetAttribute(this.digit3Bot, "y", "54");
                diffAndSetAttribute(this.digit3Bot, "fill", "white");
                diffAndSetAttribute(this.digit3Bot, "font-size", "48");
                diffAndSetAttribute(this.digit3Bot, "font-family", this.GF_font);
                diffAndSetText(this.digit3Bot, "X");
                digitGroup.appendChild(this.digit3Bot);
            }
            cursorBaseSvg.appendChild(digitGroup);

            let cursorRotatingSvg = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(cursorRotatingSvg, "class", "cursor-rotatating-group");
            diffAndSetAttribute(cursorRotatingSvg, "x", "140");
            diffAndSetAttribute(cursorRotatingSvg, "y", (center - 75) + '');
            diffAndSetAttribute(cursorRotatingSvg, "width", "80");
            diffAndSetAttribute(cursorRotatingSvg, "height", "150");
            diffAndSetAttribute(cursorRotatingSvg, "viewBox", "0 -66 80 150");
            graduationSvg.appendChild(cursorRotatingSvg);
            {
                this.endDigitsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(this.endDigitsGroup, "class", "cursor-rotatating-text-group");
                cursorRotatingSvg.appendChild(this.endDigitsGroup);

                // wrap digits in a group to scale
                let endDigitsScaleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.endDigitsGroup.appendChild(endDigitsScaleGroup);
                diffAndSetAttribute(endDigitsScaleGroup, "transform", "scale(1, 1.15)");

                this.endDigits = [];
                for (let i = -2; i <= 2; i++) {
                    let digit = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(digit, "x", "46");
                    diffAndSetAttribute(digit, "y", (27 + this.endDigitSpace * i) + '');
                    diffAndSetAttribute(digit, "fill", "white");
                    diffAndSetAttribute(digit, "font-size", "50");
                    diffAndSetAttribute(digit, "font-family", this.GF_font);
                    diffAndSetAttribute(digit, "text-anchor", "middle");
                    diffAndSetText(digit, "XX");
                    this.endDigits.push(digit);
                    endDigitsScaleGroup.appendChild(digit);
                }
            }
            this.bugsGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(this.bugsGroup, "class", "bugs-group");
            graduationSvg.appendChild(this.bugsGroup);
            {
                this.selectedAltitudeBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.selectedAltitudeBug, "class", "selected-altitude-bug");
                diffAndSetAttribute(this.selectedAltitudeBug, "points", "0," + (center - 50) + " 25," + (center - 50) + " 25," + (center - 22) + " 0," + center + " 25," + (center + 22) + " 25," + (center + 50) + " 0," + (center + 50)); // Reshaped
                diffAndSetAttribute(this.selectedAltitudeBug, "fill", "#36c8d2");
                this.bugsGroup.appendChild(this.selectedAltitudeBug);
                this.minimumAltitudeBug = document.createElementNS(Avionics.SVG.NS, "polyline");
                diffAndSetAttribute(this.minimumAltitudeBug, "class", "minimum-altitude-bug");
                diffAndSetAttribute(this.minimumAltitudeBug, "points", "20," + (center - 40) + " 20," + (center - 27) + " 0," + center + " 20," + (center + 27) + " 20," + (center + 40));
                diffAndSetAttribute(this.minimumAltitudeBug, "stroke", "#36c8d2");
                diffAndSetAttribute(this.minimumAltitudeBug, "fill", "none");
                diffAndSetAttribute(this.minimumAltitudeBug, "display", "none");
                diffAndSetAttribute(this.minimumAltitudeBug, "stroke-width", "5");
                this.bugsGroup.appendChild(this.minimumAltitudeBug);
            }

        }
        {
            // add shadow on cursor
            let center = (this.height) / 2;
            const shadowRect = document.createElementNS(Avionics.SVG.NS, "rect");
            shadowRect.setAttribute("class", "cursor-shadow");
            shadowRect.setAttribute('fill', 'url(#altshadowGradient)');
            shadowRect.setAttribute('x', '148');
            shadowRect.setAttribute('y', center - 175 + '');  // 340
            shadowRect.setAttribute('width', '74');
            shadowRect.setAttribute('height', '152');
            this.root.appendChild(shadowRect);

        }

        {

             const underShadow = document.createElementNS(Avionics.SVG.NS, "rect");
            underShadow.setAttribute("class", "selected-altitude-shadow");
            underShadow.setAttribute('fill', 'url(#underShadowGradient)');
            underShadow.setAttribute('x', '0');
            underShadow.setAttribute('y', '-36');  
            underShadow.setAttribute('width', this.compactVs ? "320" : "200");
            underShadow.setAttribute('height', '30');
            this.root.appendChild(underShadow);         
            this.selectedAltitudeBackground = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.selectedAltitudeBackground, "class", "selected-altitude-background");
            diffAndSetAttribute(this.selectedAltitudeBackground, "x", "0");
            diffAndSetAttribute(this.selectedAltitudeBackground, "y", "-100");
            diffAndSetAttribute(this.selectedAltitudeBackground, "width", this.compactVs ? "320" : "200");
            diffAndSetAttribute(this.selectedAltitudeBackground, "height", "60");
            diffAndSetAttribute(this.selectedAltitudeBackground, "fill", "#1a1d21");
            diffAndSetAttribute(this.selectedAltitudeBackground, "stroke", "white");
            diffAndSetAttribute(this.selectedAltitudeBackground, "stroke-width", "3");
            this.root.appendChild(this.selectedAltitudeBackground);
            this.selectedAltitudeFixedBug = document.createElementNS(Avionics.SVG.NS, "polygon");
            diffAndSetAttribute(this.selectedAltitudeFixedBug, "class", "selected-altitude-fixed-bug");
            diffAndSetAttribute(this.selectedAltitudeFixedBug, "points", "10,-90 24,-90 24,-76 15,-70 24,-64 24,-50 10,-50 ");
            diffAndSetAttribute(this.selectedAltitudeFixedBug, "fill", "#36c8d2");
            this.root.appendChild(this.selectedAltitudeFixedBug);
            this.selectedAltText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.selectedAltText, "class", "selected-altitude-text");
            diffAndSetAttribute(this.selectedAltText, "x", "250");
            diffAndSetAttribute(this.selectedAltText, "y", "-50");
            diffAndSetAttribute(this.selectedAltText, "fill", "#36c8d2");
            diffAndSetAttribute(this.selectedAltText, "font-size", "56");
            diffAndSetAttribute(this.selectedAltText, "font-family", this.GF_font);
            diffAndSetAttribute(this.selectedAltText, "text-anchor", "end");
            diffAndSetText(this.selectedAltText, "----");
            this.root.appendChild(this.selectedAltText);
        }

        {
            this.pressureBackground = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.pressureBackground, "class", "pressure-background");
            diffAndSetAttribute(this.pressureBackground, "x", "0");
            diffAndSetAttribute(this.pressureBackground, "y", (this.height - 100 - 75) + '');
            diffAndSetAttribute(this.pressureBackground, "width", "310");
            diffAndSetAttribute(this.pressureBackground, "height", "70");
            diffAndSetAttribute(this.pressureBackground, "fill", "#1a1d21");
			diffAndSetAttribute(this.pressureBackground, "stroke", "#36c8d2"); // Added stroke
			diffAndSetAttribute(this.pressureBackground, "stroke-width", "5"); // Stroke Width 5
            this.root.appendChild(this.pressureBackground);
            this.baroText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.baroText, "class", "pressure-text");
            diffAndSetAttribute(this.baroText, "x", "20");
            diffAndSetAttribute(this.baroText, "y", (this.height - 100 - 18) + '');
            diffAndSetAttribute(this.baroText, "fill", "#36c8d2");
            diffAndSetAttribute(this.baroText, "font-size", "56");
            diffAndSetAttribute(this.baroText, "font-family", this.GF_font);
            diffAndSetAttribute(this.baroText, "letter-spacing", "0.05em");
            diffAndSetText(this.baroText, "--.--");
            this.root.appendChild(this.baroText);         
        }
        {
            switch (vsStyle) {
                case "Compact":
                    {
                        let verticalSpeedGroup = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(verticalSpeedGroup, "id", "VerticalSpeed");
                        diffAndSetAttribute(verticalSpeedGroup, "transform", "translate(52,0)");
                        this.root.appendChild(verticalSpeedGroup);
                        let background = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(background, "class", "vertical-speed-background");
                        diffAndSetAttribute(background, "d", "M200 -50 v" + (this.height - 100) + " H250 V-" + (centerY + 25) + " l-40 -25 l40 -25 V-50 Z");
                        diffAndSetAttribute(background, "fill", "#1a1d21");
                        diffAndSetAttribute(background, "fill-opacity", "0"); // set this off
                        verticalSpeedGroup.appendChild(background);
                        let leftBar = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(leftBar, "class", "vertical-speed-left-bar");
                        diffAndSetAttribute(leftBar, "x", "210");
                        diffAndSetAttribute(leftBar, "y", (centerY - 240) + '');
                        diffAndSetAttribute(leftBar, "height", '480');
                        diffAndSetAttribute(leftBar, "width", "2");
                        diffAndSetAttribute(leftBar, "fill", "white");
                        verticalSpeedGroup.appendChild(leftBar);
                        let dashes = [-240, -200, -160, -80, 80, 160, 200, 240];
                        let texts = ["2", "", "1", ".5", ".5", "1", "", "2"];
                        let height = 2.5;
                        let width = 20;
                        let fontSize = 30;
                        for (let i = 0; i < dashes.length; i++) {
                            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(rect, "class", "vertical-speed-dash");
                            diffAndSetAttribute(rect, "x", "200");
                            diffAndSetAttribute(rect, "y", (centerY - dashes[i] - height / 2) + '');
                            diffAndSetAttribute(rect, "height", height + '');
                            diffAndSetAttribute(rect, "width", (width) + '');
                            diffAndSetAttribute(rect, "fill", "white");
                            verticalSpeedGroup.appendChild(rect);
                            if (texts[i] != "") {
                                let text = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetAttribute(text, "class", "vertical-speed-dash-text");
                                diffAndSetText(text, texts[i]);
                                diffAndSetAttribute(text, "y", ((centerY - dashes[i] - height / 2) + fontSize / 3) + '');
                                diffAndSetAttribute(text, "x", "235");
                                diffAndSetAttribute(text, "fill", "white");
                                diffAndSetAttribute(text, "font-size", fontSize + '');
                                diffAndSetAttribute(text, "font-family", this.GF_font);
                                diffAndSetAttribute(text, "text-anchor", "middle");
                                verticalSpeedGroup.appendChild(text);
                            }
                        }
                        this.selectedVSBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                        diffAndSetAttribute(this.selectedVSBug, "class", "selected-VS-bug");
                        diffAndSetAttribute(this.selectedVSBug, "points", "200, " + (centerY - 20) + " 220, " + (centerY - 20) + " 220, " + (centerY - 15) + " 210, " + centerY + " 220, " + (centerY + 15) + " 220, " + (centerY + 20) + " 200, " + (centerY + 20));
                        diffAndSetAttribute(this.selectedVSBug, "fill", "#36c8d2");
                        verticalSpeedGroup.appendChild(this.selectedVSBug);
                        {
                            this.indicator = document.createElementNS(Avionics.SVG.NS, "polygon");
                            diffAndSetAttribute(this.indicator, "class", "vertical-speed-indicator");
                            diffAndSetAttribute(this.indicator, "points", "180," + (centerY + 35) + " 215," + centerY + " 180," + (centerY - 35)); // reversed
                            diffAndSetAttribute(this.indicator, "fill", "white");
                            diffAndSetAttribute(this.indicator, "stroke", "black");
                            diffAndSetAttribute(this.indicator, "stroke-width", "2.5");
                            verticalSpeedGroup.appendChild(this.indicator);
                        }
                    }
                    break;
                case "Default":
                default:
                    {
                        let verticalSpeedGroup = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(verticalSpeedGroup, "id", "VerticalSpeed");
                        diffAndSetAttribute(verticalSpeedGroup, "transform", "translate(52,0)");
                        this.root.appendChild(verticalSpeedGroup);
                        let background = document.createElementNS(Avionics.SVG.NS, "path");
                        diffAndSetAttribute(background, "class", "vertical-speed-background");
                        diffAndSetAttribute(background, "d", "M200 0 V" + (this.height - 200) + " H275 V" + (centerY + 50) + " L210 " + centerY + " L275 " + (centerY - 50) + " V0 Z");
                        diffAndSetAttribute(background, "fill", "#1a1d21");
                        diffAndSetAttribute(background, "fill-opacity", "0"); // 0.25
                        verticalSpeedGroup.appendChild(background);
                        let dashes = [-200, -150, -100, -50, 50, 100, 150, 200];
                        let height = 3;
                        let width = 10;
                        let fontSize = 30;
                        for (let i = 0; i < dashes.length; i++) {
                            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(rect, "class", "vertical-speed-dash");
                            diffAndSetAttribute(rect, "x", "200");
                            diffAndSetAttribute(rect, "y", (centerY - dashes[i] - height / 2) + '');
                            diffAndSetAttribute(rect, "height", height + '');
                            diffAndSetAttribute(rect, "width", ((dashes[i] % 100) == 0 ? 2 * width : width) + '');
                            diffAndSetAttribute(rect, "fill", "white");
                            verticalSpeedGroup.appendChild(rect);
                            if ((dashes[i] % 100) == 0) {
                                let text = document.createElementNS(Avionics.SVG.NS, "text");
                                diffAndSetAttribute(text, "class", "vertical-speed-dash-text");
                                diffAndSetText(text, (dashes[i] / 100) + '');
                                diffAndSetAttribute(text, "y", ((centerY - dashes[i] - height / 2) + fontSize / 3) + '');
                                diffAndSetAttribute(text, "x", (200 + 3 * width) + '');
                                diffAndSetAttribute(text, "fill", "white");
                                diffAndSetAttribute(text, "font-size", fontSize + '');
                                diffAndSetAttribute(text, "font-family", this.GF_font);
                                verticalSpeedGroup.appendChild(text);
                            }
                        }
                        this.selectedVSBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                        diffAndSetAttribute(this.selectedVSBug, "class", "selected-VS-bug");
                        diffAndSetAttribute(this.selectedVSBug, "points", "200, " + (centerY - 20) + " 220, " + (centerY - 20) + " 220, " + (centerY - 15) + " 210, " + centerY + " 220, " + (centerY + 15) + " 220, " + (centerY + 20) + " 200, " + (centerY + 20));
                        diffAndSetAttribute(this.selectedVSBug, "fill", "#36c8d2");
                        verticalSpeedGroup.appendChild(this.selectedVSBug);
                        {
                            this.indicator = document.createElementNS(Avionics.SVG.NS, "g");
                            verticalSpeedGroup.appendChild(this.indicator);
                            let indicatorBackground = document.createElementNS(Avionics.SVG.NS, "path");
                            diffAndSetAttribute(indicatorBackground, "class", "vertical-speed-indicator");
                            diffAndSetAttribute(indicatorBackground, "d", "M210 " + centerY + " L235 " + (centerY + 25) + " H330 V" + (centerY - 25) + " H235 Z");
                            diffAndSetAttribute(indicatorBackground, "fill", "#1a1d21");
                            this.indicator.appendChild(indicatorBackground);
                            this.indicatorText = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetAttribute(this.indicatorText, "class", "vertical-speed-indicator-text");
                            diffAndSetText(this.indicatorText, "-0000");
                            diffAndSetAttribute(this.indicatorText, "x", "235");
                            diffAndSetAttribute(this.indicatorText, "y", (centerY + 10) + '');
                            diffAndSetAttribute(this.indicatorText, "fill", "white");
                            diffAndSetAttribute(this.indicatorText, "font-size", fontSize + '');
                            diffAndSetAttribute(this.indicatorText, "font-family", this.GF_font);
                            this.indicator.appendChild(this.indicatorText);
                        }
                        this.selectedVSBackground = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(this.selectedVSBackground, "class", "selected-VS-background");
                        diffAndSetAttribute(this.selectedVSBackground, "x", "200");
                        diffAndSetAttribute(this.selectedVSBackground, "y", "-50");
                        diffAndSetAttribute(this.selectedVSBackground, "width", "75");
                        diffAndSetAttribute(this.selectedVSBackground, "height", "50");
                        diffAndSetAttribute(this.selectedVSBackground, "fill", "#1a1d21");
                        verticalSpeedGroup.appendChild(this.selectedVSBackground);
                        this.selectedVSText = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(this.selectedVSText, "class", "selected-VS-text");
                        diffAndSetAttribute(this.selectedVSText, "x", "237.5");
                        diffAndSetAttribute(this.selectedVSText, "y", "-15");
                        diffAndSetAttribute(this.selectedVSText, "fill", "#36c8d2");
                        diffAndSetAttribute(this.selectedVSText, "font-size", "25");
                        diffAndSetAttribute(this.selectedVSText, "font-family", this.GF_font);
                        diffAndSetAttribute(this.selectedVSText, "text-anchor", "middle");
                        diffAndSetText(this.selectedVSText, "----");
                        verticalSpeedGroup.appendChild(this.selectedVSText);
                    }
                    break;
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "altitude":
                let value = parseFloat(newValue);
                this.altitude = value;
                let center = Math.round(value / 100) * 100;
                diffAndSetAttribute(this.graduationGroup, "transform", "translate(0, " + ((value - center) * 160 / 100) + ")");
                diffAndSetAttribute(this.bugsGroup, "transform", "translate(0, " + ((value - center) * 160 / 100) + ")");
                diffAndSetAttribute(this.selectedAltitudeBug, "transform", "translate(0, " + (center - this.selectedAltitude) * 160 / 100 + ")");
                if (!isNaN(this.minimumAltitude)) {
                    diffAndSetAttribute(this.minimumAltitudeBug, "transform", "translate(0, " + (center - this.minimumAltitude) * 160 / 100 + ")");
                }
                if (this.currentCenterGrad != center) {
                    this.currentCenterGrad = center;
                    let n = (this.graduationTexts.length - 1) / 2;
                    for (let i = 0; i < this.graduationTexts.length; i++) {
                        diffAndSetText(this.graduationTexts[i], fastToFixed(((n - i) * 100) + center, 0));
                    }
                }
                let endValue = value % 100;
                let endCenter = Math.round(endValue / 10) * 10;
                diffAndSetAttribute(this.endDigitsGroup, "transform", "translate(0, " + ((endValue - endCenter) * this.endDigitSpace / 10) + ")");
                for (let i = 0; i < this.endDigits.length; i++) {
                    let digitValue = Math.round((((2 - i) * 10) + value) % 100 / 10) * 10;
                    diffAndSetText(this.endDigits[i], fastToFixed(Math.abs((digitValue % 100) / 10), 0) + "0");
                }
                if (Math.abs(value) >= 90) {
                    let d3Value = (Math.abs(value) % 1000) / 100;
                    diffAndSetText(this.digit3Bot, Math.abs(value) < 100 ? "" : fastToFixed(Math.floor(d3Value), 0));
                    diffAndSetText(this.digit3Top, fastToFixed((Math.floor(d3Value) + 1) % 10, 0));
                    if (endValue > 90 || endValue < -90) {
                        if (endValue < 0) {
                            diffAndSetText(this.digit3Bot, fastToFixed((Math.floor(d3Value) + 1) % 10, 0));
                            diffAndSetText(this.digit3Top, Math.abs(value) < 100 ? "" : fastToFixed(Math.floor(d3Value), 0));
                        }
                        let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 5.7;
                        diffAndSetAttribute(this.digit3Bot, "transform", "translate(0, " + translate + ")");
                        diffAndSetAttribute(this.digit3Top, "transform", "translate(0, " + translate + ")");
                    }
                    else {
                        diffAndSetAttribute(this.digit3Bot, "transform", "");
                        diffAndSetAttribute(this.digit3Top, "transform", "");
                    }
                    if (Math.abs(value) >= 990) {
                        let d2Value = (Math.abs(value) % 10000) / 1000;
                        diffAndSetText(this.digit2Bot, Math.abs(value) < 1000 ? "" : fastToFixed(Math.floor(d2Value), 0));
                        diffAndSetText(this.digit2Top, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                        if ((endValue > 90 || endValue < -90) && d3Value > 9) {
                            if (endValue < 0) {
                                diffAndSetText(this.digit2Bot, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                                diffAndSetText(this.digit2Top, Math.abs(value) < 1000 ? "" : fastToFixed(Math.floor(d2Value), 0));
                            }
                            let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 5.7;
                            diffAndSetAttribute(this.digit2Bot, "transform", "translate(0, " + translate + ")");
                            diffAndSetAttribute(this.digit2Top, "transform", "translate(0, " + translate + ")");
                        }
                        else {
                            diffAndSetAttribute(this.digit2Bot, "transform", "");
                            diffAndSetAttribute(this.digit2Top, "transform", "");
                        }
                        if (Math.abs(value) >= 9990) {
                            let d1Value = (Math.abs(value) % 100000) / 10000;
                            diffAndSetText(this.digit1Bot, Math.abs(value) < 10000 ? "" : fastToFixed(Math.floor(d1Value), 0));
                            diffAndSetText(this.digit1Top, fastToFixed((Math.floor(d1Value) + 1) % 10, 0));
                            if ((endValue > 90 || endValue < -90) && d3Value > 9 && d2Value > 9) {
                                if (endValue < 0) {
                                    diffAndSetText(this.digit1Bot, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                                    diffAndSetText(this.digit1Top, Math.abs(value) < 10000 ? "" : fastToFixed(Math.floor(d2Value), 0));
                                }
                                let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 5.7;
                                diffAndSetAttribute(this.digit1Bot, "transform", "translate(0, " + translate + ")");
                                diffAndSetAttribute(this.digit1Top, "transform", "translate(0, " + translate + ")");
                            }
                            else {
                                diffAndSetAttribute(this.digit1Bot, "transform", "");
                                diffAndSetAttribute(this.digit1Top, "transform", "");
                            }
                        }
                        else {
                            diffAndSetAttribute(this.digit1Bot, "transform", "");
                            diffAndSetAttribute(this.digit1Top, "transform", "");
                            if (value < 0) {
                                diffAndSetText(this.digit1Bot, "-");
                            }
                            else {
                                diffAndSetText(this.digit1Bot, "");
                            }
                            diffAndSetText(this.digit1Top, "");
                        }
                    }
                    else {
                        diffAndSetAttribute(this.digit2Bot, "transform", "");
                        diffAndSetAttribute(this.digit2Top, "transform", "");
                        if (value < 0) {
                            diffAndSetText(this.digit2Bot, "-");
                        }
                        else {
                            diffAndSetText(this.digit2Bot, "");
                        }
                        diffAndSetText(this.digit1Bot, "");
                        diffAndSetText(this.digit1Top, "");
                        diffAndSetText(this.digit2Top, "");
                    }
                }
                else {
                    if (value < 0) {
                        diffAndSetText(this.digit3Bot, "-");
                    }
                    else {
                        diffAndSetText(this.digit3Bot, "");
                    }
                    diffAndSetText(this.digit2Bot, "");
                    diffAndSetText(this.digit1Bot, "");
                    diffAndSetText(this.digit2Top, "");
                    diffAndSetText(this.digit1Top, "");
                    diffAndSetAttribute(this.digit3Bot, "transform", "");
                    diffAndSetAttribute(this.digit3Top, "transform", "");
                }
                break;
            case "radar-altitude":
                diffAndSetAttribute(this.groundLine, "transform", "translate(0," + Math.min(((this.height - 100) / 2) + parseFloat(newValue) * 160 / 100, this.height) + ")");
                break;
            case "no-reference-altitude":
                if (newValue == "true") {
                    diffAndSetAttribute(this.selectedAltText, "visibility", "hidden");
                    diffAndSetAttribute(this.selectedAltitudeBackground, "visibility", "hidden");
                    diffAndSetAttribute(this.selectedAltitudeFixedBug, "visibility", "hidden");
                    diffAndSetAttribute(this.selectedAltitudeBug, "visibility", "hidden");
                }
                break;
            case "reference-altitude":
                diffAndSetText(this.selectedAltText, newValue);
                if (newValue != "----") {
                    this.selectedAltitude = parseFloat(newValue);
                    diffAndSetAttribute(this.selectedAltitudeBug, "transform", "translate(0, " + (Math.round(this.altitude / 100) * 100 - this.selectedAltitude) * 160 / 100 + ")");
                    diffAndSetAttribute(this.selectedAltitudeBug, "display", "");
                }
                else {
                    diffAndSetAttribute(this.selectedAltitudeBug, "display", "none");
                }
                break;
            case "reference-vspeed":
                if (newValue != "----") {
                    this.selectedVS = parseFloat(newValue);
                    if (this.compactVs) {
                        let value;
                        if (Math.abs(this.selectedVS) < 1000) {
                            value = this.selectedVS / 6.25;
                        }
                        else {
                            value = (this.selectedVS < 0 ? -160 : 160) + ((this.selectedVS - (this.selectedVS < 0 ? -1000 : 1000)) / 12.5);
                        }
                        value = -Math.max(Math.min(value, 240), -240);
                        diffAndSetAttribute(this.selectedVSBug, "transform", "translate(0, " + value + ")");
                    }
                    else {
                        this.selectedVSBug.setAttribute("transform", "translate(0, " + -Math.max(Math.min(this.selectedVS, 2250), -2250) / 10 + ")");
                        this.selectedVSText.textContent = newValue;
                    }
                    diffAndSetAttribute(this.selectedVSBug, "display", "");
                }
                else {
                    diffAndSetAttribute(this.selectedVSBug, "display", "none");
                    if (!this.compactVs) {
                        diffAndSetText(this.selectedVSText, newValue);
                    }
                }
                break;
            case "minimum-altitude":
                if (newValue == "none") {
                    this.minimumAltitude = NaN;
                }
                else {
                    this.minimumAltitude = parseFloat(newValue);
                }
                if (isNaN(this.minimumAltitude)) {
                    diffAndSetAttribute(this.minimumAltitudeBug, "display", "none");
                }
                else {
                    diffAndSetAttribute(this.minimumAltitudeBug, "display", "");
                    diffAndSetAttribute(this.minimumAltitudeBug, "transform", "translate(0, " + (Math.round(this.altitude / 100) * 100 - this.minimumAltitude) * 160 / 100 + ")");
                }
                break;
            case "minimum-altitude-state":
                switch (newValue) {
                    case "low":
                        diffAndSetAttribute(this.minimumAltitudeBug, "stroke", "yellow");
                        break;
                    case "near":
                        diffAndSetAttribute(this.minimumAltitudeBug, "stroke", "white");
                        break;
                    default:
                        diffAndSetAttribute(this.minimumAltitudeBug, "stroke", "#36c8d2");
                        break;
                }
                break;
            case "no-pressure":
                if (newValue == "true") {
                    diffAndSetAttribute(this.pressureBackground, "visibility", "hidden");
                    diffAndSetAttribute(this.baroText, "visibility", "hidden");
                }
                break;
            case "pressure":
                diffAndSetText(this.baroText, fastToFixed(parseFloat(newValue), 2) + "IN");
                break;
            case "vspeed":
                let vSpeed = parseFloat(newValue);
                if (this.compactVs) {
                    let value;
                    if (Math.abs(vSpeed) < 1000) {
                        value = vSpeed / 6.25;
                    }
                    else {
                        value = (vSpeed < 0 ? -160 : 160) + ((vSpeed - (vSpeed < 0 ? -1000 : 1000)) / 12.5);
                    }
                    value = -Math.max(Math.min(value, 240), -240);
                    diffAndSetAttribute(this.indicator, "transform", "translate(0, " + value + ")");
                }
                else {
                    this.indicator.setAttribute("transform", "translate(0, " + -Math.max(Math.min(vSpeed, 2250), -2250) / 10 + ")");
                    this.indicatorText.textContent = Math.abs(vSpeed) >= 100 ? fastToFixed(Math.round(vSpeed / 50) * 50, 0) : "";
                }
                let centerY = (this.height / 2 - 100);
                let trendValue = Utils.Clamp(centerY + (vSpeed / 10) * -1.5, -50, (this.height - 100 - 50));
                diffAndSetAttribute(this.trendElement, "y", Math.min(trendValue, centerY) + '');
                diffAndSetAttribute(this.trendElement, "height", Math.abs(trendValue - centerY) + '');
                break;
            case "vertical-deviation-mode":
                switch (newValue) {
                    case "VDI":
                        this.currentMode = 1;
                        diffAndSetText(this.verticalDeviationText, "V");
                        diffAndSetAttribute(this.verticalDeviationText, "fill", "#d12bc7");
                        diffAndSetAttribute(this.diamondBug, "visibility", "hidden");
                        diffAndSetAttribute(this.chevronBug, "visibility", "inherit");
                        diffAndSetAttribute(this.hollowDiamondBug, "visibility", "hidden");
                        diffAndSetAttribute(this.verticalDeviationGroup, "visibility", "inherit");
                        break;
                    case "GS":
                        this.currentMode = 2;
                        diffAndSetText(this.verticalDeviationText, "G");
                        diffAndSetAttribute(this.verticalDeviationText, "fill", "#10c210");
                        diffAndSetAttribute(this.diamondBug, "visibility", "inherit");
                        diffAndSetAttribute(this.diamondBug, "fill", "#10c210");
                        diffAndSetAttribute(this.chevronBug, "visibility", "hidden");
                        diffAndSetAttribute(this.hollowDiamondBug, "visibility", "hidden");
                        diffAndSetAttribute(this.verticalDeviationGroup, "visibility", "inherit");
                        break;
                    case "GSPreview":
                        this.currentMode = 4;
                        diffAndSetText(this.verticalDeviationText, "G");
                        diffAndSetAttribute(this.verticalDeviationText, "fill", "#DFDFDF");
                        diffAndSetAttribute(this.diamondBug, "visibility", "hidden");
                        diffAndSetAttribute(this.chevronBug, "visibility", "hidden");
                        diffAndSetAttribute(this.hollowDiamondBug, "visibility", "inherit");
                        diffAndSetAttribute(this.verticalDeviationGroup, "visibility", "inherit");
                        break;
                    case "GP":
                        this.currentMode = 3;
                        diffAndSetText(this.verticalDeviationText, "G");
                        diffAndSetAttribute(this.verticalDeviationText, "fill", "#d12bc7");
                        diffAndSetAttribute(this.diamondBug, "visibility", "inherit");
                        diffAndSetAttribute(this.diamondBug, "fill", "#d12bc7");
                        diffAndSetAttribute(this.chevronBug, "visibility", "hidden");
                        diffAndSetAttribute(this.hollowDiamondBug, "visibility", "hidden");
                        diffAndSetAttribute(this.verticalDeviationGroup, "visibility", "inherit");
                        break;
                    default:
                        this.currentMode = 0;
                        diffAndSetAttribute(this.verticalDeviationGroup, "visibility", "hidden");
                        break;
                }
                break;
            case "vertical-deviation-value":
                let pos = (Math.min(Math.max(parseFloat(newValue), -1), 1) * 200);
                diffAndSetAttribute(this.chevronBug, "transform", "translate(0," + pos + ")");
                diffAndSetAttribute(this.diamondBug, "transform", "translate(0," + pos + ")");
                diffAndSetAttribute(this.hollowDiamondBug, "transform", "translate(0," + pos + ")");
                break;
            case "selected-altitude-alert":
                switch (newValue) {
                    case "BlueBackground":
                        diffAndSetAttribute(this.selectedAltitudeBackground, "fill", "#36c8d2");
                        diffAndSetAttribute(this.selectedAltText, "fill", "#1a1d21");
                        diffAndSetAttribute(this.selectedAltitudeFixedBug, "fill", "#1a1d21");
                        break;
                    case "YellowText":
                        diffAndSetAttribute(this.selectedAltitudeBackground, "fill", "#1a1d21");
                        diffAndSetAttribute(this.selectedAltText, "fill", "yellow");
                        diffAndSetAttribute(this.selectedAltitudeFixedBug, "fill", "yellow");
                        break;
                    case "Empty":
                        diffAndSetAttribute(this.selectedAltitudeBackground, "fill", "#1a1d21");
                        diffAndSetAttribute(this.selectedAltText, "fill", "#1a1d21");
                        diffAndSetAttribute(this.selectedAltitudeFixedBug, "fill", "#1a1d21");
                        break;
                    case "BlueText":
                    default:
                        diffAndSetAttribute(this.selectedAltitudeBackground, "fill", "#1a1d21");
                        diffAndSetAttribute(this.selectedAltText, "fill", "#36c8d2");
                        diffAndSetAttribute(this.selectedAltitudeFixedBug, "fill", "#36c8d2");
                        break;
                }
        }
    }
}
customElements.define('glasscockpit-altimeter', Altimeter);
//# sourceMappingURL=Altimeter.js.map