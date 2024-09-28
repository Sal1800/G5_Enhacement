var SlipSkidDisplayMode;
(function (SlipSkidDisplayMode) {
    SlipSkidDisplayMode[SlipSkidDisplayMode["ROUND"] = 0] = "ROUND";
    SlipSkidDisplayMode[SlipSkidDisplayMode["DEFAULT"] = 1] = "DEFAULT";
})(SlipSkidDisplayMode || (SlipSkidDisplayMode = {}));
class AttitudeIndicator extends HTMLElement {
    constructor() {
        super();
        this.bankSizeRatio = -24;
        this.backgroundVisible = true;
        this.bottomY = undefined;
        this.turnRateIndicatorShown = false;
        this.turnRateIndicatorMarkerX = 80;
        this.flightDirectorActive = false;
        this.flightDirectorPitch = 0;
        this.flightDirectorBank = 0;
        this.lowBankModeHeight = 500;
        this.lowMaxBankAngle = 15;
        this.aspectRatio = 1.0;
        this.isBackup = false;
        this.horizonTopColor = "#3062C8";  // Adjusted colour
        this.horizonBottomColor = "#864B01"; // Adjusted colour
        this.horizonTopColorLight = "#5F8AE0";  // Adjusted colour
        this.horizonBottomColorLight = "#A66C1D"; // Adjusted colour 
        this.horizonTopGradient = '';   //
        this.horizonBottomGradient = '';     //           
        this.GF_font = 'Montserrat-Bold';
        this.isVerticalCenter = false;
    }
    static get observedAttributes() {
        return [
            "pitch",
            "bank",
            "slip_skid",
            "background",
            "flight_director-active",
            "flight_director-pitch",
            "flight_director-bank",
            "bank_size_ratio",
            "aspect-ratio",
            "is-backup",
            "low-bank-mode"
        ];
    }
    parseDefinitionAttributes() {
        let isVerticalCenter = this.getAttribute("vertical-center");
        if (isVerticalCenter) {
            this.isVerticalCenter = (isVerticalCenter == "True");
        }
        switch (this.getAttribute("slip-skid-display-mode")) {
            case "Round":
                this.slipSkidDisplayMode = SlipSkidDisplayMode.ROUND;
                break;
            default:
                this.slipSkidDisplayMode = SlipSkidDisplayMode.DEFAULT;
                break;
        }
        let turnRateIndicatorShown = this.getAttribute("show-turn-rate");
        if (turnRateIndicatorShown) {
            this.turnRateIndicatorShown = (turnRateIndicatorShown == "True");
        }
        let bottomY = this.getAttribute("bottom-y");
        if (bottomY) {
            this.bottomY = parseFloat(bottomY);
        }
    }
    connectedCallback() {
        this.parseDefinitionAttributes();
        this.construct();
    }
    buildGraduations() {
        if (!this.attitude_pitch)
            return;
        this.attitude_pitch.innerHTML = "";
        let maxDash = 80;
        let fullPrecisionLowerLimit = -20;
        let fullPrecisionUpperLimit = 20;
        let halfPrecisionLowerLimit = -30;
        let halfPrecisionUpperLimit = 45;
        let unusualAttitudeLowerLimit = -30;
        let unusualAttitudeUpperLimit = 50;
        let bigWidth = 120;
        let bigHeight = 3;
        let mediumWidth = 60;
        let mediumHeight = 3;
        let smallWidth = 40;
        let smallHeight = 2;
        let fontSize = 20;
        let angle = -maxDash;
        let nextAngle;
        let width;
        let height;
        let text;
        while (angle <= maxDash) {
            if (angle % 10 == 0) {
                width = bigWidth;
                height = bigHeight;
                text = true;
                if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                    nextAngle = angle + 2.5;
                }
                else if (angle >= halfPrecisionLowerLimit && angle < halfPrecisionUpperLimit) {
                    nextAngle = angle + 5;
                }
                else {
                    nextAngle = angle + 10;
                }
            }
            else {
                if (angle % 5 == 0) {
                    width = mediumWidth;
                    height = mediumHeight;
                    text = true;
                    if (angle >= fullPrecisionLowerLimit && angle < fullPrecisionUpperLimit) {
                        nextAngle = angle + 2.5;
                    }
                    else {
                        nextAngle = angle + 5;
                    }
                }
                else {
                    width = smallWidth;
                    height = smallHeight;
                    nextAngle = angle + 2.5;
                    text = false;
                }
            }
            if (angle != 0) {
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "class", "attitude-pitch-gradation")
                diffAndSetAttribute(rect, "fill", "white");
                diffAndSetAttribute(rect, "x", (-width / 2) + '');
                diffAndSetAttribute(rect, "y", (this.bankSizeRatio * angle - height / 2) + '');
                diffAndSetAttribute(rect, "width", width + '');
                diffAndSetAttribute(rect, "height", height + '');
                this.attitude_pitch.appendChild(rect);
                if (text) {
                    let leftText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(leftText, "class", "attitude-pitch-left-text");
                    diffAndSetText(leftText, Math.abs(angle) + '');
                    diffAndSetAttribute(leftText, "x", ((-width / 2) - 5) + '');
                    diffAndSetAttribute(leftText, "y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2) + '');
                    diffAndSetAttribute(leftText, "text-anchor", "end");
                    diffAndSetAttribute(leftText, "font-size", fontSize + '');
                    diffAndSetAttribute(leftText, "font-family", this.GF_font);
                    diffAndSetAttribute(leftText, "fill", "white");
                    this.attitude_pitch.appendChild(leftText);
                    let rightText = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(rightText, "class", "attitude-pitch-right-text");
                    diffAndSetText(rightText, Math.abs(angle) + '');
                    diffAndSetAttribute(rightText, "x", ((width / 2) + 5) + '');
                    diffAndSetAttribute(rightText, "y", (this.bankSizeRatio * angle - height / 2 + fontSize / 2) + '');
                    diffAndSetAttribute(rightText, "text-anchor", "start");
                    diffAndSetAttribute(rightText, "font-size", fontSize + '');
                    diffAndSetAttribute(rightText, "font-family", this.GF_font);
                    diffAndSetAttribute(rightText, "fill", "white");
                    this.attitude_pitch.appendChild(rightText);
                }
                if (angle < unusualAttitudeLowerLimit) {
                    let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                    let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * nextAngle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                    path += "L" + bigWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 ";
                    path += "L0 " + (this.bankSizeRatio * nextAngle + 20) + " ";
                    path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                    diffAndSetAttribute(chevron, "d", path);
                    diffAndSetAttribute(chevron, "fill", "red");
                    this.attitude_pitch.appendChild(chevron);
                }
                if (angle >= unusualAttitudeUpperLimit && nextAngle <= maxDash) {
                    let chevron = document.createElementNS(Avionics.SVG.NS, "path");
                    let path = "M" + -smallWidth / 2 + " " + (this.bankSizeRatio * angle - bigHeight / 2) + " l" + smallWidth + "  0 ";
                    path += "L" + (bigWidth / 2) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 ";
                    path += "L0 " + (this.bankSizeRatio * angle - 20) + " ";
                    path += "L" + (-bigWidth / 2 + smallWidth) + " " + (this.bankSizeRatio * nextAngle + bigHeight / 2) + " l" + -smallWidth + " 0 Z";
                    diffAndSetAttribute(chevron, "d", path);
                    diffAndSetAttribute(chevron, "fill", "red");
                    this.attitude_pitch.appendChild(chevron);
                }
            }
            angle = nextAngle;
        }
    }
    construct() {
        Utils.RemoveAllChildren(this);
        if (!this.bottomY) {
            this.bottomY = this.isVerticalCenter ? 150 : 100;
        }
        {
            this.horizon = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.horizon, "class", "horizon-svg");
            diffAndSetAttribute(this.horizon, "width", "100%");
            diffAndSetAttribute(this.horizon, "height", "100%");
            diffAndSetAttribute(this.horizon, "viewBox", this.isVerticalCenter ? "-200 -150 400 300" : "-200 -200 400 300");
            diffAndSetAttribute(this.horizon, "x", "-100");
            diffAndSetAttribute(this.horizon, "y", "-100");
            diffAndSetAttribute(this.horizon, "overflow", "visible");
            diffAndSetAttribute(this.horizon, "style", "position:absolute; z-index: -2; width: 100%; height:100%;");
            this.appendChild(this.horizon);
            // add defs
            const horizonDefs = document.createElementNS(Avionics.SVG.NS, "defs");
            // Create sky gradient
            const skyGradient = document.createElementNS(Avionics.SVG.NS, "linearGradient");
            skyGradient.setAttribute("id", "skyGradient");
            skyGradient.setAttribute("gradientTransform", "rotate(90)");

            const skyStop1 = document.createElementNS(Avionics.SVG.NS, "stop");
            skyStop1.setAttribute("offset", "42%");
            skyStop1.setAttribute("stop-color", this.horizonTopColor);  // Original color

            const skyStop2 = document.createElementNS(Avionics.SVG.NS, "stop");
            skyStop2.setAttribute("offset", "50%");
            skyStop2.setAttribute("stop-color", this.horizonTopColorLight);  // Slightly lighter blue

            const skyStop3 = document.createElementNS(Avionics.SVG.NS, "stop");
            skyStop3.setAttribute("offset", "100%");
            skyStop3.setAttribute("stop-color", this.horizonTopColor);  // Back to original color

            skyGradient.appendChild(skyStop1);
            skyGradient.appendChild(skyStop2);
            skyGradient.appendChild(skyStop3);

            // Ground gradient
            const groundGradient = document.createElementNS(Avionics.SVG.NS, "linearGradient");
            groundGradient.setAttribute("id", "groundGradient");
            groundGradient.setAttribute("gradientTransform", "rotate(90)");

            const groundStop1 = document.createElementNS(Avionics.SVG.NS, "stop");
            groundStop1.setAttribute("offset", "0%");
            groundStop1.setAttribute("stop-color", this.horizonBottomColorLight);  // Lighter brown

            const groundStop2 = document.createElementNS(Avionics.SVG.NS, "stop");
            groundStop2.setAttribute("offset", "10%");
            groundStop2.setAttribute("stop-color", this.horizonBottomColor);  // original color

            groundGradient.appendChild(groundStop1);
            groundGradient.appendChild(groundStop2);

            horizonDefs.appendChild(skyGradient);
            horizonDefs.appendChild(groundGradient);

            this.horizon.appendChild(horizonDefs);
            this.horizonTopGradient = 'url(#skyGradient)';
            this.horizonBottomGradient = 'url(#groundGradient)';

            this.horizonTop = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizonTop, "class", "horizon-top");
            diffAndSetAttribute(this.horizonTop, "fill", (this.backgroundVisible) ? this.horizonTopGradient : "transparent");
            diffAndSetAttribute(this.horizonTop, "x", "-1000");
            diffAndSetAttribute(this.horizonTop, "y", "-1000");
            diffAndSetAttribute(this.horizonTop, "width", "2000");
            diffAndSetAttribute(this.horizonTop, "height", "2000");
            this.horizon.appendChild(this.horizonTop);
            this.bottomPart = document.createElementNS(Avionics.SVG.NS, "g");
            this.horizon.appendChild(this.bottomPart);
            this.horizonBottom = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(this.horizonBottom, "class", "horizon-bottom");
            diffAndSetAttribute(this.horizonBottom, "fill", (this.backgroundVisible) ? this.horizonBottomGradient : "transparent");
            diffAndSetAttribute(this.horizonBottom, "x", "-1500");
            diffAndSetAttribute(this.horizonBottom, "y", "0");
            diffAndSetAttribute(this.horizonBottom, "width", "3000");
            diffAndSetAttribute(this.horizonBottom, "height", "3000");
            this.bottomPart.appendChild(this.horizonBottom);
            let separator = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(separator, "class", "horizon-separator");
            diffAndSetAttribute(separator, "fill", "white");
            diffAndSetAttribute(separator, "x", "-1500");
            diffAndSetAttribute(separator, "y", "-3");
            diffAndSetAttribute(separator, "width", "3000");
            diffAndSetAttribute(separator, "height", "4");
			// diffAndSetAttribute(separator, "stroke", "black"); 
			// diffAndSetAttribute(separator, "stroke-width", "1"); 
            this.bottomPart.appendChild(separator);
        }
        let attitudeContainer = document.createElement("div");
        diffAndSetAttribute(attitudeContainer, "id", "Attitude");
        attitudeContainer.style.width = "100%";
        attitudeContainer.style.height = "100%";
        attitudeContainer.style.position = "absolute";
        this.appendChild(attitudeContainer);
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "class", "attitude-root");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", this.isVerticalCenter ? "-200 -150 400 300" : "-200 -200 400 300");
        diffAndSetAttribute(this.root, "overflow", "visible");
        diffAndSetAttribute(this.root, "style", "position:absolute");
        attitudeContainer.appendChild(this.root);
        let refHeight = (this.isBackup) ? 330 : 230;
        let y = (this.isVerticalCenter) ? -80 : -130;
        let attitude_pitch_container = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(attitude_pitch_container, "class", "attitude_pitch_container");
        diffAndSetAttribute(attitude_pitch_container, "width", "230");
        diffAndSetAttribute(attitude_pitch_container, "height", refHeight + '');
        diffAndSetAttribute(attitude_pitch_container, "x", "-115");
        diffAndSetAttribute(attitude_pitch_container, "y", y + '');
        diffAndSetAttribute(attitude_pitch_container, "viewBox", "-115 " + y + " 230 " + refHeight + '');
        diffAndSetAttribute(attitude_pitch_container, "overflow", "hidden");
        this.root.appendChild(attitude_pitch_container);
        this.attitude_pitch = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.attitude_pitch, "class", "attitude_pitch");
        attitude_pitch_container.appendChild(this.attitude_pitch);
        this.buildGraduations();
        this.flightDirector = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.flightDirector, "class", "flight-director");
        attitude_pitch_container.appendChild(this.flightDirector);
        // FD
        let triangleOuterLeft = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(triangleOuterLeft, "class", "flight-director-outer-left");
        diffAndSetAttribute(triangleOuterLeft, "d", "M-100 40 -100 20 0 0 -85 40 Z"); //adjusted FD size
        diffAndSetAttribute(triangleOuterLeft, "fill", "#d12bc7");
        diffAndSetAttribute(triangleOuterLeft, "stroke", "black");
        diffAndSetAttribute(triangleOuterLeft, "stroke-width", "1.5");
        this.flightDirector.appendChild(triangleOuterLeft);
        let triangleOuterLeftLine = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(triangleOuterLeftLine, "class", "flight-director-outer-left-line");
        diffAndSetAttribute(triangleOuterLeftLine, "d", "M-100 20 L-85 40 Z");
        diffAndSetAttribute(triangleOuterLeftLine, "stroke", "black");
        diffAndSetAttribute(triangleOuterLeftLine, "stroke-width", "1.5");
        this.flightDirector.appendChild(triangleOuterLeftLine);

        let triangleOuterRight = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(triangleOuterRight, "class", "flight-director-outer-right");
        diffAndSetAttribute(triangleOuterRight, "d", "M100 40 100 20 0 0 85 40 Z"); //adjusted FD size
        diffAndSetAttribute(triangleOuterRight, "fill", "#d12bc7");
        diffAndSetAttribute(triangleOuterRight, "stroke", "black");
        diffAndSetAttribute(triangleOuterRight, "stroke-width", "1.5");
        this.flightDirector.appendChild(triangleOuterRight);
        let triangleOuterRightLine = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(triangleOuterRightLine, "class", "flight-director-outer-right-line");
        diffAndSetAttribute(triangleOuterRightLine, "d", "M100 20 L85 40 Z");
        diffAndSetAttribute(triangleOuterRightLine, "stroke", "black");
        diffAndSetAttribute(triangleOuterRightLine, "stroke-width", "1.5");
        this.flightDirector.appendChild(triangleOuterRightLine);

        let topY = this.isVerticalCenter ? -120 : -170;
{
    this.attitude_bank = document.createElementNS(Avionics.SVG.NS, "g");
    diffAndSetAttribute(this.attitude_bank, "class", "attitude_bank");
    this.root.appendChild(this.attitude_bank);

    // Create the top triangle
    let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
    diffAndSetAttribute(this.topTriangle, "class", "attitude_bank_triangle");
    diffAndSetAttribute(topTriangle, "d", "M0 " + topY + " l -10 -20 l20 0 Z");
    diffAndSetAttribute(topTriangle, "fill", "white");
    this.attitude_bank.appendChild(topTriangle);

    // Parameters for dashes
    let bigDashes = [-60, -30, 30, 60];
    let smallDashes = [-45, -20, -10, 10, 20, 45];
    let radius = -topY;
    let width = 3; // thinner dashes (4)
    let height = 20;  // made dashes shorter

    // Create big dashes
    for (let i = 0; i < bigDashes.length; i++) {
        let dash = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(dash, "class", "attitude-arc-big-dash");
        diffAndSetAttribute(dash, "x", (-width / 2) + '');
        diffAndSetAttribute(dash, "y", (-radius - height) + '');
        diffAndSetAttribute(dash, "height", height + '');
        diffAndSetAttribute(dash, "width", width + '');
        diffAndSetAttribute(dash, "fill", "white");
        diffAndSetAttribute(dash, "transform", "rotate(" + bigDashes[i] + ",0,0)");
        this.attitude_bank.appendChild(dash);
    }

    // Parameters for small dashes
    width = 4;
    height = 12; // made dashes shorter

    // Create small dashes
    for (let i = 0; i < smallDashes.length; i++) {
        let dash = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(dash, "class", "attitude-arc-small-dash");
        diffAndSetAttribute(dash, "x", (-width / 2) + '');
        diffAndSetAttribute(dash, "y", (-radius - height) + '');
        diffAndSetAttribute(dash, "height", height + '');
        diffAndSetAttribute(dash, "width", width + '');
        diffAndSetAttribute(dash, "fill", "white");
        diffAndSetAttribute(dash, "transform", "rotate(" + smallDashes[i] + ",0,0)");
        this.attitude_bank.appendChild(dash);
    }
		let arcRadius = 126; // Doubled the radius to make the arc wider
		let startX = -106;   // Adjusted to match the new width
		let startY = -radius + 60; // height
		let endX = 106;     // Adjusted to match the new width
		let endY = -radius + 60; // height

		let arcD = "M" + startX + " " + startY + " A" + arcRadius + " " + arcRadius + " 0 0 1 " + endX + " " + endY;
		let arcPath = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(arcPath, "class", "attitude-arc");
		diffAndSetAttribute(arcPath, "d", arcD);
		diffAndSetAttribute(arcPath, "fill", "none");    
		diffAndSetAttribute(arcPath, "stroke", "white"); 
		diffAndSetAttribute(arcPath, "stroke-width", "3"); // thinner arc line (4)
		this.attitude_bank.appendChild(arcPath);
		}
		
        {
            if (this.turnRateIndicatorShown) {
                let turnRateIndicatorGroup = document.createElementNS(Avionics.SVG.NS, 'g');
                diffAndSetAttribute(turnRateIndicatorGroup, "id", "turnRateIndicator");
                this.turnRateIndicatorY = this.bottomY - 15;
                this.turnRateIndicatorHeight = 15;
                let w = 2;
                this.turnRateIndicator = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(this.turnRateIndicator, "class", "turn-rate-indicator");
                diffAndSetAttribute(this.turnRateIndicator, "fill", "#eb008b");
                diffAndSetAttribute(this.turnRateIndicator, "width", "0");
                diffAndSetAttribute(this.turnRateIndicator, "height", this.turnRateIndicatorHeight + '');
                diffAndSetAttribute(this.turnRateIndicator, "x", "0");
                diffAndSetAttribute(this.turnRateIndicator, "y", this.turnRateIndicatorY + '');
                turnRateIndicatorGroup.appendChild(this.turnRateIndicator);
                let leftMarker = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(leftMarker, "class", "turn-rate-left-marker");
                diffAndSetAttribute(leftMarker, "fill", "white");
                diffAndSetAttribute(leftMarker, "width", w + '');
                diffAndSetAttribute(leftMarker, "height", this.turnRateIndicatorHeight + '');
                diffAndSetAttribute(leftMarker, "x", (-this.turnRateIndicatorMarkerX - w / 2) + '');
                diffAndSetAttribute(leftMarker, "y", this.turnRateIndicatorY + '');
                turnRateIndicatorGroup.appendChild(leftMarker);
                let rightMarker = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rightMarker, "class", "turn-rate-right-marker");
                diffAndSetAttribute(rightMarker, "fill", "white");
                diffAndSetAttribute(rightMarker, "width", w + '');
                diffAndSetAttribute(rightMarker, "height", this.turnRateIndicatorHeight + '');
                diffAndSetAttribute(rightMarker, "x", (this.turnRateIndicatorMarkerX - w / 2) + '');
                diffAndSetAttribute(rightMarker, "y", this.turnRateIndicatorY + '');
                turnRateIndicatorGroup.appendChild(rightMarker);
                let centerMarker = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(centerMarker, "class", "turn-rate-center-marker");
                diffAndSetAttribute(centerMarker, "fill", "black");
                diffAndSetAttribute(centerMarker, "width", '1');
                diffAndSetAttribute(centerMarker, "height", this.turnRateIndicatorHeight + '');
                diffAndSetAttribute(centerMarker, "x", '-0.5');
                diffAndSetAttribute(centerMarker, "y", this.turnRateIndicatorY + '');
                turnRateIndicatorGroup.appendChild(centerMarker);
                this.root.appendChild(turnRateIndicatorGroup);
            }
        }
        {
            let cursors = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(cursors, "class", "cursors");
            this.root.appendChild(cursors);
            let leftLower = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(leftLower, "class", "cursor-left-lower");
            diffAndSetAttribute(leftLower, "d", "M-170 0 l0 5 l40 0 l10 -5 Z");
            diffAndSetAttribute(leftLower, "fill", "#cccc00");
			diffAndSetAttribute(leftLower, "stroke", "#000000"); // Black outline
			diffAndSetAttribute(leftLower, "stroke-width", "1"); // Thin outline
            cursors.appendChild(leftLower);
            let leftUpper = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(leftUpper, "class", "cursor-left-upper");
            diffAndSetAttribute(leftUpper, "d", "M-170 0 l0 -5 l40 0 l10 5 Z");
            diffAndSetAttribute(leftUpper, "fill", "#ffff00");
			diffAndSetAttribute(leftUpper, "stroke", "#000000"); // Black outline
			diffAndSetAttribute(leftUpper, "stroke-width", "1"); // Thin outline
            cursors.appendChild(leftUpper);
            let rightLower = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(rightLower, "class", "cursor-right-lower");
            diffAndSetAttribute(rightLower, "d", "M170 0 l0 5 l-40 0 l-10 -5 Z");
            diffAndSetAttribute(rightLower, "fill", "#cccc00");
			diffAndSetAttribute(rightLower, "stroke", "#000000"); // Black outline
			diffAndSetAttribute(rightLower, "stroke-width", "1"); // Thin outline
            cursors.appendChild(rightLower);
            let rightUpper = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(rightUpper, "class", "cursor-right-upper");
            diffAndSetAttribute(rightUpper, "d", "M170 0 l0 -5 l-40 0 l-10 5 Z");
            diffAndSetAttribute(rightUpper, "fill", "#ffff00");
			diffAndSetAttribute(rightUpper, "stroke", "#000000"); // Black outline
			diffAndSetAttribute(rightUpper, "stroke-width", "1"); // Thin outline
            cursors.appendChild(rightUpper);

			let triangleInnerLeft = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(triangleInnerLeft, "class", "cursor-triangle-inner-left");
			diffAndSetAttribute(triangleInnerLeft, "d", "M-60 40 -38 40 L0 0 Z"); // Adjusted coordinates
			diffAndSetAttribute(triangleInnerLeft, "fill", "#cccc00");
			diffAndSetAttribute(triangleInnerLeft, "stroke", "#000000"); // Black outline
			diffAndSetAttribute(triangleInnerLeft, "stroke-width", "1"); // Thin outline
			cursors.appendChild(triangleInnerLeft);

            let triangleOuterLeft = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(triangleOuterLeft, "class", "cursor-triangle-outer-left");
            diffAndSetAttribute(triangleOuterLeft, "d", "M-85 40 -60 40 L0 0 Z"); // Adjusted coordinates
            diffAndSetAttribute(triangleOuterLeft, "fill", "#ffff00");
            diffAndSetAttribute(triangleOuterLeft, "stroke", "#000000"); // Black outline
            diffAndSetAttribute(triangleOuterLeft, "stroke-width", "1"); // Thin outline
            cursors.appendChild(triangleOuterLeft);

			let triangleInnerRight = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(triangleInnerRight, "class", "cursor-triangle-inner-left");
			diffAndSetAttribute(triangleInnerRight, "d", "M60 40 38 40 L0 0 Z"); // Adjusted coordinates
			diffAndSetAttribute(triangleInnerRight, "fill", "#cccc00");
			diffAndSetAttribute(triangleInnerRight, "stroke", "#000000"); // Black outline
			diffAndSetAttribute(triangleInnerRight, "stroke-width", "1"); // Thin outline
			cursors.appendChild(triangleInnerRight);

            let triangleOuterRight = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(triangleOuterRight, "class", "cursor-triangle-outer-right");
            diffAndSetAttribute(triangleOuterRight, "d", "M85 40 60 40 L0 0 Z"); // Adjusted coordinates
            diffAndSetAttribute(triangleOuterRight, "fill", "#ffff00");
            diffAndSetAttribute(triangleOuterRight, "stroke", "#000000"); // Black outline
            diffAndSetAttribute(triangleOuterRight, "stroke-width", "1"); // Thin outline
            cursors.appendChild(triangleOuterRight);

            let topTriangle = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(topTriangle, "class", "cursor-top-triangle");
            diffAndSetAttribute(topTriangle, "d", "M0 " + topY + " l-13 20 l26 0 Z");
            diffAndSetAttribute(topTriangle, "fill", "white");
            this.root.appendChild(topTriangle);
        }
        {
            switch (this.slipSkidDisplayMode) {
                case SlipSkidDisplayMode.ROUND:
                    let slipSkidGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(slipSkidGroup, "id", "slipSkid");
                    let y = this.bottomY - 30;
                    this.slipSkid = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(this.slipSkid, "class", "slip-skid-ball");
                    diffAndSetAttribute(this.slipSkid, "cx", "0");
                    diffAndSetAttribute(this.slipSkid, "cy", y + '');
                    diffAndSetAttribute(this.slipSkid, "r", "10");
                    diffAndSetAttribute(this.slipSkid, "fill", "white");
                    diffAndSetAttribute(this.slipSkid, "stroke", "black");
                    slipSkidGroup.appendChild(this.slipSkid);
                    let slipSkidLeft = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(slipSkidLeft, "class", "slip-skid-left-marker");
                    diffAndSetAttribute(slipSkidLeft, "x", "-15");
                    diffAndSetAttribute(slipSkidLeft, "y", (y - 11) + '');
                    diffAndSetAttribute(slipSkidLeft, "width", "4");
                    diffAndSetAttribute(slipSkidLeft, "height", "22");
                    diffAndSetAttribute(slipSkidLeft, "fill", "white");
                    diffAndSetAttribute(slipSkidLeft, "stroke", "black");
                    slipSkidGroup.appendChild(slipSkidLeft);
                    let slipSkidRight = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(slipSkidRight, "class", "slip-skid-right-marker");
                    diffAndSetAttribute(slipSkidRight, "x", "11");
                    diffAndSetAttribute(slipSkidRight, "y", (y - 11) + '');
                    diffAndSetAttribute(slipSkidRight, "width", "4");
                    diffAndSetAttribute(slipSkidRight, "height", "22");
                    diffAndSetAttribute(slipSkidRight, "fill", "white");
                    diffAndSetAttribute(slipSkidRight, "stroke", "black");
                    slipSkidGroup.appendChild(slipSkidRight);
                    this.root.appendChild(slipSkidGroup);
                    break;
                case SlipSkidDisplayMode.DEFAULT:
                default:
                    this.slipSkid = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(this.slipSkid, "id", "slipSkid");
                    diffAndSetAttribute(this.slipSkid, "d", "M-20 " + (topY + 30) + " l4 -6 h32 l4 6 Z");
                    diffAndSetAttribute(this.slipSkid, "fill", "white");
                    this.root.appendChild(this.slipSkid);
                    break;
            }
        }
        {
            let radius = -topY;
            let maskDef = document.createElementNS(Avionics.SVG.NS, "defs");
            this.root.appendChild(maskDef);
            {
                let clipPath = document.createElementNS(Avionics.SVG.NS, "clipPath");
                maskDef.appendChild(clipPath);
                diffAndSetAttribute(clipPath, "id", "topMask");
                this.lowBankModeMask = document.createElementNS(Avionics.SVG.NS, "path");
                clipPath.appendChild(this.lowBankModeMask);
            }
            this.lowBankMode = document.createElementNS(Avionics.SVG.NS, "g");
            let green_arc = document.createElementNS(Avionics.SVG.NS, "circle");
            diffAndSetAttribute(green_arc, "class", "low-bank-green-arc");
            diffAndSetAttribute(green_arc, "cx", "0");
            diffAndSetAttribute(green_arc, "cy", "0");
            diffAndSetAttribute(green_arc, "r", (radius + ""));
            diffAndSetAttribute(green_arc, "fill", "transparent");
            diffAndSetAttribute(green_arc, "stroke", "green");
            diffAndSetAttribute(green_arc, "stroke-width", "5");
            this.lowBankMode.appendChild(green_arc);
            diffAndSetAttribute(this.lowBankMode, "clip-path", "url(#topMask)");
            this.root.appendChild(this.lowBankMode);
        }
        this.applyAttributes();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "is-backup":
                this.isBackup = newValue == "true";
                break;
            case "aspect-ratio":
                this.aspectRatio = parseFloat(newValue);
                this.construct();
                break;
            case "pitch":
                this.pitch = parseFloat(newValue);
                break;
            case "bank":
                this.bank = parseFloat(newValue);
                break;
            case "slip_skid":
                this.slipSkidValue = parseFloat(newValue);
                break;
            case "background":
                if (newValue == "false")
                    this.backgroundVisible = false;
                else
                    this.backgroundVisible = true;
                break;
            case "flight_director-active":
                this.flightDirectorActive = newValue == "true";
                break;
            case "flight_director-pitch":
                this.flightDirectorPitch = parseFloat(newValue);
                break;
            case "flight_director-bank":
                this.flightDirectorBank = parseFloat(newValue);
                break;
            case "bank_size_ratio":
                this.bankSizeRatio = parseFloat(newValue);
                this.buildGraduations();
                break;
            case "low-bank-mode":
                this.lowBankModeVisible = SimVar.GetSimVarValue("AUTOPILOT MAX BANK ID", "Bool");
                this.lowMaxBankAngle = parseFloat(newValue);
                break;
            default:
                return;
        }
        this.applyAttributes();
    }
    applyAttributes() {
        if (this.bottomPart)
            diffAndSetAttribute(this.bottomPart, "transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.attitude_pitch)
            diffAndSetAttribute(this.attitude_pitch, "transform", "rotate(" + this.bank + ", 0, 0) translate(0," + (this.pitch * this.bankSizeRatio) + ")");
        if (this.attitude_bank)
            diffAndSetAttribute(this.attitude_bank, "transform", "rotate(" + this.bank + ", 0, 0)");
        if (this.slipSkid)
            diffAndSetAttribute(this.slipSkid, "transform", "translate(" + (this.slipSkidValue * 40) + ", 0)");
        if (this.horizonTop) {
            if (this.backgroundVisible) {
                diffAndSetAttribute(this.horizonTop, "fill", this.horizonTopGradient);
                diffAndSetAttribute(this.horizonBottom, "fill", this.horizonBottomGradient);
            }
            else {
                diffAndSetAttribute(this.horizonTop, "fill", "transparent");
                diffAndSetAttribute(this.horizonBottom, "fill", "transparent");
            }
        }
        if (this.flightDirector) {
            if (this.flightDirectorActive) {
                diffAndSetAttribute(this.flightDirector, "transform", "rotate(" + (this.bank - this.flightDirectorBank) + ") translate(0 " + ((this.pitch - this.flightDirectorPitch) * this.bankSizeRatio) + ")");
                diffAndSetAttribute(this.flightDirector, "display", "");
            }
            else {
                diffAndSetAttribute(this.flightDirector, "display", "none");
            }
        }
        if (this.turnRateIndicator) {
            let turnRate = Simplane.getTurnRate();
            turnRate *= Avionics.Utils.RAD2DEG;
            if (turnRate < 0) {
                diffAndSetAttribute(this.turnRateIndicator, "transform", "rotate(180, 0, " + (this.turnRateIndicatorY + this.turnRateIndicatorHeight / 2) + ")");
            }
            else {
                diffAndSetAttribute(this.turnRateIndicator, "transform", "rotate(0, 0, " + (this.turnRateIndicatorY + this.turnRateIndicatorHeight / 2) + ")");
            }
            diffAndSetAttribute(this.turnRateIndicator, "width", (Math.abs(turnRate) * (this.turnRateIndicatorMarkerX / 3)).toFixed(6));
        }
        if (this.lowBankModeVisible) {
            diffAndSetAttribute(this.lowBankMode, "display", "");
            diffAndSetAttribute(this.lowBankMode, "transform", "rotate(" + this.bank + ", 0, 0)");
            if (!isNaN(this.lowMaxBankAngle)) {
                let arcAngle = Math.tan(this.lowMaxBankAngle * Avionics.Utils.DEG2RAD) * this.lowBankModeHeight;
                diffAndSetAttribute(this.lowBankModeMask, "d", "M 0 0 L " +
                    -arcAngle + " " + -this.lowBankModeHeight +
                    " L " + arcAngle + " " + -this.lowBankModeHeight + " L 0 0");
            }
        }
        else {
            diffAndSetAttribute(this.lowBankMode, "display", "none");
        }
    }
}
customElements.define('glasscockpit-attitude-indicator', AttitudeIndicator);
//# sourceMappingURL=AttitudeIndicator.js.map