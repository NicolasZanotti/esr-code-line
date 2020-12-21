# Code Line Generator for Orange Payment Slips used in Switzerland

This package contains utility functions for generating the code line on the orange payment slips used in Switzerland. The code is shown on the bottom right of the slip inside the white area:

![Swiss orange inpayment slip with code line example](./doc/code-line-location.gif)

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)    |

## Specification

The slip is known under these different names and abbreviations depending on the language:

- English: _Orange inpayment slip with reference number (ISR)_
- German: _Oranger Einzahlungsschein mit Referenznummer (ESR)_
- French: _Bulletin de versement orange avec numéro de référence (BVR)_
- Italian: _Polizza di versamento arancione con numero di riferimento (PVR)_

The technical specification is from chapter 5 of the [Postfinance manual](https://www.postfinance.ch/content/dam/pfch/doc/cust/download/inpayslip_isr_man_en.pdf#page=23).

Please note that the **QR-Bill replaces this standard** (see [paymentstandards.ch](https://www.paymentstandards.ch/)). Depending on the project it may be viable to skip ahead to this newer one.

## Installation

```bash
npm install esr-code-line
```

## Usage

The code line consists of information already on the payment slip, except for the slip type:

![Code line parameters example](./doc/code-line-parameters.gif)

The parameters are:

- ![Orange](https://via.placeholder.com/15/ffdf69/000000?text=+) `slipType` a code defining the type of the slip. E.g. "01" for a ISR in CHF. See section 5.1 of the [manual](https://www.postfinance.ch/content/dam/pfch/doc/cust/download/inpayslip_isr_man_en.pdf#page=26).
- ![Red](https://via.placeholder.com/15/f03c15/000000?text=+) `amountFrancsOrEuros` the main currency unit in either CHF or EUR.
- ![Red](https://via.placeholder.com/15/f03c15/000000?text=+) `amountRappenOrCents` the fractional currency unit in Rappen or Cents.
- ![Green](https://via.placeholder.com/15/aed070/000000?text=+) `referenceNumber` the reference number with or without spaces.
- ![Blue](https://via.placeholder.com/15/2ea9da/000000?text=+) `customerNumber` the ISR customer number in CHF or EUR. Formatted VV-XXX-C. See section 5.1 of the [manual](https://www.postfinance.ch/content/dam/pfch/doc/cust/download/inpayslip_isr_man_en.pdf#page=26).

```js
const { codeLine } = require("esr-code-line");

const code = codeLine({
  slipType: "01",
  amountFrancsOrEuros: "3949",
  amountRappenOrCents: "75",
  referenceNumber: "12 00000 00000 23447 89432 16899",
  customerNumber: "01-162-8",
}); // returns "0100003949753>120000000000234478943216899+ 010001628>"
```

The codeLine function does not add check digits to the reference or customer numbers. They can however be added using the `attachCheckDigit` function included in the module.

```js
const { attachCheckDigit } = require("esr-code-line");

attachCheckDigit("04"); // returns "042"
```
