class APInfoBar extends HTMLElement {
    constructor() {
        super(...arguments);
        this.GF_font = 'Montserrat-Bold';
        this.fontSize = 18;
        this.textBase = 15;
    }
    static get observedAttributes() {
        return [
        ];
    }
    connectedCallback() {
        // this.parseDefinitionAttributes();
        this.createSVG();
    }
    parseDefinitionAttributes() {
    }
    createSVG() {
        let width = 512;
        let height = 18;
        let center = width / 2;
        let black = "#020202";
        let white = "#F3F3F3";
        let green = "#32bd28";


        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", `${height}px`);
        diffAndSetAttribute(this.root, "viewBox", `0 0 ${width} ${height}`);
        this.appendChild(this.root);


        this.background = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.background, "class", "ap-background");
        diffAndSetAttribute(this.background, "x", "0");
        diffAndSetAttribute(this.background, "y", "0");
        diffAndSetAttribute(this.background, "width", width);
        diffAndSetAttribute(this.background, "height", height);
        diffAndSetAttribute(this.background, "fill", black);
        this.root.appendChild(this.background);

        this.underline = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.underline, "class", "underline");
        diffAndSetAttribute(this.underline, "x", "0");
        diffAndSetAttribute(this.underline, "y", height - 1);
        diffAndSetAttribute(this.underline, "height", "1");
        diffAndSetAttribute(this.underline, "width", width);
        diffAndSetAttribute(this.underline, "fill", white);
        this.root.appendChild(this.underline);        

        this.divider = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.divider, "class", "divider");
        diffAndSetAttribute(this.divider, "x", "160");
        diffAndSetAttribute(this.divider, "y", "2");
        diffAndSetAttribute(this.divider, "height", height - 6);
        diffAndSetAttribute(this.divider, "width", "1");
        diffAndSetAttribute(this.divider, "fill", white);
        this.root.appendChild(this.divider);

        this.divider2 = document.createElementNS(Avionics.SVG.NS, "rect");
        diffAndSetAttribute(this.divider2, "class", "divider");
        diffAndSetAttribute(this.divider2, "x", "256");
        diffAndSetAttribute(this.divider2, "y", "2");
        diffAndSetAttribute(this.divider2, "height", height - 6);
        diffAndSetAttribute(this.divider2, "width", "1");
        diffAndSetAttribute(this.divider2, "fill", white);
        this.root.appendChild(this.divider2);     


        this.AP_LateralArmed = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_LateralArmed, "id", "AP_LateralArmed");
        diffAndSetAttribute(this.AP_LateralArmed, "fill", white);
        diffAndSetAttribute(this.AP_LateralArmed, "x", "20");
        diffAndSetAttribute(this.AP_LateralArmed, "y", this.textBase);
        diffAndSetAttribute(this.AP_LateralArmed, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_LateralArmed, "font-family", this.GF_font);
        diffAndSetText(this.AP_LateralArmed, "GPS");
        this.root.appendChild(this.AP_LateralArmed);

        this.AP_LateralActive = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_LateralActive, "id", "AP_LateralActive");
        diffAndSetAttribute(this.AP_LateralActive, "fill", green);
        diffAndSetAttribute(this.AP_LateralActive, "x", "95");
        diffAndSetAttribute(this.AP_LateralActive, "y", this.textBase);
        diffAndSetAttribute(this.AP_LateralActive, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_LateralActive, "font-family", this.GF_font);
        diffAndSetText(this.AP_LateralActive, "HDG");
        this.root.appendChild(this.AP_LateralActive);        

        this.AP_Status = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_Status, "id", "AP_Status");
        diffAndSetAttribute(this.AP_Status, "fill", green);
        diffAndSetAttribute(this.AP_Status, "x", "195");
        diffAndSetAttribute(this.AP_Status, "y", this.textBase);
        diffAndSetAttribute(this.AP_Status, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_Status, "font-family", this.GF_font);
        diffAndSetText(this.AP_Status, "AP");
        this.root.appendChild(this.AP_Status);

        this.AP_VerticalActive = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_VerticalActive, "id", "AP_VerticalActive");
        diffAndSetAttribute(this.AP_VerticalActive, "fill", green);
        diffAndSetAttribute(this.AP_VerticalActive, "x", "280");
        diffAndSetAttribute(this.AP_VerticalActive, "y", this.textBase);
        diffAndSetAttribute(this.AP_VerticalActive, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_VerticalActive, "font-family", this.GF_font);
        diffAndSetText(this.AP_VerticalActive, "ALT");
        this.root.appendChild(this.AP_VerticalActive);

         this.AP_ModeReference = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_ModeReference, "id", "AP_ModeReference");
        diffAndSetAttribute(this.AP_ModeReference, "fill", green);
        diffAndSetAttribute(this.AP_ModeReference, "x", "330");
        diffAndSetAttribute(this.AP_ModeReference, "y", this.textBase);
        diffAndSetAttribute(this.AP_ModeReference, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_ModeReference, "font-family", this.GF_font);
        diffAndSetText(this.AP_ModeReference, "200");
        this.root.appendChild(this.AP_ModeReference);      

         this.AP_Armed = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_Armed, "id", "AP_Armed");
        diffAndSetAttribute(this.AP_Armed, "fill", white);
        diffAndSetAttribute(this.AP_Armed, "x", "410");
        diffAndSetAttribute(this.AP_Armed, "y", this.textBase);
        diffAndSetAttribute(this.AP_Armed, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_Armed, "font-family", this.GF_font);
        diffAndSetText(this.AP_Armed, "ALT");
        this.root.appendChild(this.AP_Armed);

        this.AP_ArmedReference = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetAttribute(this.AP_ArmedReference, "id", "AP_ArmedReference");
        diffAndSetAttribute(this.AP_ArmedReference, "fill", white);
        diffAndSetAttribute(this.AP_ArmedReference, "x", "480");
        diffAndSetAttribute(this.AP_ArmedReference, "y", this.textBase);
        diffAndSetAttribute(this.AP_ArmedReference, "font-size", this.fontSize);
        diffAndSetAttribute(this.AP_ArmedReference, "font-family", this.GF_font);
        diffAndSetText(this.AP_ArmedReference, "GP");
        this.root.appendChild(this.AP_ArmedReference);

    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) {
            return;
        }
    }
}
customElements.define('glasscockpit-ap-infobar', APInfoBar);
//# sourceMappingURL=APInfoBar.js.map